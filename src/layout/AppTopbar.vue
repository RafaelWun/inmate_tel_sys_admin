<script setup>
/** Imports */
// Libraries
import { useToast } from 'primevue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// Composables
import { useLayout } from '@/layout/composables/layout';
// Stores
import { useAuth } from '@/stores/authStore';

/** Dependencies */
const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();
const toast = useToast();
const router = useRouter();
const authStore = useAuth();

/** State Management */
// Data State
const sysMsg = ref('');

/** Functions */
// Logout
const handleLogout = async () => {
    try {
        await authStore.logout();
        toast.add({ severity: 'success', summary: 'Logout Berhasil!', detail: 'Anda berhasil keluar, sampai jumpa', life: 5000 });
        router.replace('/auth');
    } catch (error) {
        sysMsg.value = 'Something went wrong';
        toast.add({ severity: 'error', summary: 'Login Gagal!', detail: sysMsg.value, life: 5000 });
    }
};
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button>
            <span class="layout-topbar-logo">INMATECOMMS</span>
        </div>
        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
            </div>
            <button
                class="layout-topbar-menu-button layout-topbar-action"
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
            >
                <i class="pi pi-ellipsis-v"></i>
            </button>
            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <Button @click="handleLogout" icon="pi pi-sign-out" label="Logout" severity="danger" />
                </div>
            </div>
        </div>
    </div>
</template>
