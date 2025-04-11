import axios from './index';

const namespace = 'prisoners';

export const create = (payload) => {
    return axios.post(`/${namespace}`, payload);
};

export const read = (params) => {
    if (typeof params === 'object' || params === undefined) return axios.get(`/${namespace}`, { params });
    else return axios.get(`${namespace}/${params}`);
};

export const update = (payload) => {
    return axios.put(`/${namespace}/${payload.uuid}`, payload);
};

export const del = (id) => {
    return axios.delete(`/${namespace}/${id}`);
};

export const resetPin = (payload) => {
    return axios.post(`/${namespace}/reset-pin`, payload);
};

export const redeem = (payload) => {
    return axios.post('/redeem', payload);
};

export const getBalance = (payload) => {
    return axios.post('/get-balance', payload);
};
