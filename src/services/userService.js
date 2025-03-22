import * as user from './api/user';

export const createUser = async (payload) => {
    try {
        await user.create(payload);
        return { success: true, message: 'Data user berhasil didaftarkan.' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const readUser = async (params) => {
    try {
        const res = await user.read(params);
        const rawData = res.data.data;
        let userList;

        if (typeof params === 'object' || params === undefined) {
            userList = rawData.data;
        } else {
            userList = rawData;
        }

        console.log('response read user: ', res);
        return {
            success: true,
            message: 'Data user berhasil diproses.',
            data: userList,
            total: rawData.total
        };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const updateUser = async (payload) => {
    try {
        await user.update(payload);
        return { success: true, message: 'Data user berhasil diperbarui.' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const deleteUser = async (id) => {
    try {
        await user.del(id);
        return { success: true, message: 'Data user berhasil dihapus.' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};
