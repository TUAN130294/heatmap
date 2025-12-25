// ===== COMPETITOR DATA - JAKARTA ELECTRONICS =====
// Dữ liệu vị trí đối thủ Blibli Electronics và Electronics City

const COMPETITORS_DATA = [
    // ========== BLIBLI ELECTRONICS ==========
    // Jakarta Pusat
    { id: 'blibli-1', name: 'Blibli Store Grand Indonesia', brand: 'blibli', city: 'jakarta', district: 'jakarta-pusat', latitude: -6.1950, longitude: 106.8215, lastSync: '2024-12-25' },
    { id: 'blibli-2', name: 'Blibli Store Plaza Indonesia', brand: 'blibli', city: 'jakarta', district: 'jakarta-pusat', latitude: -6.1930, longitude: 106.8230, lastSync: '2024-12-25' },

    // Jakarta Selatan
    { id: 'blibli-3', name: 'Blibli Store Pondok Indah Mall', brand: 'blibli', city: 'jakarta', district: 'jakarta-selatan', latitude: -6.2660, longitude: 106.7830, lastSync: '2024-12-25' },
    { id: 'blibli-4', name: 'Blibli Store Gandaria City', brand: 'blibli', city: 'jakarta', district: 'jakarta-selatan', latitude: -6.2440, longitude: 106.7835, lastSync: '2024-12-25' },
    { id: 'blibli-5', name: 'Blibli Store Pacific Place', brand: 'blibli', city: 'jakarta', district: 'jakarta-selatan', latitude: -6.2240, longitude: 106.8090, lastSync: '2024-12-25' },

    // Jakarta Utara
    { id: 'blibli-6', name: 'Blibli Store Kelapa Gading', brand: 'blibli', city: 'jakarta', district: 'jakarta-utara', latitude: -6.1580, longitude: 106.9080, lastSync: '2024-12-25' },
    { id: 'blibli-7', name: 'Blibli Store PIK Avenue', brand: 'blibli', city: 'jakarta', district: 'jakarta-utara', latitude: -6.1100, longitude: 106.7440, lastSync: '2024-12-25' },

    // Jakarta Barat
    { id: 'blibli-8', name: 'Blibli Store Central Park', brand: 'blibli', city: 'jakarta', district: 'jakarta-barat', latitude: -6.1770, longitude: 106.7905, lastSync: '2024-12-25' },
    { id: 'blibli-9', name: 'Blibli Store Puri Indah Mall', brand: 'blibli', city: 'jakarta', district: 'jakarta-barat', latitude: -6.1875, longitude: 106.7355, lastSync: '2024-12-25' },

    // Jakarta Timur  
    { id: 'blibli-10', name: 'Blibli Store Cipinang Indah Mall', brand: 'blibli', city: 'jakarta', district: 'jakarta-timur', latitude: -6.2200, longitude: 106.8900, lastSync: '2024-12-25' },

    // Tangerang
    { id: 'blibli-11', name: 'Blibli Store AEON BSD', brand: 'blibli', city: 'tangerang', district: 'bsd-city', latitude: -6.3040, longitude: 106.6440, lastSync: '2024-12-25' },
    { id: 'blibli-12', name: 'Blibli Store Summarecon Serpong', brand: 'blibli', city: 'tangerang', district: 'tangerang-selatan', latitude: -6.2420, longitude: 106.6320, lastSync: '2024-12-25' },

    // Bekasi
    { id: 'blibli-13', name: 'Blibli Store Summarecon Mall Bekasi', brand: 'blibli', city: 'bekasi', district: 'bekasi-kota', latitude: -6.2260, longitude: 107.0020, lastSync: '2024-12-25' },

    // ========== ELECTRONICS CITY ==========
    // Jakarta Pusat
    { id: 'ec-1', name: 'Electronics City Sarinah', brand: 'electronicscity', city: 'jakarta', district: 'jakarta-pusat', latitude: -6.1870, longitude: 106.8240, lastSync: '2024-12-25' },
    { id: 'ec-2', name: 'Electronics City Atrium Senen', brand: 'electronicscity', city: 'jakarta', district: 'jakarta-pusat', latitude: -6.1780, longitude: 106.8410, lastSync: '2024-12-25' },

    // Jakarta Selatan
    { id: 'ec-3', name: 'Electronics City Blok M Plaza', brand: 'electronicscity', city: 'jakarta', district: 'jakarta-selatan', latitude: -6.2445, longitude: 106.7975, lastSync: '2024-12-25' },
    { id: 'ec-4', name: 'Electronics City Kota Kasablanka', brand: 'electronicscity', city: 'jakarta', district: 'jakarta-selatan', latitude: -6.2235, longitude: 106.8430, lastSync: '2024-12-25' },
    { id: 'ec-5', name: 'Electronics City Lotte Kuningan', brand: 'electronicscity', city: 'jakarta', district: 'jakarta-selatan', latitude: -6.2180, longitude: 106.8280, lastSync: '2024-12-25' },
    { id: 'ec-6', name: 'Electronics City Cilandak Town Square', brand: 'electronicscity', city: 'jakarta', district: 'jakarta-selatan', latitude: -6.2910, longitude: 106.7980, lastSync: '2024-12-25' },

    // Jakarta Utara
    { id: 'ec-7', name: 'Electronics City Mall of Indonesia', brand: 'electronicscity', city: 'jakarta', district: 'jakarta-utara', latitude: -6.1490, longitude: 106.8920, lastSync: '2024-12-25' },
    { id: 'ec-8', name: 'Electronics City Pluit Village', brand: 'electronicscity', city: 'jakarta', district: 'jakarta-utara', latitude: -6.1250, longitude: 106.7900, lastSync: '2024-12-25' },
    { id: 'ec-9', name: 'Electronics City Sunter Mall', brand: 'electronicscity', city: 'jakarta', district: 'jakarta-utara', latitude: -6.1430, longitude: 106.8670, lastSync: '2024-12-25' },

    // Jakarta Barat
    { id: 'ec-10', name: 'Electronics City Taman Anggrek', brand: 'electronicscity', city: 'jakarta', district: 'jakarta-barat', latitude: -6.1780, longitude: 106.7925, lastSync: '2024-12-25' },
    { id: 'ec-11', name: 'Electronics City Lippo Mall Puri', brand: 'electronicscity', city: 'jakarta', district: 'jakarta-barat', latitude: -6.1860, longitude: 106.7320, lastSync: '2024-12-25' },
    { id: 'ec-12', name: 'Electronics City Citra Garden', brand: 'electronicscity', city: 'jakarta', district: 'jakarta-barat', latitude: -6.1680, longitude: 106.7050, lastSync: '2024-12-25' },

    // Jakarta Timur
    { id: 'ec-13', name: 'Electronics City Bassura City', brand: 'electronicscity', city: 'jakarta', district: 'jakarta-timur', latitude: -6.2280, longitude: 106.8580, lastSync: '2024-12-25' },
    { id: 'ec-14', name: 'Electronics City Cibubur Junction', brand: 'electronicscity', city: 'jakarta', district: 'jakarta-timur', latitude: -6.3660, longitude: 106.8830, lastSync: '2024-12-25' },

    // Tangerang
    { id: 'ec-15', name: 'Electronics City Living World Alam Sutera', brand: 'electronicscity', city: 'tangerang', district: 'tangerang-selatan', latitude: -6.2430, longitude: 106.6530, lastSync: '2024-12-25' },
    { id: 'ec-16', name: 'Electronics City Bintaro Xchange', brand: 'electronicscity', city: 'tangerang', district: 'tangerang-selatan', latitude: -6.2790, longitude: 106.7165, lastSync: '2024-12-25' },
    { id: 'ec-17', name: 'Electronics City AEON Mall BSD', brand: 'electronicscity', city: 'tangerang', district: 'bsd-city', latitude: -6.3030, longitude: 106.6450, lastSync: '2024-12-25' },
    { id: 'ec-18', name: 'Electronics City TangCity Mall', brand: 'electronicscity', city: 'tangerang', district: 'tangerang-kota', latitude: -6.1790, longitude: 106.6340, lastSync: '2024-12-25' },

    // Bekasi
    { id: 'ec-19', name: 'Electronics City Grand Metropolitan', brand: 'electronicscity', city: 'bekasi', district: 'bekasi-kota', latitude: -6.2500, longitude: 106.9935, lastSync: '2024-12-25' },
    { id: 'ec-20', name: 'Electronics City Grand Galaxy Park', brand: 'electronicscity', city: 'bekasi', district: 'bekasi-barat', latitude: -6.2640, longitude: 106.9725, lastSync: '2024-12-25' },

    // Depok
    { id: 'ec-21', name: 'Electronics City Margo City', brand: 'electronicscity', city: 'depok', district: 'depok-kota', latitude: -6.3720, longitude: 106.8340, lastSync: '2024-12-25' },
    { id: 'ec-22', name: 'Electronics City ITC Depok', brand: 'electronicscity', city: 'depok', district: 'margonda', latitude: -6.3930, longitude: 106.8230, lastSync: '2024-12-25' },

    // Bogor
    { id: 'ec-23', name: 'Electronics City Botani Square', brand: 'electronicscity', city: 'bogor', district: 'bogor-kota', latitude: -6.5960, longitude: 106.8090, lastSync: '2024-12-25' }
];

// Brand info for styling - Updated for Electronics
const COMPETITOR_BRANDS = {
    'blibli': {
        name: 'Blibli Electronics',
        shortName: 'Blibli',
        color: '#0066CC',  // Blibli blue
        icon: '💙',
        threat: 'high'
    },
    'electronicscity': {
        name: 'Electronics City',
        shortName: 'EC',
        color: '#FF6B00',  // Electronics City orange
        icon: '🧡',
        threat: 'high'
    }
};

// Sync metadata
const COMPETITOR_SYNC = {
    lastUpdate: '2024-12-25T08:00:00+07:00',
    nextUpdate: '2024-12-26T08:00:00+07:00',
    updateInterval: 24 * 60 * 60 * 1000, // 24 hours
    totalCompetitors: COMPETITORS_DATA.length
};

window.COMPETITORS_DATA = COMPETITORS_DATA;
window.COMPETITOR_BRANDS = COMPETITOR_BRANDS;
window.COMPETITOR_SYNC = COMPETITOR_SYNC;
