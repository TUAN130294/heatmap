// ===== JAKARTA DEMOGRAPHIC DATA =====
// Based on BPS Indonesia 2023 Statistics
// Source: https://jakarta.bps.go.id/

const JAKARTA_DEMOGRAPHICS = {
    // Jakarta Pusat
    "menteng": {
        district: "Menteng",
        city: "Jakarta Pusat",
        population: 67890,
        area_km2: 6.52,
        density_per_km2: 10412,
        households: 22630,
        avg_income_idr: 12500000, // per month
        income_class: "upper-middle",
        economic_index: 82,
        retail_potential: "high",
        demographics: {
            age_0_14: 15.2,
            age_15_64: 72.3,
            age_65_plus: 12.5
        },
        education: {
            university: 45.2,
            high_school: 38.1,
            below: 16.7
        }
    },
    "gambir": {
        district: "Gambir",
        city: "Jakarta Pusat",
        population: 78234,
        area_km2: 7.59,
        density_per_km2: 10307,
        households: 26078,
        avg_income_idr: 15200000,
        income_class: "upper",
        economic_index: 88,
        retail_potential: "high",
        demographics: {
            age_0_14: 14.8,
            age_15_64: 71.9,
            age_65_plus: 13.3
        },
        education: {
            university: 52.1,
            high_school: 33.4,
            below: 14.5
        }
    },
    "tanah_abang": {
        district: "Tanah Abang",
        city: "Jakarta Pusat",
        population: 156789,
        area_km2: 9.30,
        density_per_km2: 16859,
        households: 52263,
        avg_income_idr: 8500000,
        income_class: "middle",
        economic_index: 65,
        retail_potential: "high",
        demographics: {
            age_0_14: 22.1,
            age_15_64: 68.4,
            age_65_plus: 9.5
        },
        education: {
            university: 28.3,
            high_school: 45.2,
            below: 26.5
        }
    },
    "senen": {
        district: "Senen",
        city: "Jakarta Pusat",
        population: 98456,
        area_km2: 4.22,
        density_per_km2: 23332,
        households: 32819,
        avg_income_idr: 7200000,
        income_class: "middle",
        economic_index: 58,
        retail_potential: "medium",
        demographics: {
            age_0_14: 23.5,
            age_15_64: 67.8,
            age_65_plus: 8.7
        },
        education: {
            university: 22.1,
            high_school: 48.9,
            below: 29.0
        }
    },
    "cempaka_putih": {
        district: "Cempaka Putih",
        city: "Jakarta Pusat",
        population: 89234,
        area_km2: 4.69,
        density_per_km2: 19026,
        households: 29745,
        avg_income_idr: 9800000,
        income_class: "middle",
        economic_index: 71,
        retail_potential: "medium",
        demographics: {
            age_0_14: 19.8,
            age_15_64: 70.2,
            age_65_plus: 10.0
        },
        education: {
            university: 35.4,
            high_school: 42.1,
            below: 22.5
        }
    },

    // Jakarta Selatan
    "kebayoran_baru": {
        district: "Kebayoran Baru",
        city: "Jakarta Selatan",
        population: 128456,
        area_km2: 12.92,
        density_per_km2: 9941,
        households: 42819,
        avg_income_idr: 18500000,
        income_class: "upper",
        economic_index: 92,
        retail_potential: "premium",
        demographics: {
            age_0_14: 16.2,
            age_15_64: 69.8,
            age_65_plus: 14.0
        },
        education: {
            university: 58.9,
            high_school: 28.1,
            below: 13.0
        }
    },
    "kemang": {
        district: "Kemang",
        city: "Jakarta Selatan",
        population: 67890,
        area_km2: 5.85,
        density_per_km2: 11605,
        households: 22630,
        avg_income_idr: 22000000,
        income_class: "upper",
        economic_index: 95,
        retail_potential: "premium",
        demographics: {
            age_0_14: 14.5,
            age_15_64: 72.1,
            age_65_plus: 13.4
        },
        education: {
            university: 65.2,
            high_school: 24.3,
            below: 10.5
        }
    },
    "tebet": {
        district: "Tebet",
        city: "Jakarta Selatan",
        population: 112345,
        area_km2: 9.53,
        density_per_km2: 11787,
        households: 37448,
        avg_income_idr: 11200000,
        income_class: "upper-middle",
        economic_index: 78,
        retail_potential: "high",
        demographics: {
            age_0_14: 17.8,
            age_15_64: 71.5,
            age_65_plus: 10.7
        },
        education: {
            university: 42.3,
            high_school: 39.8,
            below: 17.9
        }
    },
    "pancoran": {
        district: "Pancoran",
        city: "Jakarta Selatan",
        population: 98765,
        area_km2: 8.36,
        density_per_km2: 11815,
        households: 32922,
        avg_income_idr: 10800000,
        income_class: "upper-middle",
        economic_index: 75,
        retail_potential: "high",
        demographics: {
            age_0_14: 18.2,
            age_15_64: 71.0,
            age_65_plus: 10.8
        },
        education: {
            university: 40.1,
            high_school: 41.2,
            below: 18.7
        }
    },

    // Jakarta Barat
    "grogol": {
        district: "Grogol Petamburan",
        city: "Jakarta Barat",
        population: 234567,
        area_km2: 9.99,
        density_per_km2: 23480,
        households: 78189,
        avg_income_idr: 9200000,
        income_class: "middle",
        economic_index: 68,
        retail_potential: "high",
        demographics: {
            age_0_14: 21.3,
            age_15_64: 69.5,
            age_65_plus: 9.2
        },
        education: {
            university: 32.1,
            high_school: 44.5,
            below: 23.4
        }
    },
    "palmerah": {
        district: "Palmerah",
        city: "Jakarta Barat",
        population: 189234,
        area_km2: 7.51,
        density_per_km2: 25197,
        households: 63078,
        avg_income_idr: 8800000,
        income_class: "middle",
        economic_index: 64,
        retail_potential: "medium",
        demographics: {
            age_0_14: 22.5,
            age_15_64: 68.1,
            age_65_plus: 9.4
        },
        education: {
            university: 28.9,
            high_school: 46.7,
            below: 24.4
        }
    },
    "kebon_jeruk": {
        district: "Kebon Jeruk",
        city: "Jakarta Barat",
        population: 312456,
        area_km2: 17.98,
        density_per_km2: 17378,
        households: 104152,
        avg_income_idr: 10500000,
        income_class: "upper-middle",
        economic_index: 74,
        retail_potential: "high",
        demographics: {
            age_0_14: 20.1,
            age_15_64: 70.3,
            age_65_plus: 9.6
        },
        education: {
            university: 36.5,
            high_school: 42.8,
            below: 20.7
        }
    },

    // Jakarta Timur
    "cakung": {
        district: "Cakung",
        city: "Jakarta Timur",
        population: 498765,
        area_km2: 42.47,
        density_per_km2: 11744,
        households: 166255,
        avg_income_idr: 6500000,
        income_class: "lower-middle",
        economic_index: 52,
        retail_potential: "medium",
        demographics: {
            age_0_14: 25.8,
            age_15_64: 67.2,
            age_65_plus: 7.0
        },
        education: {
            university: 18.2,
            high_school: 48.9,
            below: 32.9
        }
    },
    "jatinegara": {
        district: "Jatinegara",
        city: "Jakarta Timur",
        population: 267890,
        area_km2: 10.25,
        density_per_km2: 26136,
        households: 89297,
        avg_income_idr: 7800000,
        income_class: "middle",
        economic_index: 61,
        retail_potential: "medium",
        demographics: {
            age_0_14: 23.2,
            age_15_64: 68.5,
            age_65_plus: 8.3
        },
        education: {
            university: 24.5,
            high_school: 47.8,
            below: 27.7
        }
    },
    "matraman": {
        district: "Matraman",
        city: "Jakarta Timur",
        population: 178456,
        area_km2: 4.96,
        density_per_km2: 35979,
        households: 59485,
        avg_income_idr: 8200000,
        income_class: "middle",
        economic_index: 63,
        retail_potential: "medium",
        demographics: {
            age_0_14: 21.8,
            age_15_64: 69.1,
            age_65_plus: 9.1
        },
        education: {
            university: 26.8,
            high_school: 48.2,
            below: 25.0
        }
    },

    // Jakarta Utara
    "kelapa_gading": {
        district: "Kelapa Gading",
        city: "Jakarta Utara",
        population: 156789,
        area_km2: 14.87,
        density_per_km2: 10544,
        households: 52263,
        avg_income_idr: 16500000,
        income_class: "upper",
        economic_index: 89,
        retail_potential: "premium",
        demographics: {
            age_0_14: 15.9,
            age_15_64: 71.2,
            age_65_plus: 12.9
        },
        education: {
            university: 54.3,
            high_school: 32.1,
            below: 13.6
        }
    },
    "penjaringan": {
        district: "Penjaringan",
        city: "Jakarta Utara",
        population: 345678,
        area_km2: 35.49,
        density_per_km2: 9740,
        households: 115226,
        avg_income_idr: 7500000,
        income_class: "middle",
        economic_index: 59,
        retail_potential: "medium",
        demographics: {
            age_0_14: 24.1,
            age_15_64: 68.3,
            age_65_plus: 7.6
        },
        education: {
            university: 21.2,
            high_school: 46.5,
            below: 32.3
        }
    },
    "tanjung_priok": {
        district: "Tanjung Priok",
        city: "Jakarta Utara",
        population: 412345,
        area_km2: 25.13,
        density_per_km2: 16411,
        households: 137448,
        avg_income_idr: 7200000,
        income_class: "middle",
        economic_index: 57,
        retail_potential: "medium",
        demographics: {
            age_0_14: 24.5,
            age_15_64: 67.8,
            age_65_plus: 7.7
        },
        education: {
            university: 19.8,
            high_school: 47.2,
            below: 33.0
        }
    }
};

