<script setup>
/** Imports */
import { useModal } from '@/composables/modal';
import { readFacility } from '@/services/facilityService';
import { createPrisoner, deletePrisoner, readPrisoner, updatePrisoner } from '@/services/prisonerService';
import { useToast } from 'primevue';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import resetPinForm from './reset-pin-form.vue';

const toast = useToast();
const resetPinModal = useModal();

/** Passed Properties */
const props = defineProps({
    targetId: String,
    action: String
});
const emits = defineEmits(['close', 'refresh']);

/** Variables */
const prisonerData = ref({});

const form = reactive({
    uuid: '',
    name: '',
    facility_uuid: '',
    block: '',
    nik: '',
    pin: '',
    status: ''
});

const options = reactive({
    facilities: [],
    blocks: ['1', '2', '3', '4', '5', '6', '7', '8', '9']
});

/** Computed Properties */
const isFormValid = computed(() => {
    return form.name.trim() !== '' && form.nik.length === 16 && form.block.trim() !== '' && form.status.trim() !== '' && form.pin.trim() !== '';
});

const nikInput = computed(() => {
    if (!form.nik) return '';
    return form.nik.replace(/(\d{4})(?=\d)/g, '$1-');
});

/** Lifecycle Hooks */
onMounted(async () => {
    await loadOptions();
});

/** Functions */
const handleNikInput = (event) => {
    form.nik = event.target.value.replace(/\D/g, '').slice(0, 16);
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-EN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).format(date);
};

const calculateDuration = (start, end) => {
    if (!start || !end) return '00:00:00';

    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime - startTime;

    if (diffMs < 0) return '00:00:00';

    const seconds = Math.floor((diffMs / 1000) % 60);
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
    const hours = Math.floor(diffMs / (1000 * 60 * 60));

    return [hours, minutes, seconds].map((unit) => String(unit).padStart(2, '0')).join(':');
};

const loadPrisonerData = async (uuid) => {
    const res = await readPrisoner(uuid);
    if (res.success) {
        prisonerData.value = res.data;
    } else {
        toast.add({ severity: 'error', summary: 'Gagal mengambil data tahanan!', detail: res.message, life: 5000 });
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
        name: '',
        facility_uuid: '',
        block: '',
        nik: '',
        pin: '',
        status: ''
    });
};

const handleSubmit = async () => {
    if (!isFormValid.value) {
        toast.add({ severity: 'warn', summary: 'Form Tidak Valid!', detail: 'Mohon lengkapi semua data!', life: 5000 });
        return;
    }

    const actionMap = {
        update: updatePrisoner,
        register: createPrisoner
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

    const res = await deletePrisoner(form.uuid);

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
            loadPrisonerData(newId);
        } else {
            resetForm();
        }
    },
    { immediate: true }
);
watch(
    () => prisonerData.value,
    (newData) => {
        if (newData) {
            console.log('uuid prisoner: ', newData.uuid);
            Object.assign(form, {
                uuid: newData.uuid || '',
                name: newData.name || '',
                facility_uuid: newData.facility_uuid || '',
                block: newData.block || '',
                nik: newData.nik || '',
                pin: newData.pin || '',
                status: newData.status || ''
            });
        }
    },
    { deep: true }
);
</script>

<template>
    <form v-if="props.action === 'register' || props.action === 'update'" @submit.prevent="handleSubmit" class="flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4 max-w-4xl">
            <div class="flex flex-col gap-2">
                <label v-text="'Nama'" />
                <InputText v-model="form.name" placeholder="Masukkan nama tahanan" type="text" />
            </div>
            <div class="flex flex-col gap-2">
                <label v-text="'NIK'" />
                <InputText v-model="form.nik" @input="handleNikInput" :value="nikInput" placeholder="Masukkan NIK tahanan" type="text" />
            </div>
        </div>
        <div class="grid grid-cols-2 gap-4 max-w-4xl">
            <div class="flex flex-col gap-2">
                <label v-text="'Lapas'" />
                <Select v-model="form.facility_uuid" :options="options.facilities" option-label="name" option-value="uuid" placeholder="Pilih lokasi lapas" type="text" />
            </div>
            <div class="flex flex-col gap-2">
                <label v-text="'Blok'" />
                <Select v-model="form.block" :options="options.blocks" placeholder="Pilih blok lapas" type="text" />
            </div>
        </div>
        <div v-show="props.action === 'create'" class="flex flex-col gap-2">
            <label v-text="'Pin Akun'" />
            <InputText v-model="form.pin" placeholder="Masukkan pin untuk tahanan" type="text" />
        </div>
        <div class="flex flex-col gap-2">
            <label v-text="'Status'" />
            <Select v-model="form.status" :options="['active', 'inactive']" placeholder="Pilih status tahanan" type="text" />
        </div>
        <hr />
        <div class="flex gap-2">
            <Button @click="resetPinModal.openModal()" v-if="props.action === 'update'" type="button" icon="pi pi-key" label="Reset Pin" severity="danger" />
            <Button @click="emits('close')" type="button" icon="pi pi-angle-left" label="Batalkan" severity="secondary" outlined class="ml-auto" />
            <Button type="submit" icon="pi pi-save" label="Submit" :disabled="!isFormValid" severity="info" />
        </div>
    </form>
    <div v-if="props.action === 'read'" class="flex flex-col gap-4">
        <div class="overflow-auto h-[600px]">
            <DataTable :value="prisonerData.calls" :lazy="true">
                <Column field="created_at" header="Tanggal">
                    <template #body="{ data }">
                        {{ formatDate(data.created_at) }}
                    </template>
                </Column>
                <Column field="duration" header="Durasi">
                    <template #body="{ data }">
                        <Badge size="xlarge" severity="secondary">
                            {{ calculateDuration(data.start_time, data.end_time) }}
                        </Badge>
                    </template>
                </Column>
                <Column field="call_to" header="Nomor Tujuan" />
                <Column field="call_type" header="Tipe Panggilan">
                    <template #body="{ data }">
                        <Badge size="large" :severity="data.call_type === 'voice' ? 'success' : 'warn'">
                            <p class="uppercase">{{ data.call_type }}</p>
                        </Badge>
                    </template>
                </Column>
            </DataTable>
        </div>
        <div class="flex justify-end gap-2">
            <Button @click="emits('close')" type="button" icon="pi pi-times" iconPos="right" label="Tutup" severity="info" />
        </div>
    </div>
    <div v-if="props.action === 'delete'">
        <p>Apakah Anda yakin ingin menghapus data tahanan <b v-text="form.name" class="text-red-500" />?</p>
        <hr />
        <div class="flex justify-end gap-2">
            <Button @click="emits('close')" type="button" icon="pi pi-angle-left" label="Batalkan" severity="secondary" />
            <Button @click="handleDelete" icon="pi pi-trash" label="Hapus" severity="danger" />
        </div>
    </div>
    <Dialog v-model:visible="resetPinModal.isVisible" header="Reset Pin" :modal="true">
        <reset-pin-form :target-id="form.uuid" :target-name="form.name" @close="resetPinModal.closeModal" />
    </Dialog>
</template>
