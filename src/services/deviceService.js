import * as device from './api/device';
import * as facility from './api/facility';

export const createDevice = async (payload) => {
    try {
        await device.create(payload);
        return { success: true, message: 'Data perangkat berhasil didaftarkan.' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const readDevice = async (params) => {
    try {
        const res = await device.read(params);
        const rawData = res.data.data;
        let deviceList;

        if (typeof params === 'object' || params === undefined) {
            deviceList = await Promise.all(
                rawData.data.map(async (device) => {
                    try {
                        if (!device.facility_uuid) {
                            return { ...device, facility_name: 'Lapas tidak ditemukan' };
                        }

                        const facilityRes = await facility.read(device.facility_uuid);

                        if (!facilityRes.data || !facilityRes.data.data) {
                            return { ...device, facility_name: 'Data lapas tidak tersedia' };
                        }
                        if (!facilityRes.data.data.name) {
                            return { ...device, facility_name: 'Nama lapas tidak tersedia' };
                        }

                        return {
                            ...device,
                            facility_name: facilityRes.data.data.name
                        };
                    } catch (error) {
                        return { ...device, facility_name: 'Lapas tidak ditemukan' };
                    }
                })
            );
        } else {
            deviceList = rawData;
        }

        return {
            success: true,
            message: 'Data perangkat berhasil diproses.',
            data: deviceList,
            total: res.data.data.total
        };
    } catch (error) {
        console.error('Error mengambil data: ', error.message);
        return { success: false, message: error.message };
    }
};

export const updateDevice = async (payload) => {
    try {
        await device.update(payload);
        return { success: true, message: 'Data perangkat berhasil diperbarui.' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const deleteDevice = async (id) => {
    try {
        await device.del(id);
        return { success: true, message: 'Data perangkat berhasil dihapus.' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};
