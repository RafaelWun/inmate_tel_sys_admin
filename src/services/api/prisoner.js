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
