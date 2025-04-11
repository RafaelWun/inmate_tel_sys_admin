<script setup>
/** Imports */
import { readFacility } from '@/services/facilityService';
import { createPurchase, deletePurchase, readPurchase, updatePurchase } from '@/services/purchaseService';
import { readVoucherType } from '@/services/voucherTypeService';
import { useToast } from 'primevue';
import { computed, onMounted, reactive, ref, watch } from 'vue';

const toast = useToast();

/** Passed Properties */
const props = defineProps({
    targetId: String,
    action: String
});
const emits = defineEmits(['close', 'refresh']);

/** Variables */
const purchaseData = ref({});

const form = reactive({
    po_number: '',
    date: '',
    facility_uuid: '',
    vouchers: [{ voucher_type_uuid: '', quantity: 0 }]
});

const options = reactive({
    facilities: [],
    voucherTypes: []
});

/** Computed Properties */
const isFormValid = computed(() => {
    const isMainFormValid = form.po_number.trim() !== '' && form.date.trim() !== '' && form.facility_uuid.trim() !== '';
    const hasValidVoucher = form.vouchers.some((voucher) => voucher.voucher_type_uuid.trim() !== '' && voucher.quantity >= 1);
    return isMainFormValid && hasValidVoucher;
});

/** Lifecycle Hooks */
onMounted(async () => {
    form.date = new Date().toISOString().split('T')[0];
    await loadOptions();
});

/** Functions */
const addVoucher = () => {
    form.vouchers.push({
        voucher_type_uuid: '',
        quantity: 0
    });
};

const delVoucher = (index) => {
    form.vouchers.splice(index, 1);
};

const preventNegative = (index) => {
    if (form.vouchers[index].quantity < 0) {
        form.vouchers[index].quantity = 0;
    }
};

const loadPurchaseData = async (uuid) => {
    const res = await readPurchase(uuid);
    console.log('response load purchase data: ', res);
    if (res.success) {
        console.log('success: ', res);
        purchaseData.value = res.data;
    } else {
        console.log('error: ', res);
        toast.add({ severity: 'error', summary: 'Gagal mengambil data pesanan!', detail: res.message, life: 5000 });
    }
};

const loadOptions = async () => {
    const getFacilities = await readFacility({ _page: 1, _limit: -1 });
    if (getFacilities.success) {
        options.facilities = getFacilities.data;
    } else {
        toast.add({ severity: 'error', summary: 'Gagal mengambil data fasilitas!', detail: getFacilities.message, life: 5000 });
    }
    const getTypes = await readVoucherType({ _page: 1, _limit: -1 });
    if (getTypes.success) {
        options.voucherTypes = getTypes.data;
    } else {
        toast.add({ severity: 'error', summary: 'Gagal mengambil tipe voucher!', detail: getTypes.message, life: 5000 });
    }
};

const resetForm = () => {
    Object.assign(form, {
        uuid: '',
        po_number: '',
        date: '',
        facility_uuid: '',
        vouchers: []
    });
};

const handleSubmit = async () => {
    if (!isFormValid.value) {
        toast.add({ severity: 'warn', summary: 'Form Tidak Valid!', detail: 'Mohon lengkapi semua data!', life: 5000 });
        return;
    }

    let res;
    if (props.action === 'update') {
        res = await updatePurchase({ ...form, purchases: form.vouchers.map((v) => ({ ...v })) });
    } else {
        res = await createPurchase(form);
    }

    toast.add({
        severity: res.success ? 'success' : 'error',
        summary: res.success ? 'Berhasil!' : '[views] Gagal!',
        detail: res.message,
        life: 5000
    });

    if (res.success) {
        emits('close');
        emits('refresh');
    }
};

const handleDelete = async () => {
    console.log('[handleDelete] uuid: ', form.uuid);
    if (!form.uuid) {
        toast.add({ severity: 'warn', summary: 'Gagal menghapus data!', detail: 'Data pesanan tidak valid.', life: 5000 });
        return;
    }

    const res = await deletePurchase(form.uuid);

    toast.add({
        severity: res.success ? 'success' : 'error',
        summary: res.success ? 'Berhasil menghapus data!' : 'Gagal menghapus data!',
        detail: res.message,
        life: 5000
    });

    if (res.success) {
        emits('close');
        emits('refresh');
    }
};

/** Watchers */
watch(
    () => props.targetId,
    (newId) => {
        if (newId) {
            loadPurchaseData(newId);
        } else {
            resetForm();
        }
    },
    { immediate: true }
);
watch(
    () => purchaseData.value,
    (newData) => {
        if (newData) {
            Object.assign(form, {
                uuid: newData.uuid || '',
                po_number: newData.po_number || '',
                date: newData.date || '',
                facility_uuid: newData.facility_uuid || '',
                vouchers: newData.purchases || []
            });
        }
    },
    { deep: true }
);
</script>

<template>
    <form v-if="props.action === 'create' || props.action === 'update'" @submit.prevent="handleSubmit" class="flex flex-col gap-4">
        <p v-text="form.uuid" />
        <div class="flex flex-col gap-2">
            <label v-text="'No. PO'" />
            <InputText v-model="form.po_number" placeholder="Masukkan nomor pre-order" type="text" class="min-w-96" />
        </div>
        <div class="flex flex-col gap-2">
            <label v-text="'Lapas'" />
            <Select v-model="form.facility_uuid" :options="options.facilities" option-label="name" option-value="uuid" placeholder="Pilih lokasi lapas" type="text" class="min-w-96" />
        </div>
        <div class="flex flex-col gap-2">
            <div class="grid gap-4" style="grid-template-columns: 2fr 1fr 40px">
                <label v-text="'Voucher'" />
                <label v-text="'Jumlah'" />
                <div />
            </div>
            <div v-for="(item, index) in form.vouchers" :key="index" class="grid gap-4" style="grid-template-columns: 2fr 1fr 40px">
                <Select v-model="form.vouchers[index].voucher_type_uuid" :options="options.voucherTypes" option-label="name" option-value="uuid" placeholder="Pilih voucher" type="text" class="w-full" />
                <InputText v-model="form.vouchers[index].quantity" type="number" class="w-24" @input="preventNegative(index)" />
                <Button @click="delVoucher(index)" icon="pi pi-times" variant="text" severity="danger" class="aspect-square min-w-10" />
            </div>
        </div>
        <Button @click="addVoucher" icon="pi pi-plus" label="Tambah Voucher" severity="secondary" class="mr-auto" />
        <hr />
        <div class="flex justify-end gap-2">
            <Button @click="emits('close')" type="button" icon="pi pi-angle-left" label="Batalkan" severity="secondary" />
            <Button type="submit" icon="pi pi-save" label="Submit" :disabled="!isFormValid" severity="info" />
        </div>
    </form>
    <div v-if="props.action === 'delete'">
        <p>Apakah Anda yakin ingin menghapus data pesanan <b v-text="form.po_number" class="text-red-500" />?</p>
        <hr />
        <div class="flex justify-end gap-2">
            <Button @click="emits('close')" type="button" icon="pi pi-angle-left" label="Batalkan" severity="secondary" />
            <Button @click="handleDelete" icon="pi pi-trash" label="Hapus" severity="danger" />
        </div>
    </div>
</template>
