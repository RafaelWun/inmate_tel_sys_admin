import * as prisoner from './api/prisoner';

export const createPrisoner = async (payload) => {
    try {
        await prisoner.create(payload);
        return { success: true, message: 'Data tahanan berhasil didaftarkan.' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const readPrisoner = async (params) => {
    try {
        const res = await prisoner.read(params);
        const rawData = res.data.data;
        let prisonerList;

        if (typeof params === 'object' || params === undefined) {
            prisonerList = rawData.data;
        } else {
            prisonerList = rawData;
        }

        return {
            success: true,
            message: 'Data tahanan berhasil diproses.',
            data: prisonerList,
            total: res.data.data.total
        };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const updatePrisoner = async (payload) => {
    try {
        await prisoner.update(payload);
        return { success: true, message: 'Data tahanan berhasil diperbarui.' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const deletePrisoner = async (id) => {
    try {
        await prisoner.del(id);
        return { success: true, message: 'Data tahanan berhasil dihapus.' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};