// District boundaries (approximate center points for matching)
const JAKARTA_DISTRICT_BOUNDS = [
    { id: "menteng", lat: -6.1945, lng: 106.8434, radius: 1.5 },
    { id: "gambir", lat: -6.1753, lng: 106.8224, radius: 1.5 },
    { id: "tanah_abang", lat: -6.1929, lng: 106.8127, radius: 1.8 },
    { id: "senen", lat: -6.1743, lng: 106.8456, radius: 1.2 },
    { id: "cempaka_putih", lat: -6.1724, lng: 106.8732, radius: 1.3 },
    { id: "kebayoran_baru", lat: -6.2446, lng: 106.7942, radius: 2.0 },
    { id: "kemang", lat: -6.2608, lng: 106.8137, radius: 1.5 },
    { id: "tebet", lat: -6.2274, lng: 106.8513, radius: 1.8 },
    { id: "pancoran", lat: -6.2453, lng: 106.8484, radius: 1.6 },
    { id: "grogol", lat: -6.1682, lng: 106.7835, radius: 1.8 },
    { id: "palmerah", lat: -6.1924, lng: 106.7976, radius: 1.5 },
    { id: "kebon_jeruk", lat: -6.1876, lng: 106.7642, radius: 2.5 },
    { id: "cakung", lat: -6.1753, lng: 106.9512, radius: 4.0 },
    { id: "jatinegara", lat: -6.2135, lng: 106.8723, radius: 1.8 },
    { id: "matraman", lat: -6.2012, lng: 106.8567, radius: 1.3 },
    { id: "kelapa_gading", lat: -6.1589, lng: 106.9054, radius: 2.2 },
    { id: "penjaringan", lat: -6.1234, lng: 106.7856, radius: 3.5 },
    { id: "tanjung_priok", lat: -6.1198, lng: 106.8756, radius: 3.0 }
];

