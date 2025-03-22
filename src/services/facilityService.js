import * as facility from './api/facility';

export const createFacility = async (payload) => {
    try {
        await facility.create(payload);
        return { success: true, message: 'Data lapas berhasil diproses.' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const readFacility = async (params) => {
    try {
        const res = await facility.read(params);
        const rawData = res.data.data;
        let facilityList;

        if (typeof params === 'object' || params === undefined) {
            facilityList = rawData.data;
        } else {
            facilityList = rawData;
        }

        return {
            success: true,
            message: 'Data lapas berhasil diproses.',
            data: facilityList,
            total: res.data.data.total
        };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const updateFacility = async (payload) => {
    try {
        await facility.update(payload);
        return { success: true, message: 'Data lapas berhasil diproses.' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const deleteFacility = async (id) => {
    try {
        await facility.del(id);
        return { success: true, message: 'Data lapas berhasil diproses.' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};
