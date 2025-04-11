import * as voucherType from './api/voucherType';

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};

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
            voucherTypeList = rawData.data.map((item) => ({
                ...item,
                price: formatRupiah(item.price) // Format harga ke Rupiah
            }));
        } else {
            voucherTypeList = {
                ...rawData,
                price: formatRupiah(rawData.price) // Format harga jika hanya satu item
            };
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
