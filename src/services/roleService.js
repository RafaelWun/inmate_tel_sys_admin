import * as role from './api/role';

export const createRole = async (payload) => {
    try {
        await role.create(payload);
        return { success: true, message: 'Data role berhasil didaftarkan.' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const readRole = async (params) => {
    try {
        const res = await role.read(params);
        const rawData = res.data.data;
        let roleList;

        if (typeof params === 'object' || params === undefined) {
            roleList = rawData.data;
        } else {
            roleList = rawData;
        }

        console.log('response read role: ', res);
        return {
            success: true,
            message: 'Data role berhasil diproses.',
            data: roleList,
            total: rawData.total
        };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const updateRole = async (payload) => {
    try {
        await role.update(payload);
        return { success: true, message: 'Data role berhasil diperbarui.' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const deleteRole = async (id) => {
    try {
        await role.del(id);
        return { success: true, message: 'Data role berhasil dihapus.' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};
