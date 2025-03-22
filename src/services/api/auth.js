import axios from '.';

export const login = (payload) => {
    return axios.post('/login', payload);
};

export const logout = () => {
    return axios.post('/logout');
};
