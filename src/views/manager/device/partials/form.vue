<script setup>
/** Imports */
import { createDevice, deleteDevice, readDevice, updateDevice } from '@/services/deviceService';
import { readFacility } from '@/services/facilityService';
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
const deviceData = ref({});

const form = reactive({
    uuid: '',
    code: '',
    facility_uuid: '',
    block: '',
    imei: '',
    iccid: '',
    msisdn: '',
    ip_address: ''
});

const options = reactive({
    facilities: [],
    blocks: ['1', '2', '3', '4', '5', '6', '7', '8', '9']
});

/** Computed Properties */
const isFormValid = computed(() => {
    return form.code.trim() !== '' && form.facility_uuid.trim() !== '' && form.block.trim() !== '' && form.imei.trim() !== '' && form.iccid.trim() !== '' && form.msisdn.trim() !== '';
});

/** Lifecycle Hooks */
onMounted(async () => {
    await loadOptions();
});

/** Functions */
const loadDeviceData = async (uuid) => {
    const res = await readDevice(uuid);
    if (res.success) {
        deviceData.value = res.data;
    } else {
        toast.add({ severity: 'error', summary: 'Gagal mengambil data perangkat!', detail: res.message, life: 5000 });
    }
};

const loadOptions = async () => {
    const getFacilities = await readFacility({ _page: 1, _limit: -1 });
    if (getFacilities.success) {
        options.facilities = getFacilities.data;
    } else {
        toast.add({ severity: 'error', summary: 'Gagal mengambil data perangkat!', detail: getFacilities.message, life: 5000 });
    }
};

const resetForm = () => {
    Object.assign(form, {
        uuid: '',
        code: 'lps-bnj-00',
        facility_uuid: '0195b879-b29a-70a2-85eb-51903f0c4fcc',
        block: '1',
        imei: '',
        iccid: '',
        msisdn: '',
        ip_address: ''
    });
};

const handleSubmit = async () => {
    if (!isFormValid.value) {
        toast.add({ severity: 'warn', summary: 'Form Tidak Valid!', detail: 'Mohon lengkapi semua data!', life: 5000 });
        return;
    }

    const actionMap = {
        update: updateDevice,
        register: createDevice
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

    const res = await deleteDevice(form.uuid);

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

const handleReset = async (ip_add) => {
    if (!ip_add) {
        toast.add({ severity: 'warn', summary: 'Gagal reset layar perangkat!', detail: 'IP Address perangkat tidak valid.', life: 5000 });
        return;
    }

    const endpoint = `http://${ip_add}:5000/reset`;

    try {
        const res = await fetch(endpoint, {
            method: 'POST'
        });

        if (res) {
            toast.add({ severity: 'success', summary: 'Berhasil reset layar perangkat!', detail: 'Layar perangkat sudah di reset.', life: 5000 });
            emits('close');
        }
    } catch (error) {
        toast.add({ severity: 'danger', summary: 'Gagal reset layar perangkat!', detail: 'Error Internal.', life: 5000 });
    }
};

/** Watchers */
watch(
    () => props.targetId,
    (newId) => {
        if (newId) {
            loadDeviceData(newId);
        } else {
            resetForm();
        }
    },
    { immediate: true }
);
watch(
    () => deviceData.value,
    (newData) => {
        if (newData) {
            Object.assign(form, {
                uuid: newData.uuid || '',
                code: newData.code || '',
                facility_uuid: newData.facility_uuid || '',
                block: newData.block || '',
                imei: newData.imei || '',
                iccid: newData.iccid || '',
                msisdn: newData.msisdn || '',
                ip_address: newData.ip_address || ''
            });
        }
    },
    { deep: true }
);
</script>

<template>
    <form v-if="props.action === 'register' || props.action === 'update' || props.action === 'read'" @submit.prevent="handleSubmit" class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
            <label v-text="'Kode'" />
            <InputText v-model="form.code" placeholder="Masukkan kode perangkat" type="text" :disabled="props.action === 'update' || props.action === 'read'" class="min-w-80" />
        </div>
        <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
                <label v-text="'Lapas'" />
                <Select v-model="form.facility_uuid" :options="options.facilities" option-label="name" option-value="uuid" :disabled="props.action === 'read'" placeholder="Pilih lokasi lapas" type="text" class="min-w-80" />
            </div>
            <div class="flex flex-col gap-2">
                <label v-text="'Kode'" />
                <Select v-model="form.block" :options="options.blocks" :disabled="props.action === 'read'" placeholder="Pilih blok lapas" type="text" class="min-w-80" />
            </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
                <label v-text="'IMEI'" />
                <InputText v-model="form.imei" placeholder="Masukkan IMEI perangkat" :disabled="props.action === 'read'" type="text" class="min-w-80" />
            </div>
            <div class="flex flex-col gap-2">
                <label v-text="'ICCID'" />
                <InputText v-model="form.iccid" placeholder="Masukkan ICCID perangkat" :disabled="props.action === 'read'" type="text" class="min-w-80" />
            </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
                <label v-text="'MSISDN'" />
                <InputText v-model="form.msisdn" placeholder="Masukkan MSISDN perangkat" :disabled="props.action === 'read'" type="text" class="min-w-80" />
            </div>
            <div class="flex flex-col gap-2">
                <label v-text="'IP Address'" />
                <InputText v-model="form.ip_address" placeholder="Masukkan IP address perangkat" :disabled="props.action === 'read'" type="text" class="min-w-80" />
            </div>
        </div>
        <hr />
        <div class="flex justify-end gap-2">
            <Button @click="emits('close')" type="button" icon="pi pi-angle-left" :label="props.action === 'read' ? 'Kembali' : 'Batalkan'" :severity="props.action === 'read' ? 'info' : 'secondary'" />
            <Button v-if="props.action !== 'read'" type="submit" icon="pi pi-save" label="Submit" :disabled="!isFormValid" severity="info" />
        </div>
    </form>
    <div v-if="props.action === 'delete'">
        <p>Apakah Anda yakin ingin menghapus data perangkat <b v-text="form.code" class="text-red-500" />?</p>
        <hr />
        <div class="flex justify-end gap-2">
            <Button @click="emits('close')" type="button" icon="pi pi-angle-left" label="Batalkan" severity="secondary" />
            <Button @click="handleDelete" icon="pi pi-trash" label="Hapus" severity="danger" />
        </div>
    </div>
    <div v-if="props.action === 'reset'">
        <p>Apakah Anda yakin ingin reset layar perangkat <b v-text="form.code" class="text-amber-500" />?</p>
        <hr />
        <div class="flex justify-end gap-2">
            <Button @click="emits('close')" type="button" icon="pi pi-angle-left" label="Batalkan" severity="secondary" />
            <Button @click="handleReset(form.ip_address)" icon="pi pi-refresh" label="Reset" severity="warn" />
        </div>
    </div>
</template>
