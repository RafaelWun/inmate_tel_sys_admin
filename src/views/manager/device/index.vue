<script setup>
/** Imports */
import { useModal } from '@/composables/modal.js';
import { readDevice } from '@/services/deviceService';
import { useAuth } from '@/stores/authStore';
import { deviceCols } from '@/utils/columns';
import { generateModalTitle } from '@/utils/formatter.js';
import { useToast } from 'primevue';
import { onMounted, ref } from 'vue';
import deviceForm from './partials/form.vue';

const { isVisible, action, targetId, openModal, closeModal } = useModal();
const toast = useToast();
const userRoles = useAuth().user?.roles.map((r) => r.name) || [];

/** Variables */
const pending = ref(false);
const deviceList = ref([]);
const totalRecords = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const searchQuery = ref('');

/** Lifecycle Hooks */
onMounted(async () => {
    await loadDeviceList();
});

/** Functions */
const loadDeviceList = async () => {
    pending.value = true;
    const params = { _page: currentPage.value, _limit: pageSize.value };

    if (searchQuery.value.trim()) {
        params._search = searchQuery.value.trim();
    }

    const res = await readDevice(params);
    if (res.success) {
        deviceList.value = res.data;
        totalRecords.value = res.total;
    } else {
        toast.add({ severity: 'error', summary: 'Gagal mengambil daftar perangkat!', detail: res.message, life: 5000 });
    }
    pending.value = false;
};

const onPageChange = (event) => {
    currentPage.value = event.page + 1;
    pageSize.value = event.rows;
    loadDeviceList();
};

const onSearch = () => {
    currentPage.value = 1;
    loadDeviceList();
};
</script>

<template>
    <div class="card flex items-center gap-4">
        <h4 v-text="'Daftar Perangkat'" />
        <InputText v-model="searchQuery" placeholder="Cari perangkat..." />
        <Button @click="onSearch" icon="pi pi-search" label="Cari" />
        <!-- <Button @click="openModal('register')" icon="pi pi-plus" label="Registrasi Perangkat" icon-pos="right" severity="info" class="ml-auto" /> -->
    </div>
    <div class="card overflow-auto">
        <DataTable :value="deviceList" :lazy="true" :loading="pending" striped-rows>
            <Column v-for="col in deviceCols" :key="col.key" :field="col.key" :header="col.label" />
            <Column>
                <template #body="{ data }">
                    <div class="space-x-2 float-right">
                        <Button @click="openModal('reset', data.uuid)" icon="pi pi-refresh" label="Reset" severity="warn" raised />
                        <Button @click="openModal('read', data.uuid)" icon="pi pi-eye" severity="secondary" raised class="aspect-square" />
                        <Button v-if="userRoles.includes('Administrator')" @click="openModal('update', data.uuid)" icon="pi pi-pencil" severity="info" raised class="aspect-square" />
                        <!-- <Button @click="openModal('delete', data.uuid)" icon="pi pi-trash" severity="danger" raised class="aspect-square" /> -->
                    </div>
                </template>
            </Column>
        </DataTable>
        <Paginator :rows="pageSize" :totalRecords="totalRecords" @page="onPageChange" class="mt-4" />
    </div>
    <Dialog v-model:visible="isVisible" :header="generateModalTitle(action, 'Perangkat')" :modal="true">
        <deviceForm :target-id="targetId" :action="action" @close="closeModal" @refresh="loadDeviceList" />
    </Dialog>
</template>
