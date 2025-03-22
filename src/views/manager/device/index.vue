<script setup>
/** Imports */
import { useModal } from '@/composables/modal.js';
import { readDevice } from '@/services/deviceService';
import { deviceCols } from '@/utils/columns';
import { generateModalTitle } from '@/utils/formatter.js';
import { useToast } from 'primevue';
import { onMounted, ref } from 'vue';
import deviceForm from './partials/form.vue';

const { isVisible, action, targetId, openModal, closeModal } = useModal();
const toast = useToast();

/** Variables */
const deviceList = ref([]);
const totalRecords = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

/** Lifecycle Hooks */
onMounted(async () => {
    await loadDeviceList();
});

/** Functions */
const loadDeviceList = async () => {
    const res = await readDevice({ _page: currentPage.value, _limit: pageSize.value });
    if (res.success) {
        deviceList.value = res.data;
        totalRecords.value = res.total;
    } else {
        toast.add({ severity: 'error', summary: 'Gagal mengambil daftar perangkat!', detail: res.message, life: 5000 });
    }
};

const onPageChange = (event) => {
    currentPage.value = event.page + 1;
    pageSize.value = event.rows;
    loadDeviceList();
};
</script>

<template>
    <div class="card flex items-center">
        <h4 v-text="'Daftar Perangkat'" />
        <Button @click="openModal('register')" icon="pi pi-plus" label="Registrasi Perangkat" icon-pos="right" severity="info" class="ml-auto" />
    </div>
    <div class="card overflow-auto">
        <DataTable :value="deviceList" :lazy="true" striped-rows>
            <Column v-for="col in deviceCols" :key="col.key" :field="col.key" :header="col.label" />
            <Column>
                <template #body="{ data }">
                    <div class="space-x-2 float-right">
                        <Button @click="openModal('update', data.uuid)" icon="pi pi-pencil" severity="info" raised class="aspect-square" />
                        <Button @click="openModal('delete', data.uuid)" icon="pi pi-trash" severity="danger" raised class="aspect-square" />
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
