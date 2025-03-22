<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Menu Utama',
        items: [
            {
                label: 'Perangkat',
                icon: 'pi pi-fw pi-tablet',
                to: '/device-list'
            },
            {
                label: 'Lapas',
                icon: 'pi pi-fw pi-warehouse',
                to: '/facility-list'
            },
            {
                label: 'Data Napi',
                icon: 'pi pi-fw pi-users',
                to: '/prisoner-list'
            },
            {
                label: 'PO Voucher',
                icon: 'pi pi-fw pi-cart-plus',
                to: '/voucher-purchase'
            },
            {
                label: 'Jenis Voucher',
                icon: 'pi pi-fw pi-ticket',
                to: '/voucher-type-list'
            }
        ]
    }
    // {
    //     label: 'Kontrol Akses',
    //     items: [
    //         {
    //             label: 'Users',
    //             icon: 'pi pi-fw pi-user',
    //             to: '/user-list'
    //         },
    //         {
    //             label: 'Roles',
    //             icon: 'pi pi-fw pi-id-card',
    //             to: '/role-list'
    //         }
    //     ]
    // }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
