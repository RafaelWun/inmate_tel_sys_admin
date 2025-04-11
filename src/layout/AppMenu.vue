<script setup>
import { computed, ref } from 'vue';

import { useAuth } from '@/stores/authStore';
import AppMenuItem from './AppMenuItem.vue';

const userRoles = useAuth().user?.roles.map((r) => r.name) || [];

const model = ref([
    {
        label: 'Menu Utama',
        items: [
            {
                label: 'Perangkat',
                icon: 'pi pi-fw pi-tablet',
                to: '/device-list',
                roles: ['Administrator', 'Operator']
            },
            {
                label: 'Lapas',
                icon: 'pi pi-fw pi-warehouse',
                to: '/facility-list',
                roles: ['Administrator']
            },
            {
                label: 'Data Napi',
                icon: 'pi pi-fw pi-users',
                to: '/prisoner-list',
                roles: ['Administrator', 'Operator']
            },
            {
                label: 'PO Voucher',
                icon: 'pi pi-fw pi-cart-plus',
                to: '/voucher-purchase',
                roles: ['Administrator']
            },
            {
                label: 'Jenis Voucher',
                icon: 'pi pi-fw pi-ticket',
                to: '/voucher-type-list',
                roles: ['Administrator']
            }
        ]
    }
    // {
    //     label: 'Kontrol Akses',
    //     items: [
    //         {
    //             label: 'Users',
    //             icon: 'pi pi-fw pi-user',
    //             to: '/user-list',
    //             roles: ['Administrator']
    //         },
    //         {
    //             label: 'Roles',
    //             icon: 'pi pi-fw pi-id-card',
    //             to: '/role-list',
    //             roles: ['Administrator']
    //         }
    //     ]
    // }
]);

// Computed property untuk filter menu berdasarkan roles
const filteredMenu = computed(() => {
    return model.value
        .map((menu) => {
            return {
                ...menu,
                items: menu.items.filter((item) => item.roles.some((role) => userRoles.includes(role)))
            };
        })
        .filter((menu) => menu.items.length > 0);
});
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in filteredMenu" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
