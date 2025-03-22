<script setup>
import { readFacility } from '@/services/facilityService';
import { createUser, deleteUser, readUser, updateUser } from '@/services/userService';
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
const userData = ref({});

const form = reactive({
    uuid: '',
    name: '',
    email: '',
    password: '',
    roles: [],
    facility_uuid: ''
});

const options = reactive({
    roles: [],
    facilities: []
});

/** Computed Properties */
const isFormValid = computed(() => {
    return form.name.trim() !== '' && form.email.trim() !== '' && form.password.trim() !== '' && form.facility_uuid.trim() !== '';
});

/** Lifecycle Hooks */
onMounted(async () => {
    await loadOptions();
});

const loadUserData = async (uuid) => {
    const res = await readUser(uuid);
    if (res.success) {
        userData.value = res.data;
    } else {
        toast.add({ severity: 'error', summary: 'Gagal mengambil data user!', detail: res.message, life: 5000 });
    }
};

/** Functions */
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
        email: '',
        password: '',
        roles: [],
        facility_uuid: ''
    });
};

const handleSubmit = async () => {
    if (!isFormValid.value) {
        toast.add({ severity: 'warn', summary: 'Form Tidak Valid!', detail: 'Mohon lengkapi semua data!', life: 5000 });
        return;
    }

    const actionMap = {
        update: updateUser,
        register: createUser
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

    const res = await deleteUser(form.uuid);

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
            loadUserData(newId);
        } else {
            resetForm();
        }
    },
    { immediate: true }
);
watch(
    () => userData.value,
    (newData) => {
        if (newData) {
            Object.assign(form, {
                uuid: newData.uuid || '',
                name: newData.name || '',
                email: newData.email || '',
                password: newData.password || '',
                roles: newData.roles || [],
                facility_uuid: newData.facility_uuid || ''
            });
        }
    },
    { deep: true }
);
</script>

<template>
    <form v-if="props.action === 'register' || props.action === 'update'" @submit.prevent="handleSubmit" class="flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
                <label v-text="'Nama'" />
                <InputText v-model="form.name" placeholder="Masukkan nama user" type="text" class="min-w-80" />
            </div>
            <div class="flex flex-col gap-2">
                <label v-text="'Role'" />
                <Select v-model="form.roles" placeholder="Pilih role user" type="text" />
            </div>
        </div>
        <div class="flex flex-col gap-2">
            <label v-text="'Email'" />
            <InputText v-model="form.email" placeholder="Masukkan email user" type="email" class="min-w-80" />
        </div>
        <div v-if="action === 'register'" class="flex flex-col gap-2">
            <label v-text="'Password'" />
            <InputText v-model="form.password" placeholder="Masukkan password untuk user" type="password" class="min-w-80" />
        </div>
        <div class="flex flex-col gap-2">
            <label v-text="'Lokasi Lapas'" />
            <Select v-model="form.facility_uuid" placeholder="Pilih lokasi lapas" type="text" />
        </div>
        <hr />
        <div class="flex justify-end gap-2">
            <Button @click="$emit('close')" icon="pi pi-angle-left" label="Batalkan" severity="secondary" />
            <Button @click="$emit('close')" icon="pi pi-save" :label="isUpdate ? 'Simpan Perubahan' : 'Registrasi'" severity="info" />
        </div>
    </form>
    <div v-if="props.action === 'delete'">
        <p>Apakah Anda yakin ingin menghapus data user <b v-text="form.name" class="text-red-500" />?</p>
        <hr />
        <div class="flex justify-end gap-2">
            <Button @click="emits('close')" type="button" icon="pi pi-angle-left" label="Batalkan" severity="secondary" />
            <Button @click="handleDelete" icon="pi pi-trash" label="Hapus" severity="danger" />
        </div>
    </div>
</template>
