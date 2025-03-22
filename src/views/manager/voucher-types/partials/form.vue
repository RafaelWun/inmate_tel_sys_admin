<script setup>
/** Imports */
import { createVoucherType, deleteVoucherType, readVoucherType, updateVoucherType } from '@/services/voucherTypeService';
import { useToast } from 'primevue';
import { computed, reactive, ref, watch } from 'vue';

const toast = useToast();

/** Passed Properties */
const props = defineProps({
    targetId: String,
    action: String
});
const emits = defineEmits(['close', 'refresh']);

/** Variables */
const typeData = ref({});

const form = reactive({
    uuid: '',
    name: '',
    price: ''
});

/** Computed Properties */
const isFormValid = computed(() => {
    return form.name.trim() !== '' && form.price.trim() !== '';
});

/** Functions */
const loadTypeData = async (uuid) => {
    const res = await readVoucherType(uuid);
    if (res.success) {
        typeData.value = res.data;
    } else {
        toast.add({ severity: 'error', summary: 'Gagal mengambil tipe voucher!', detail: res.message, life: 5000 });
    }
};

const resetForm = () => {
    Object.assign(form, {
        uuid: '',
        name: '',
        price: ''
    });
};

const handleSubmit = async () => {
    console.log('this button triggered');
    if (!isFormValid.value) {
        toast.add({ severity: 'warn', summary: 'Form Tidak Valid!', detail: 'Mohon lengkapi semua data!', life: 5000 });
        return;
    }

    const actionMap = {
        update: updateVoucherType,
        create: createVoucherType
    };

    if (!actionMap[props.action]) return;

    const res = await actionMap[props.action](form);

    toast.add({
        severity: res.success ? 'success' : 'error',
        summary: res.success ? 'Berhasil!' : 'Gagal!',
        detail: res.message,
        life: 5000
    });

    if (res.success) {
        emits('close');
        emits('refresh');
    }
};

const handleDelete = async () => {
    if (!form.uuid) {
        toast.add({ severity: 'warn', summary: 'Gagal menghapus data!', detail: 'Perangkat tidak valid.', life: 5000 });
        return;
    }

    const res = await deleteVoucherType(form.uuid);

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
            loadTypeData(newId);
        } else {
            resetForm();
        }
    },
    { immediate: true }
);
watch(
    () => typeData.value,
    (newData) => {
        if (newData) {
            Object.assign(form, {
                uuid: newData.uuid || '',
                name: newData.name || '',
                price: newData.price || ''
            });
        }
    },
    { deep: true }
);
</script>

<template>
    <form v-if="props.action === 'create' || props.action === 'update'" @submit.prevent="handleSubmit" class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
            <label v-text="'Nama'" />
            <InputText v-model="form.name" placeholder="Masukkan nama voucher" type="text" class="min-w-80" />
        </div>
        <div class="flex flex-col gap-2">
            <label v-text="'Alamat'" />
            <InputText v-model="form.price" placeholder="Masukkan harga voucher" type="text" class="min-w-80" />
        </div>
        <hr />
        <div class="flex justify-end gap-2">
            <Button @click="emits('close')" type="button" icon="pi pi-angle-left" label="Batalkan" severity="secondary" />
            <Button type="submit" icon="pi pi-save" label="Submit" :disabled="!isFormValid" severity="info" />
        </div>
    </form>
    <div v-if="props.action === 'delete'">
        <p>Apakah Anda yakin ingin menghapus tipe voucher <b v-text="form.name" class="text-red-500" />?</p>
        <hr />
        <div class="flex justify-end gap-2">
            <Button @click="emits('close')" type="button" icon="pi pi-angle-left" label="Batalkan" severity="secondary" />
            <Button @click="handleDelete" icon="pi pi-trash" label="Hapus" severity="danger" />
        </div>
    </div>
</template>
