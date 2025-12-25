// ===== HEATMAP MANAGER - OPTIMIZED =====

class HeatmapManager {
    constructor(map) {
        this.map = map;
        this.layers = new Map(); // storeId -> heatLayer
        this.activeStores = new Set();
        this.config = { ...CONFIG.heatmap };
        this.cachedData = new Map(); // Cache filtered orders
        this.isUpdating = false;

        // Throttled rebuild function
        this.throttledRebuild = Utils.throttle(() => {
            this._doRebuild();
        }, 300);

        // Bind zoom event for dynamic sampling
        this.map.on('zoomend', Utils.debounce(() => {
            this.onZoomChange();
        }, 200));
    }

    // Get sample rate based on zoom level and total points
    getSampleRate(totalPoints) {
        const zoom = this.map.getZoom();

        // More aggressive sampling when zoomed out or many points
        if (totalPoints > 2000) {
            if (zoom <= 10) return 0.15;  // 15% of data
            if (zoom <= 12) return 0.3;   // 30% of data
            if (zoom <= 14) return 0.5;   // 50% of data
            return 0.7;                    // 70% of data
        } else if (totalPoints > 1000) {
            if (zoom <= 10) return 0.3;
            if (zoom <= 12) return 0.5;
            return 0.8;
        }
        return 1; // Show all for small datasets
    }

    // Sample data for performance
    sampleData(orders, sampleRate) {
        if (sampleRate >= 1) return orders;

        const sampled = [];
        const step = Math.floor(1 / sampleRate);

        for (let i = 0; i < orders.length; i += step) {
            sampled.push(orders[i]);
        }

        // Always include some random samples for better distribution
        const remaining = orders.filter((_, i) => i % step !== 0);
        const extraSamples = Math.floor(remaining.length * 0.1);
        for (let i = 0; i < extraSamples; i++) {
            const idx = Math.floor(Math.random() * remaining.length);
            sampled.push(remaining[idx]);
        }

        return sampled;
    }

    // Create heatmap for a single store (optimized)
    createStoreHeatmap(storeId, color) {
        const orders = this.getOrdersForStore(storeId);
        if (orders.length === 0) return null;

        // Apply sampling for large datasets
        const sampleRate = this.getSampleRate(orders.length);
        const sampledOrders = this.sampleData(orders, sampleRate);

        // Convert to heat data points [lat, lng, intensity]
        const heatData = sampledOrders.map(order => [
            order.customerLat,
            order.customerLng,
            0.8
        ]);

        // Create gradient
        const gradient = Utils.generateHeatGradient(color);

        // Optimized layer settings
        const heatLayer = L.heatLayer(heatData, {
            radius: this.config.radius,
            blur: this.config.blur,
            maxZoom: this.config.maxZoom,
            max: this.config.max,
            minOpacity: this.config.minOpacity,
            gradient: gradient,
            // Performance options
            pane: 'overlayPane'
        });

        this.layers.set(storeId, {
            layer: heatLayer,
            color: color,
            totalOrders: orders.length,
            sampledCount: sampledOrders.length
        });

        return heatLayer;
    }

    // Show heatmap with loading feedback
    showHeatmap(storeId, color) {
        // Use requestAnimationFrame for smooth rendering
        requestAnimationFrame(() => {
            if (!this.layers.has(storeId)) {
                this.createStoreHeatmap(storeId, color);
            }

            const layerData = this.layers.get(storeId);
            if (layerData && !this.map.hasLayer(layerData.layer)) {
                layerData.layer.addTo(this.map);
                this.activeStores.add(storeId);
            }
        });
    }

    // Hide heatmap
    hideHeatmap(storeId) {
        const layerData = this.layers.get(storeId);
        if (layerData && this.map.hasLayer(layerData.layer)) {
            this.map.removeLayer(layerData.layer);
            this.activeStores.delete(storeId);
        }
    }

    // Toggle heatmap
    toggleHeatmap(storeId, color) {
        if (this.activeStores.has(storeId)) {
            this.hideHeatmap(storeId);
            return false;
        } else {
            this.showHeatmap(storeId, color);
            return true;
        }
    }

    // Show multiple heatmaps (batched for performance)
    showMultipleHeatmaps(storeIds, colorMap) {
        // Process in batches to prevent UI freeze
        const batchSize = 5;
        let index = 0;

        const processBatch = () => {
            const batch = storeIds.slice(index, index + batchSize);

            batch.forEach(storeId => {
                const color = colorMap.get(storeId) || CONFIG.storeColors[0];
                this.showHeatmap(storeId, color);
            });

            index += batchSize;

            if (index < storeIds.length) {
                requestAnimationFrame(processBatch);
            }
        };

        requestAnimationFrame(processBatch);
    }

    // Clear all heatmaps
    clearAllHeatmaps() {
        this.layers.forEach((layerData) => {
            if (this.map.hasLayer(layerData.layer)) {
                this.map.removeLayer(layerData.layer);
            }
        });
        this.activeStores.clear();
    }

    // Update radius (throttled)
    updateRadius(radius) {
        this.config.radius = radius;
        this.throttledRebuild();
    }

    // Update blur (throttled)
    updateBlur(blur) {
        this.config.blur = blur;
        this.throttledRebuild();
    }

    // Internal rebuild
    _doRebuild() {
        if (this.isUpdating) return;
        this.isUpdating = true;

        const activeIds = [...this.activeStores];
        const colorMap = window.App.stores.colorMap;

        // Clear and rebuild
        this.clearAllHeatmaps();
        this.layers.clear();
        this.cachedData.clear();

        // Rebuild with slight delay between each
        activeIds.forEach((storeId, index) => {
            setTimeout(() => {
                const color = colorMap.get(storeId) || CONFIG.storeColors[0];
                this.showHeatmap(storeId, color);

                if (index === activeIds.length - 1) {
                    this.isUpdating = false;
                }
            }, index * 50);
        });

        if (activeIds.length === 0) {
            this.isUpdating = false;
        }
    }

    // Handle zoom changes - resample data
    onZoomChange() {
        if (this.activeStores.size === 0) return;

        // Only resample if we have many active stores
        if (this.activeStores.size > 3) {
            this.throttledRebuild();
        }
    }

    // Get orders with caching
    getOrdersForStore(storeId) {
        const cacheKey = `${storeId}_${JSON.stringify(window.App.filters?.getActiveFilters() || {})}`;

        if (this.cachedData.has(cacheKey)) {
            return this.cachedData.get(cacheKey);
        }

        const filters = window.App.filters?.getActiveFilters() || {};

        const filtered = ORDERS_DATA.filter(order => {
            if (order.storeId !== storeId) return false;
            if (filters.dateFrom && order.orderDate < filters.dateFrom) return false;
            if (filters.dateTo && order.orderDate > filters.dateTo) return false;
            return true;
        });

        this.cachedData.set(cacheKey, filtered);
        return filtered;
    }

    // Clear cache
    clearCache() {
        this.cachedData.clear();
    }

    getActiveStores() {
        return [...this.activeStores];
    }

    isStoreActive(storeId) {
        return this.activeStores.has(storeId);
    }
}

window.HeatmapManager = HeatmapManager;
