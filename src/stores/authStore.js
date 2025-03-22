import { login } from '@/services/api/auth';
import { defineStore } from 'pinia';

const STORAGE_KEY = 'auth_user';
const TOKEN_KEY = 'auth_token';
const EXPIRATION_KEY = 'auth_expiration';
const EXPIRATION_TIME = 30000;

export const useAuth = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem(STORAGE_KEY)) || null,
        token: localStorage.getItem(TOKEN_KEY) || null
    }),
    actions: {
        async login(payload) {
            const res = await login(payload);
            if (res && res.data) {
                this.user = res.data.user;
                this.token = res.data.token;
                const expiration = new Date().getTime() + EXPIRATION_TIME;

                localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data.user));
                localStorage.setItem(TOKEN_KEY, res.data.token);
                localStorage.setItem(EXPIRATION_KEY, expiration.toString());
            }
            return res;
        },
        async logout() {
            this.clearSession();
        },
        checkExpiration() {
            const expiration = parseInt(localStorage.getItem(EXPIRATION_KEY), 10);
            const now = new Date().getTime();

            if (expiration && now > expiration) {
                this.clearSession();
            }
        },
        clearSession() {
            this.user = null;
            this.token = null;
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(EXPIRATION_KEY);
        }
    }
});
