import AppLayout from '@/layout/AppLayout.vue';

const routes = [
    {
        path: '/',
        component: AppLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: '/',
                name: 'dashboard',
                component: () => import('@/views/dashboard.vue')
            },
            {
                path: '/device-list',
                name: 'devices',
                component: () => import('@/views/manager/device/index.vue')
            },
            {
                path: '/facility-list',
                name: 'facilities',
                component: () => import('@/views/manager/facility/index.vue')
            },
            {
                path: '/prisoner-list',
                name: 'prisoners',
                component: () => import('@/views/manager/prisoner/index.vue')
            },
            {
                path: '/voucher-purchase',
                name: 'buyVoucher',
                component: () => import('@/views/manager/purchase/index.vue')
            },
            {
                path: '/voucher-type-list',
                name: 'voucherTypes',
                component: () => import('@/views/manager/voucher-types/index.vue')
            },
            {
                path: '/user-list',
                name: 'users',
                component: () => import('@/views/access-control/user/index.vue')
            },
            {
                path: '/role-list',
                name: 'roles',
                component: () => import('@/views/access-control/role/index.vue')
            }
        ]
    },
    {
        path: '/auth',
        component: () => import('@/views/auth/index.vue'),
        meta: { guestOnly: true }
    }
];

export default routes;
