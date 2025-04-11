<script setup>
/** Imports */
import { useModal } from '@/composables/modal';
import { readPurchase } from '@/services/purchaseService';
import { purchaseCols } from '@/utils/columns';
import { generateModalTitle } from '@/utils/formatter';
import { useToast } from 'primevue';
import { onMounted, ref } from 'vue';
import purchaseForm from './partials/form.vue';

const { isVisible, action, targetId, openModal, closeModal } = useModal();
const toast = useToast();

/** Variables */
const pending = ref(false);
const purchaseList = ref([]);
const totalRecords = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

/** Lifecycle Hooks */
onMounted(async () => {
    await loadPurchaseList();
});

/** Functions */
const loadPurchaseList = async () => {
    pending.value = true;
    const res = await readPurchase({ _page: currentPage.value, _limit: pageSize.value, _sort: 'date', _order: 'desc' });
    if (res.success) {
        purchaseList.value = res.data;
        totalRecords.value = res.total;
    } else {
        toast.add({ severity: 'error', summary: 'Gagal mengambil daftar pesanan!', detail: res.message, life: 5000 });
    }
    pending.value = false;
};

const onPageChange = (event) => {
    currentPage.value = event.page + 1;
    pageSize.value = event.rows;
    loadPurchaseList();
};
</script>

<template>
    <div class="card flex">
        <h4 v-text="'Daftar Pesanan'" />
        <Button @click="openModal('create')" icon="pi pi-plus" label="PO Voucher" severity="info" class="ml-auto" />
    </div>
    <div class="card overflow-auto">
        <DataTable :value="purchaseList" :lazy="true" :loading="pending" striped-rows>
            <Column v-for="col in purchaseCols" :key="col.key" :field="col.key" :header="col.label" />
            <Column field="status" header="Status" />
            <Column>
                <template #body="{ data }">
                    <div class="space-x-2 float-right">
                        <Button @click="openModal('update', data.uuid)" icon="pi pi-pencil" severity="info" class="aspect-square" />
                        <!-- <Button @click="openModal('delete', data.uuid)" icon="pi pi-trash" severity="danger" class="aspect-square" /> -->
                    </div>
                </template>
            </Column>
        </DataTable>
        <Paginator :rows="pageSize" :totalRecords="totalRecords" @page="onPageChange" class="mt-4" />
    </div>
    <Dialog v-model:visible="isVisible" :header="generateModalTitle(action, 'Pesanan')" :modal="true">
        <purchaseForm :target-id="targetId" :action="action" @close="closeModal" @refresh="loadPurchaseList" />
    </Dialog>
</template>
