export function generateModalTitle(action, namespace) {
    const actionMap = {
        register: 'Registrasi',
        create: 'Tambah',
        read: 'Detail',
        update: 'Perbarui',
        delete: 'Hapus',
        reset: 'Reset'
    };
    const actionText = actionMap[action] || '"Aksi"';
    if (action === 'reset') {
        return `${actionText} Layar`;
    } else if (action === 'redeem') {
        return 'Isi Saldo';
    } else if (action === 'balance') {
        return `Sisa Saldo`;
    } else {
        return `${actionText} ${namespace}`;
    }
}
