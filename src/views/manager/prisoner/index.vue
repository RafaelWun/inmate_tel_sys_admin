<script setup>
/** Imports */
import { useModal } from '@/composables/modal.js';
import { readPrisoner } from '@/services/prisonerService';
import { prisonerCols } from '@/utils/columns';
import { generateModalTitle } from '@/utils/formatter.js';
import { useToast } from 'primevue';
import { onMounted, ref } from 'vue';
import prisonerForm from './partials/form.vue';

const { isVisible, action, targetId, openModal, closeModal } = useModal();
const toast = useToast();

/** Variables */
const pending = ref(false);
const prisonerList = ref([]);
const totalRecords = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const searchQuery = ref('');

/** Lifecycle Hooks */
onMounted(async () => {
    await loadPrisonerList();
});

/** Functions */
const loadPrisonerList = async () => {
    pending.value = true;
    const params = { _page: currentPage.value, _limit: pageSize.value };

    if (searchQuery.value.trim()) {
        // params['_sort'] = 'NIK';
        params['_search'] = searchQuery.value.trim();
    }

    const res = await readPrisoner(params);
    if (res.success) {
        prisonerList.value = res.data;
        totalRecords.value = res.total;
    } else {
        toast.add({ severity: 'error', summary: 'Gagal mengambil daftar tahanan!', detail: res.message, life: 5000 });
    }
    pending.value = false;
};

const onPageChange = (event) => {
    currentPage.value = event.page + 1;
    pageSize.value = event.rows;
    loadPrisonerList();
};

const onSearch = () => {
    currentPage.value = 1;
    loadPrisonerList();
};
</script>

<template>
    <div class="card flex gap-4">
        <h4 v-text="'Daftar Tahanan'" />
        <InputText v-model="searchQuery" placeholder="Cari tahanan dengan NIK" />
        <Button @click="onSearch" icon="pi pi-search" label="Cari" severity="primary" />
        <Button @click="openModal('register')" icon="pi pi-plus" label="Registrasi Tahanan" severity="info" class="ml-auto" />
    </div>
    <div class="card overflow-auto">
        <DataTable :value="prisonerList" :lazy="true" :loading="pending" striped-rows>
            <Column v-for="col in prisonerCols" :key="col.key" :field="col.key" :header="col.label" />
            <Column field="status" header="Status">
                <template #body="{ data }">
                    <Tag :severity="data.status === 'active' ? 'success' : 'secondary'"><p v-text="data.status" class="uppercase" /></Tag>
                </template>
            </Column>
            <Column>
                <template #body="{ data }">
                    <div class="space-x-2 float-right">
                        <Button @click="openModal('balance', data.uuid)" icon="pi pi-dollar" severity="help" class="aspect-square" />
                        <Button @click="openModal('redeem', data.uuid)" icon="pi pi-cart-plus" severity="warn" class="aspect-square" />
                        <Button @click="openModal('read', data.uuid)" icon="pi pi-eye" severity="secondary" class="aspect-square" />
                        <Button @click="openModal('update', data.uuid)" icon="pi pi-pencil" severity="info" class="aspect-square" />
                        <!-- <Button @click="openModal('delete', data.uuid)" icon="pi pi-trash" severity="danger" class="aspect-square" /> -->
                    </div>
                </template>
            </Column>
        </DataTable>
        <Paginator :rows="pageSize" :totalRecords="totalRecords" @page="onPageChange" class="mt-4" />
    </div>
    <Dialog v-model:visible="isVisible" :header="generateModalTitle(action, 'Tahanan')" :modal="true" :pt="{ root: '' }">
        <prisoner-form :target-id="targetId" :action="action" @close="closeModal" @refresh="loadPrisonerList" />
    </Dialog>
</template>
