// ===== ERABLUE STORES DATA - JAKARTA =====
// 25 siêu thị Erablue tại Jakarta và vùng phụ cận

const STORES_DATA = [
    // Jakarta Pusat
    {
        id: 'ERA-001',
        name: 'Erablue Menteng',
        address: 'Jl. Menteng Raya No. 45, Menteng',
        city: 'jakarta',
        district: 'jakarta-pusat',
        latitude: -6.1952,
        longitude: 106.8347
    },
    {
        id: 'ERA-002',
        name: 'Erablue Tanah Abang',
        address: 'Jl. Fachrudin No. 12, Tanah Abang',
        city: 'jakarta',
        district: 'jakarta-pusat',
        latitude: -6.1858,
        longitude: 106.8119
    },

    // Jakarta Selatan
    {
        id: 'ERA-003',
        name: 'Erablue Kemang',
        address: 'Jl. Kemang Raya No. 88, Kemang',
        city: 'jakarta',
        district: 'jakarta-selatan',
        latitude: -6.2608,
        longitude: 106.8137
    },
    {
        id: 'ERA-004',
        name: 'Erablue Pondok Indah',
        address: 'Jl. Metro Pondok Indah No. 10',
        city: 'jakarta',
        district: 'jakarta-selatan',
        latitude: -6.2655,
        longitude: 106.7852
    },
    {
        id: 'ERA-005',
        name: 'Erablue Blok M',
        address: 'Jl. Melawai No. 55, Blok M',
        city: 'jakarta',
        district: 'jakarta-selatan',
        latitude: -6.2436,
        longitude: 106.7982
    },
    {
        id: 'ERA-006',
        name: 'Erablue Tebet',
        address: 'Jl. Tebet Raya No. 23, Tebet',
        city: 'jakarta',
        district: 'jakarta-selatan',
        latitude: -6.2271,
        longitude: 106.8511
    },

    // Jakarta Utara
    {
        id: 'ERA-007',
        name: 'Erablue Kelapa Gading',
        address: 'Mall Kelapa Gading Lt. GF',
        city: 'jakarta',
        district: 'jakarta-utara',
        latitude: -6.1568,
        longitude: 106.9055
    },
    {
        id: 'ERA-008',
        name: 'Erablue Sunter',
        address: 'Jl. Danau Sunter Utara No. 78',
        city: 'jakarta',
        district: 'jakarta-utara',
        latitude: -6.1420,
        longitude: 106.8680
    },
    {
        id: 'ERA-009',
        name: 'Erablue PIK',
        address: 'Pantai Indah Kapuk Boulevard',
        city: 'jakarta',
        district: 'jakarta-utara',
        latitude: -6.1090,
        longitude: 106.7410
    },

    // Jakarta Barat
    {
        id: 'ERA-010',
        name: 'Erablue Grogol',
        address: 'Jl. Daan Mogot No. 100',
        city: 'jakarta',
        district: 'jakarta-barat',
        latitude: -6.1677,
        longitude: 106.7808
    },
    {
        id: 'ERA-011',
        name: 'Erablue Taman Anggrek',
        address: 'Mall Taman Anggrek Lt. LG',
        city: 'jakarta',
        district: 'jakarta-barat',
        latitude: -6.1766,
        longitude: 106.7915
    },
    {
        id: 'ERA-012',
        name: 'Erablue Puri Indah',
        address: 'Puri Indah Mall Lt. 1',
        city: 'jakarta',
        district: 'jakarta-barat',
        latitude: -6.1867,
        longitude: 106.7346
    },

    // Jakarta Timur
    {
        id: 'ERA-013',
        name: 'Erablue Cawang',
        address: 'Jl. MT. Haryono No. 50, Cawang',
        city: 'jakarta',
        district: 'jakarta-timur',
        latitude: -6.2420,
        longitude: 106.8662
    },
    {
        id: 'ERA-014',
        name: 'Erablue Rawamangun',
        address: 'Jl. Pemuda No. 88, Rawamangun',
        city: 'jakarta',
        district: 'jakarta-timur',
        latitude: -6.1925,
        longitude: 106.8828
    },
    {
        id: 'ERA-015',
        name: 'Erablue Cibubur',
        address: 'Cibubur Junction Mall',
        city: 'jakarta',
        district: 'jakarta-timur',
        latitude: -6.3650,
        longitude: 106.8850
    },

    // Tangerang
    {
        id: 'ERA-016',
        name: 'Erablue BSD',
        address: 'The Breeze BSD City',
        city: 'tangerang',
        district: 'bsd-city',
        latitude: -6.3017,
        longitude: 106.6529
    },
    {
        id: 'ERA-017',
        name: 'Erablue Alam Sutera',
        address: 'Mall @ Alam Sutera',
        city: 'tangerang',
        district: 'tangerang-selatan',
        latitude: -6.2410,
        longitude: 106.6505
    },
    {
        id: 'ERA-018',
        name: 'Erablue Bintaro',
        address: 'Bintaro Jaya Xchange Mall',
        city: 'tangerang',
        district: 'tangerang-selatan',
        latitude: -6.2785,
        longitude: 106.7156
    },
    {
        id: 'ERA-019',
        name: 'Erablue Tangerang Kota',
        address: 'Tangcity Mall',
        city: 'tangerang',
        district: 'tangerang-kota',
        latitude: -6.1783,
        longitude: 106.6319
    },

    // Bekasi
    {
        id: 'ERA-020',
        name: 'Erablue Summarecon Bekasi',
        address: 'Summarecon Mall Bekasi',
        city: 'bekasi',
        district: 'bekasi-kota',
        latitude: -6.2252,
        longitude: 107.0009
    },
    {
        id: 'ERA-021',
        name: 'Erablue Grand Galaxy',
        address: 'Grand Galaxy Park Mall',
        city: 'bekasi',
        district: 'bekasi-barat',
        latitude: -6.2631,
        longitude: 106.9718
    },
    {
        id: 'ERA-022',
        name: 'Erablue Metropolitan',
        address: 'Metropolitan Mall Bekasi',
        city: 'bekasi',
        district: 'bekasi-barat',
        latitude: -6.2489,
        longitude: 106.9927
    },

    // Depok
    {
        id: 'ERA-023',
        name: 'Erablue Margonda',
        address: 'Depok Town Square',
        city: 'depok',
        district: 'margonda',
        latitude: -6.3917,
        longitude: 106.8222
    },
    {
        id: 'ERA-024',
        name: 'Erablue Margo City',
        address: 'Margo City Mall',
        city: 'depok',
        district: 'depok-kota',
        latitude: -6.3713,
        longitude: 106.8327
    },

    // Bogor
    {
        id: 'ERA-025',
        name: 'Erablue Bogor',
        address: 'Botani Square Mall',
        city: 'bogor',
        district: 'bogor-kota',
        latitude: -6.5952,
        longitude: 106.8078
    }
];
