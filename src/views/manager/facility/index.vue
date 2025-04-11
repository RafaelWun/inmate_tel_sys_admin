<script setup>
/** Imports */
import { useModal } from '@/composables/modal.js';
import { readFacility } from '@/services/facilityService';
import { facilityCols } from '@/utils/columns';
import { generateModalTitle } from '@/utils/formatter';
import { useToast } from 'primevue';
import { onMounted, ref } from 'vue';
import facilityForm from './partials/form.vue';

const { isVisible, action, targetId, openModal, closeModal } = useModal();
const toast = useToast();

/** Variables */
const pending = ref(false);
const facilityList = ref([]);
const totalRecords = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

/** Lifecycle Hooks */
onMounted(async () => {
    await loadFacilityList();
});

/** Functions */
const loadFacilityList = async () => {
    pending.value = true;
    const res = await readFacility({ _page: currentPage.value, _limit: pageSize.value });
    if (res.success) {
        facilityList.value = res.data;
        totalRecords.value = res.total;
    } else {
        toast.add({ severity: 'error', summary: 'Gagal mengambil daftar lapas!', detail: res.message, life: 5000 });
    }
    pending.value = false;
};

const onPageChange = (event) => {
    currentPage.value = event.page + 1;
    pageSize.value = event.rows;
    loadFacilityList();
};
</script>

<template>
    <div class="card flex">
        <h4 v-text="'Daftar Lapas'" />
        <!-- <Button @click="openModal('register')" icon="pi pi-plus" label="Registrasi Lapas" severity="info" class="ml-auto" /> -->
    </div>
    <div class="card overflow-auto">
        <DataTable :value="facilityList" :lazy="true" :loading="pending" striped-rows>
            <Column v-for="col in facilityCols" :key="col.key" :field="col.key" :header="col.label" />
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
    <Dialog v-model:visible="isVisible" :header="generateModalTitle(action, 'Lapas')" :modal="true">
        <facilityForm :target-id="targetId" :action="action" @close="closeModal" @refresh="loadFacilityList" />
    </Dialog>
</template>
