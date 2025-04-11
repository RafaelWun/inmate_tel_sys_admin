import * as facility from './api/facility';
import * as purchase from './api/purchase';

export const createPurchase = async (payload) => {
    try {
        await purchase.create(payload);
        return { success: true, message: 'Data pesanan berhasil ditambahkan.' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const readPurchase = async (params) => {
    try {
        const res = await purchase.read(params);
        const rawData = res.data.data;
        let purchaseList;

        if (typeof params === 'object' || params === undefined) {
            purchaseList = await Promise.all(
                rawData.data.map(async (purchase) => {
                    try {
                        if (!purchase.facility_uuid) {
                            return { ...purchase, facility_name: 'Lapas tidak ditemukan' };
                        }

                        const facilityRes = await facility.read(purchase.facility_uuid);

                        if (!facilityRes.data || !facilityRes.data.data) {
                            return { ...purchase, facility_name: 'Data lapas tidak tersedia' };
                        }
                        if (!facilityRes.data.data.name) {
                            return { ...purchase, facility_name: 'Nama lapas tidak tersedia' };
                        }

                        return {
                            ...purchase,
                            facility_name: facilityRes.data.data.name
                        };
                    } catch (error) {
                        return { ...purchase, facility_name: 'Lapas tidak ditemukan' };
                    }
                })
            );
        } else {
            purchaseList = rawData;
        }

        return {
            success: true,
            message: 'Data pemesanan berhasil diproses.',
            data: purchaseList,
            total: res.data.data.total
        };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const updatePurchase = async (payload) => {
    try {
        await purchase.update(payload);
        return { success: true, message: 'Data pemesanan berhasil diperbarui.' };
    } catch (error) {
        return { success: false, message: `[services] ${error.message}` };
    }
};

export const deletePurchase = async (id) => {
    try {
        await purchase.del(id);
        return { success: true, message: 'Data pemesanan berhasil dihapus.' };
    } catch (error) {
        console.error('deletePurchase error: ', error);
        return { success: false, message: error.message };
    }
};
