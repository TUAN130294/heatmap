// ===== ERABLUE HEATMAP - CONFIGURATION =====

const CONFIG = {
    // Map Settings
    map: {
        defaultCenter: [-6.2088, 106.8456], // Jakarta
        defaultZoom: 11,
        minZoom: 9,
        maxZoom: 18,
        tileLayer: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution: '© OpenStreetMap © CARTO'
    },

    // Heatmap Settings (optimized)
    heatmap: {
        radius: 20,         // Slightly smaller for performance
        blur: 12,           // Less blur = faster render
        maxZoom: 16,        // Lower max zoom for heatmap
        max: 1.0,
        minOpacity: 0.35
    },

    // Performance Settings
    performance: {
        maxStoresForFullData: 5,      // Show full data only for ≤5 stores
        sampleRateZoomThreshold: 12,  // Apply sampling below this zoom
        batchSize: 5,                 // Process stores in batches
        rebuildDebounce: 300          // ms before rebuilding heatmaps
    },

    // Store Colors Palette (12 colors for nearby stores differentiation)
    storeColors: [
        '#FF6B6B', // Coral Red
        '#4ECDC4', // Teal
        '#45B7D1', // Sky Blue
        '#96CEB4', // Sage Green
        '#FFEAA7', // Soft Yellow
        '#DDA0DD', // Plum
        '#98D8C8', // Mint
        '#F7DC6F', // Mustard
        '#BB8FCE', // Lavender
        '#85C1E9', // Light Blue
        '#F8B500', // Golden
        '#00CED1'  // Dark Cyan
    ],

    // Distance thresholds for color assignment (km)
    colorDistanceThreshold: 5,

    // UI Settings
    ui: {
        toastDuration: 3000,
        animationDuration: 300
    }
};

// Freeze config to prevent modifications
Object.freeze(CONFIG);
Object.freeze(CONFIG.map);
Object.freeze(CONFIG.heatmap);
Object.freeze(CONFIG.performance);
Object.freeze(CONFIG.storeColors);
Object.freeze(CONFIG.ui);
