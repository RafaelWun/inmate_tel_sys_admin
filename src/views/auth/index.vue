<script setup>
/** Imports */
import { useAuth } from '@/stores/authStore';
import { useToast } from 'primevue';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthLayout from './partials/layout.vue';

const authStore = useAuth();
const toast = useToast();
const router = useRouter();

/** Variables */
const form = reactive({
    email: '',
    password: ''
});
const sysMsg = ref('');

/** Functions */
const handleLogin = async () => {
    try {
        await authStore.login(form);
        sysMsg.value = 'Selamat datang kembali! Selamat beraktivitas.';
        toast.add({ severity: 'success', summary: 'Login Berhasil!', detail: sysMsg.value, life: 5000 });
        router.replace('/');
    } catch (error) {
        sysMsg.value = 'Something went wrong';
        toast.add({ severity: 'error', summary: 'Login Gagal!', detail: sysMsg.value, life: 5000 });
    }
};
</script>

<template>
    <auth-layout>
        <div class="flex flex-1 items-center justify-center">
            <form @submit.prevent="handleLogin" class="card flex flex-col gap-4 h-fit border border-gray-200">
                <div class="space-y-2 mb-12">
                    <h2 v-text="'ADMIN LOGIN'" />
                </div>
                <div class="grid gap-2">
                    <label v-text="'Email'" />
                    <input-text v-model="form.email" type="email" placeholder="Masukkan email Anda" class="w-96" />
                </div>
                <div class="grid gap-2">
                    <label v-text="'Password'" />
                    <input-text v-model="form.password" type="password" placeholder="Masukkan password Anda" class="w-96" />
                </div>
                <div class="ml-auto text-blue-500 hover:underline">Lupa Password?</div>
                <hr />
                <Button type="submit" icon="pi pi-sign-in" label="Verifikasi" severity="info" />
            </form>
        </div>
    </auth-layout>
</template>
