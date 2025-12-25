// ===== STORES MANAGER =====

class StoresManager {
    constructor(mapManager) {
        this.mapManager = mapManager;
        this.stores = [];
        this.colorMap = new Map();
        this.markers = new Map();
        this.selectedStore = null;
    }

    init() {
        // Load and process stores
        this.stores = STORES_DATA.map(store => ({
            ...store,
            totalOrders: this.getOrderCount(store.id),
            totalRevenue: this.getTotalRevenue(store.id),
            avgOrderValue: this.getAvgOrderValue(store.id)
        }));

        // Assign colors using graph coloring
        this.colorMap = Utils.assignStoreColors(this.stores, CONFIG.colorDistanceThreshold);

        // Apply colors to stores
        this.stores.forEach(store => {
            store.colorCode = this.colorMap.get(store.id);
        });

        // Create markers
        this.createMarkers();

        console.log(`Loaded ${this.stores.length} stores`);
    }

    getOrderCount(storeId) {
        return ORDERS_DATA.filter(o => o.storeId === storeId).length;
    }

    getTotalRevenue(storeId) {
        return ORDERS_DATA
            .filter(o => o.storeId === storeId)
            .reduce((sum, o) => sum + o.orderValue, 0);
    }

    getAvgOrderValue(storeId) {
        const orders = ORDERS_DATA.filter(o => o.storeId === storeId);
        if (orders.length === 0) return 0;
        return Math.round(orders.reduce((sum, o) => sum + o.orderValue, 0) / orders.length);
    }

    createMarkers() {
        this.stores.forEach(store => {
            const marker = this.createMarker(store);
            this.markers.set(store.id, marker);
            this.mapManager.addMarker(marker);
        });
    }

    createMarker(store) {
        const icon = L.divIcon({
            className: 'store-marker',
            html: `
                <div class="marker-wrapper">
                    <div class="marker-pin" style="background-color: ${store.colorCode}">
                        <span class="marker-icon">🏪</span>
                    </div>
                    <div class="marker-label">${store.name}</div>
                </div>
            `,
            iconSize: [44, 60],
            iconAnchor: [22, 55],
            popupAnchor: [0, -50]
        });

        const marker = L.marker([store.latitude, store.longitude], { icon });

        // Bind popup
        marker.bindPopup(this.createPopupContent(store), {
            maxWidth: 300,
            className: 'store-popup-wrapper'
        });

        // Events
        marker.on('click', () => this.onMarkerClick(store));

        return marker;
    }

    createPopupContent(store) {
        return `
            <div class="store-popup">
                <div class="popup-header">
                    <div class="popup-color-indicator" style="background-color: ${store.colorCode}"></div>
                    <div class="popup-title">
                        <h3>${store.name}</h3>
                        <p>${store.address}</p>
                    </div>
                </div>
                <div class="popup-stats">
                    <div class="popup-stat">
                        <span class="popup-stat-value">${Utils.formatNumber(store.totalOrders)}</span>
                        <span class="popup-stat-label">Đơn hàng</span>
                    </div>
                    <div class="popup-stat">
                        <span class="popup-stat-value">${Utils.formatCurrency(store.totalRevenue)}</span>
                        <span class="popup-stat-label">Doanh thu</span>
                    </div>
                    <div class="popup-stat">
                        <span class="popup-stat-value">${Utils.formatCurrency(store.avgOrderValue)}</span>
                        <span class="popup-stat-label">TB/Đơn</span>
                    </div>
                    <div class="popup-stat">
                        <span class="popup-stat-value">${this.getAvgDistance(store.id)} km</span>
                        <span class="popup-stat-label">KC trung bình</span>
                    </div>
                </div>
                <div class="popup-actions">
                    <button class="popup-btn popup-btn-primary" onclick="window.App.showStoreHeatmap('${store.id}')">
                        🔥 Xem Heatmap
                    </button>
                    <button class="popup-btn popup-btn-secondary" onclick="window.App.showStoreDetails('${store.id}')">
                        📊 Chi tiết
                    </button>
                </div>
            </div>
        `;
    }

    getAvgDistance(storeId) {
        const orders = ORDERS_DATA.filter(o => o.storeId === storeId);
        if (orders.length === 0) return 0;
        const total = orders.reduce((sum, o) => sum + o.distance, 0);
        return (total / orders.length).toFixed(1);
    }

    onMarkerClick(store) {
        this.selectedStore = store;

        // Update marker styles
        this.markers.forEach((marker, id) => {
            const el = marker.getElement();
            if (el) {
                el.classList.toggle('active', id === store.id);
            }
        });

        // Show store details in sidebar
        window.App.analytics.showStoreDetails(store);
    }

    getStoreById(storeId) {
        return this.stores.find(s => s.id === storeId);
    }

    getStoresByCity(cityCode) {
        if (!cityCode) return this.stores;
        return this.stores.filter(s => s.city === cityCode);
    }

    getStoresByDistrict(districtCode) {
        return this.stores.filter(s => s.district === districtCode);
    }

    getAllStores() {
        return this.stores;
    }

    getTopStores(count = 5) {
        return [...this.stores]
            .sort((a, b) => b.totalOrders - a.totalOrders)
            .slice(0, count);
    }
}

window.StoresManager = StoresManager;
