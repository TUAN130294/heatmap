// ===== MAP MANAGER - OPTIMIZED =====

class MapManager {
    constructor() {
        this.map = null;
        this.storeMarkers = new L.LayerGroup();
        this.initialized = false;
    }

    init() {
        // Initialize Leaflet map with performance options
        this.map = L.map('map', {
            center: CONFIG.map.defaultCenter,
            zoom: CONFIG.map.defaultZoom,
            minZoom: CONFIG.map.minZoom,
            maxZoom: CONFIG.map.maxZoom,
            zoomControl: false,
            attributionControl: true,
            // Performance optimizations
            preferCanvas: true,           // Use canvas instead of SVG
            renderer: L.canvas(),          // Canvas renderer
            fadeAnimation: false,          // Disable fade for snappier feel
            zoomAnimation: true,           // Keep zoom animation
            markerZoomAnimation: true,
            wheelDebounceTime: 100,        // Debounce scroll zoom
            wheelPxPerZoomLevel: 120,      // Smoother wheel zoom
            updateWhenZooming: false,      // Don't update layers while zooming
            updateWhenIdle: true           // Update when idle
        });

        // Add dark tile layer with optimized settings
        L.tileLayer(CONFIG.map.tileLayer, {
            attribution: CONFIG.map.attribution,
            maxZoom: CONFIG.map.maxZoom,
            // Tile loading optimizations
            updateWhenIdle: true,
            updateWhenZooming: false,
            keepBuffer: 2,                 // Keep 2 tiles outside view
            maxNativeZoom: 18
        }).addTo(this.map);

        // Add store markers layer
        this.storeMarkers.addTo(this.map);

        // Bind custom controls
        this.bindControls();

        // Disable box zoom for better performance
        this.map.boxZoom.disable();

        this.initialized = true;
        console.log('Map initialized with optimizations');
    }

    bindControls() {
        // Zoom controls
        document.getElementById('btn-zoom-in').addEventListener('click', () => {
            this.map.zoomIn();
        });

        document.getElementById('btn-zoom-out').addEventListener('click', () => {
            this.map.zoomOut();
        });

        document.getElementById('btn-locate').addEventListener('click', () => {
            this.flyToCenter();
        });

        document.getElementById('btn-fullscreen').addEventListener('click', () => {
            this.toggleFullscreen();
        });
    }

    flyToCenter() {
        this.map.flyTo(CONFIG.map.defaultCenter, CONFIG.map.defaultZoom, {
            duration: 0.8,
            easeLinearity: 0.5
        });
    }

    flyToCity(cityCode) {
        const city = CITIES_DATA.find(c => c.code === cityCode);
        if (city) {
            this.map.flyTo(city.center, city.zoom, {
                duration: 0.8,
                easeLinearity: 0.5
            });
        }
    }

    flyToStore(storeId) {
        const store = window.App.stores.getStoreById(storeId);
        if (store) {
            this.map.flyTo([store.latitude, store.longitude], 14, {
                duration: 0.8,
                easeLinearity: 0.5
            });
        }
    }

    // Smooth pan to location
    panTo(latlng, zoom) {
        if (zoom) {
            this.map.setView(latlng, zoom, { animate: true, duration: 0.5 });
        } else {
            this.map.panTo(latlng, { animate: true, duration: 0.5 });
        }
    }

    toggleFullscreen() {
        const elem = document.documentElement;
        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch(err => {
                console.log('Fullscreen error:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    addMarker(marker) {
        this.storeMarkers.addLayer(marker);
    }

    clearMarkers() {
        this.storeMarkers.clearLayers();
    }

    getMap() {
        return this.map;
    }

    getBounds() {
        return this.map.getBounds();
    }

    getZoom() {
        return this.map.getZoom();
    }

    invalidateSize() {
        if (this.map) {
            // Use requestAnimationFrame for smooth resize
            requestAnimationFrame(() => {
                this.map.invalidateSize({ animate: false });
            });
        }
    }

    // Stop all animations
    stopAnimations() {
        this.map.stop();
    }
}

window.MapManager = MapManager;
