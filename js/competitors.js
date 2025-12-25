// ===== COMPETITOR MANAGER =====
// Quản lý và phân tích vị trí đối thủ

class CompetitorManager {
    constructor(map) {
        this.map = map;
        this.competitorLayer = new L.LayerGroup();
        this.competitorHeatLayer = null;
        this.isVisible = false;
        this.filterBrands = new Set(Object.keys(COMPETITOR_BRANDS));

        this.competitorLayer.addTo(this.map);
    }

    // Hiển thị đối thủ trên bản đồ
    showCompetitors(brands = null) {
        this.clearCompetitors();

        const filteredCompetitors = brands
            ? COMPETITORS_DATA.filter(c => brands.includes(c.brand))
            : COMPETITORS_DATA;

        filteredCompetitors.forEach(comp => {
            const brand = COMPETITOR_BRANDS[comp.brand];

            const marker = L.marker([comp.latitude, comp.longitude], {
                icon: L.divIcon({
                    className: 'competitor-marker',
                    html: `
                        <div class="comp-marker-pin" style="
                            background: ${brand.color};
                            color: white;
                            width: 32px;
                            height: 32px;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 18px;
                            border: 3px solid white;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                        ">${brand.icon}</div>
                    `,
                    iconSize: [32, 32],
                    iconAnchor: [16, 16]
                })
            });

            marker.bindPopup(this.createCompetitorPopup(comp, brand));
            marker.bindTooltip(comp.name, { direction: 'top', offset: [0, -16] });

            this.competitorLayer.addLayer(marker);
        });

        this.isVisible = true;
        Utils.showToast(`Đang hiển thị ${filteredCompetitors.length} đối thủ`, 'success');
    }

    // Tạo popup cho competitor
    createCompetitorPopup(comp, brand) {
        // Tính khoảng cách đến Erablue gần nhất
        let nearestErablue = null;
        let minDistance = Infinity;

        STORES_DATA.forEach(store => {
            const dist = Utils.calculateDistance(
                comp.latitude, comp.longitude,
                store.latitude, store.longitude
            );
            if (dist < minDistance) {
                minDistance = dist;
                nearestErablue = store;
            }
        });

        const threatClass = brand.threat === 'high' ? 'threat-high' :
            brand.threat === 'medium' ? 'threat-medium' : 'threat-low';

        return `
            <div class="competitor-popup">
                <div class="comp-header" style="border-left: 4px solid ${brand.color}; padding-left: 10px;">
                    <span class="comp-icon">${brand.icon}</span>
                    <div class="comp-info">
                        <h4>${comp.name}</h4>
                        <span class="comp-brand">${brand.name}</span>
                    </div>
                </div>
                <div class="comp-stats">
                    <div class="comp-stat-row">
                        <span class="label">📍 Quận/Huyện:</span>
                        <span class="value">${comp.district}</span>
                    </div>
                    <div class="comp-stat-row">
                        <span class="label">🏪 Erablue gần nhất:</span>
                        <span class="value">${nearestErablue?.name || 'N/A'}</span>
                    </div>
                    <div class="comp-stat-row">
                        <span class="label">📏 Khoảng cách:</span>
                        <span class="value">${minDistance.toFixed(1)} km</span>
                    </div>
                    <div class="comp-stat-row">
                        <span class="label">⚠️ Mức độ cạnh tranh:</span>
                        <span class="value ${threatClass}">${brand.threat.toUpperCase()}</span>
                    </div>
                </div>
                <div class="comp-sync">
                    <small>🔄 Cập nhật: ${comp.lastSync}</small>
                </div>
                <div class="comp-actions">
                    <button onclick="window.App.competitors.analyzeAroundCompetitor('${comp.id}')" class="btn-small btn-analyze">
                        🎯 Phân tích vùng
                    </button>
                </div>
            </div>
        `;
    }

    // Xóa competitors
    clearCompetitors() {
        this.competitorLayer.clearLayers();
        if (this.competitorHeatLayer) {
            this.map.removeLayer(this.competitorHeatLayer);
            this.competitorHeatLayer = null;
        }
        this.isVisible = false;
    }

    // Toggle visibility
    toggleCompetitors() {
        if (this.isVisible) {
            this.clearCompetitors();
        } else {
            this.showCompetitors();
        }
    }

    // Lọc theo brand
    filterByBrand(brands) {
        this.filterBrands = new Set(brands);
        this.showCompetitors(brands);
    }

    // Phân tích vùng quanh đối thủ
    analyzeAroundCompetitor(competitorId) {
        const comp = COMPETITORS_DATA.find(c => c.id === competitorId);
        if (!comp) return;

        // Zoom to competitor
        this.map.flyTo([comp.latitude, comp.longitude], 15, {
            animate: true,
            duration: 1
        });

        // Highlight area around competitor
        const circle = L.circle([comp.latitude, comp.longitude], {
            radius: 2000, // 2km
            color: '#ef4444',
            fillColor: '#ef4444',
            fillOpacity: 0.15,
            weight: 2,
            dashArray: '5, 10'
        }).addTo(this.map);

        // Count orders in area
        const ordersInArea = ORDERS_DATA.filter(order => {
            const dist = Utils.calculateDistance(
                comp.latitude, comp.longitude,
                order.customerLat, order.customerLng
            );
            return dist <= 2;
        }).length;

        Utils.showToast(
            `📊 Khu vực quanh ${COMPETITOR_BRANDS[comp.brand].name}: ${ordersInArea} đơn hàng Erablue`,
            ordersInArea > 20 ? 'success' : 'warning'
        );

        // Auto remove circle after 10s
        setTimeout(() => {
            this.map.removeLayer(circle);
        }, 10000);
    }

    // Get competitor density heatmap
    showCompetitorHeatmap() {
        if (this.competitorHeatLayer) {
            this.map.removeLayer(this.competitorHeatLayer);
        }

        const heatData = COMPETITORS_DATA.map(comp => [
            comp.latitude,
            comp.longitude,
            COMPETITOR_BRANDS[comp.brand].threat === 'high' ? 1.0 :
                COMPETITOR_BRANDS[comp.brand].threat === 'medium' ? 0.6 : 0.3
        ]);

        this.competitorHeatLayer = L.heatLayer(heatData, {
            radius: 40,
            blur: 30,
            maxZoom: 15,
            gradient: {
                0.0: 'rgba(46, 204, 113, 0.2)',
                0.4: 'rgba(241, 196, 15, 0.4)',
                0.7: 'rgba(231, 76, 60, 0.6)',
                1.0: 'rgba(192, 57, 43, 0.8)'
            }
        }).addTo(this.map);

        Utils.showToast('🔥 Hiển thị mật độ cạnh tranh', 'info');
    }

    // Get stats
    getStats() {
        const stats = {};

        Object.keys(COMPETITOR_BRANDS).forEach(brand => {
            stats[brand] = COMPETITORS_DATA.filter(c => c.brand === brand).length;
        });

        return {
            total: COMPETITORS_DATA.length,
            byBrand: stats,
            lastSync: COMPETITOR_SYNC.lastUpdate
        };
    }
}

window.CompetitorManager = CompetitorManager;
