<script setup>
/** Imports */
import { useModal } from '@/composables/modal.js';
import { readRole } from '@/services/roleService';
import { roleCols } from '@/utils/columns';
import { generateModalTitle } from '@/utils/formatter.js';
import { useToast } from 'primevue';
import { onMounted, ref } from 'vue';
import cudForm from './partials/form.vue';

const { isVisible, action, targetId, openModal, closeModal } = useModal();
const toast = useToast();

/** Variables */
const roleList = ref([]);
const totalRecords = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

/** Lifecycle Hooks */
onMounted(async () => {
    await loadRoleList();
});

const loadRoleList = async () => {
    const res = await readRole();
    if (res.success) {
        roleList.value = res.data;
        totalRecords.value = res.total;
    } else {
        toast.add({ severity: 'error', summary: 'Gagal mengambil daftar role!', detail: res.message, life: 5000 });
    }
};

const onPageChange = (event) => {
    currentPage.value = event.page + 1;
    pageSize.value = event.rows;
    loadRoleList();
};
</script>

<template>
    <div class="card flex">
        <h4 v-text="'Daftar Role'" />
        <Button @click="openModal('register')" label="Registrasi Role Baru" severity="info" class="ml-auto" />
    </div>
    <div class="card overflow-auto">
        <data-table :value="roleList">
            <Column v-for="col in roleCols" :key="col.key" :field="col.key" :header="col.label" />
            <Column>
                <template #body="{ data }">
                    <div class="space-x-2 float-right">
                        <Button @click="openModal('update', data.uuid)" icon="pi pi-pencil" severity="info" class="aspect-square" />
                        <Button @click="openModal('delete', data.uuid)" icon="pi pi-trash" severity="danger" class="aspect-square" />
                    </div>
                </template>
            </Column>
        </data-table>
        <Paginator :rows="pageSize" :totalRecords="totalRecords" @page="onPageChange" class="mt-4" />
    </div>
    <Dialog v-model:visible="isVisible" :header="generateModalTitle(action, 'Tahanan')" :modal="true">
        <cud-form :targetId="targetId" :action="action" @close="closeModal" @refresh="loadRoleList" />
    </Dialog>
</template>
