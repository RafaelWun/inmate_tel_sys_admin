import { useAuth } from '@/stores/authStore';
import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';

const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

router.beforeEach((to, from, next) => {
    const authStore = useAuth();
    if (to.meta.requiresAuth && !authStore.token) next('/auth');
    else if (to.meta.guestOnly && authStore.token) next('/');
    else next();
});

export default router;
