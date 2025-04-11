import AppLayout from '@/layout/AppLayout.vue';

const routes = [
    {
        path: '/',
        component: AppLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: '/',
                name: 'home',
                component: () => import('@/views/index.vue'),
                meta: { roles: ['Administrator'] }
            },
            {
                path: '/device-list',
                name: 'devices',
                component: () => import('@/views/manager/device/index.vue'),
                meta: { roles: ['Administrator', 'Operator'] }
            },
            {
                path: '/facility-list',
                name: 'facilities',
                component: () => import('@/views/manager/facility/index.vue'),
                meta: { roles: ['Administrator'] }
            },
            {
                path: '/prisoner-list',
                name: 'prisoners',
                component: () => import('@/views/manager/prisoner/index.vue'),
                meta: { roles: ['Administrator', 'Operator'] }
            },
            {
                path: '/voucher-purchase',
                name: 'buyVoucher',
                component: () => import('@/views/manager/purchase/index.vue'),
                meta: { roles: ['Administrator'] }
            },
            {
                path: '/voucher-type-list',
                name: 'voucherTypes',
                component: () => import('@/views/manager/voucher-types/index.vue'),
                meta: { roles: ['Administrator'] }
            },
            {
                path: '/user-list',
                name: 'users',
                component: () => import('@/views/access-control/user/index.vue'),
                meta: { roles: ['Administrator'] }
            },
            {
                path: '/role-list',
                name: 'roles',
                component: () => import('@/views/access-control/role/index.vue'),
                meta: { roles: ['Administrator'] }
            },
            {
                path: '/unauthorized',
                component: () => import('@/views/misc/401.vue')
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
