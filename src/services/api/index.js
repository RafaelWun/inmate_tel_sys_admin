import { useAuth } from '@/stores/authStore';
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://apisec.inmatecomms.com/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        const authStore = useAuth();
        if (authStore.token) {
            config.headers.Authorization = `Bearer ${authStore.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
