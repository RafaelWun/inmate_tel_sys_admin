export function generateModalTitle(action, namespace) {
    const actionMap = {
        register: 'Registrasi',
        create: 'Tambah',
        read: 'Detail',
        update: 'Perbarui',
        delete: 'Hapus'
    };
    const actionText = actionMap[action] || '"Aksi"';
    return `${actionText} ${namespace}`;
}
