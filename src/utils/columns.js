export const deviceCols = [
    {
        key: 'code',
        label: 'Kode Perangkat'
    },
    {
        key: 'facility_name',
        label: 'Lokasi Perangkat'
    },
    {
        key: 'block',
        label: 'Blok'
    },
    {
        key: 'msisdn',
        label: 'No. Telpon'
    },
    {
        key: 'imei',
        label: 'IMEI'
    },
    {
        key: 'ip_address',
        label: 'Alamat IP'
    }
];

export const facilityCols = [
    {
        key: 'name',
        label: 'Nama Lapas'
    },
    {
        key: 'address',
        label: 'Alamat Lapas'
    }
];

export const prisonerCols = [
    {
        key: 'nik',
        label: 'NIK'
    },
    {
        key: 'name',
        label: 'Nama Tahanan'
    },
    {
        key: 'facility.name',
        label: 'Lokasi Lapas'
    }
];

export const purchaseCols = [
    {
        key: 'po_number',
        label: 'No. PO'
    },
    {
        key: 'date',
        label: 'Tanggal PO'
    },
    {
        key: 'facility_name',
        label: 'Lokasi Lapas'
    }
];

export const voucherTypeCols = [
    {
        key: 'name',
        label: 'Nama Voucher'
    },
    {
        key: 'price',
        label: 'Harga Voucher'
    }
];

export const userCols = [
    {
        key: 'name',
        label: 'Nama'
    },
    {
        key: 'roles[0].name',
        label: 'Role'
    },
    {
        key: 'email',
        label: 'Email'
    },
    {
        key: 'updated_at',
        label: 'Last Logged In'
    }
];

export const roleCols = [
    {
        key: 'name',
        label: 'Nama'
    },
    {
        key: 'status',
        label: 'Status'
    }
];
