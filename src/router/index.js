import { useAuth } from '@/stores/authStore';
import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';

const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

router.beforeEach((to, from, next) => {
    const userRoles = useAuth().user?.roles.map((r) => r.name) || [];

    if (to.meta.requiresAuth && !useAuth().token) next('/auth');
    if (to.meta.guestOnly && useAuth().token) next('/');

    if (to.meta.roles) {
        const hasAccess = userRoles.some((role) => to.meta.roles.includes(role));
        if (!hasAccess) {
            return next('/unauthorized');
        }
    }

    next();
});

export default router;