// Find district by coordinates
function findDistrictByCoordinates(lat, lng) {
    let closestDistrict = null;
    let minDistance = Infinity;

    for (const bound of JAKARTA_DISTRICT_BOUNDS) {
        const distance = Math.sqrt(
            Math.pow(lat - bound.lat, 2) + Math.pow(lng - bound.lng, 2)
        ) * 111; // Convert to km

        if (distance < bound.radius && distance < minDistance) {
            minDistance = distance;
            closestDistrict = bound.id;
        }
    }

    return closestDistrict ? JAKARTA_DEMOGRAPHICS[closestDistrict] : null;
}

// Economic indicators for Jakarta regions
const JAKARTA_ECONOMIC = {
    average_retail_spend: 2850000, // IDR per month per household
    electronics_market_size: 45000000000000, // 45 Trillion IDR
    growth_rate: 5.8, // % annual
    consumer_confidence_index: 127.5,
    unemployment_rate: 6.2,
    inflation_rate: 3.1
};

window.JAKARTA_DEMOGRAPHICS = JAKARTA_DEMOGRAPHICS;
window.JAKARTA_DISTRICT_BOUNDS = JAKARTA_DISTRICT_BOUNDS;
window.JAKARTA_ECONOMIC = JAKARTA_ECONOMIC;
window.findDistrictByCoordinates = findDistrictByCoordinates;
