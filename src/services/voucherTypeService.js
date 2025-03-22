import * as voucherType from './api/voucherType';

export const createVoucherType = async (payload) => {
    try {
        await voucherType.create(payload);
        return { success: true, message: 'Tipe voucher berhasil ditambahkan.' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const readVoucherType = async (params) => {
    try {
        const res = await voucherType.read(params);
        const rawData = res.data.data;
        let voucherTypeList;

        if (typeof params === 'object' || params === undefined) {
            voucherTypeList = rawData.data;
        } else {
            voucherTypeList = rawData;
        }

        return {
            success: true,
            message: 'Tipe voucher berhasil diproses.',
            data: voucherTypeList,
            total: res.data.data.total
        };
    } catch (error) {
        console.error('error: ', error.message);
        return { success: false, message: error.message };
    }
};

export const updateVoucherType = async (payload) => {
    try {
        await voucherType.update(payload);
        return { success: true, message: 'Tipe voucher berhasil diperbarui.' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const deleteVoucherType = async (id) => {
    try {
        await voucherType.del(id);
        return { success: true, message: 'Tipe voucher berhasil dihapus.' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};
