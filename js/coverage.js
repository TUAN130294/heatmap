// ===== COVERAGE GAP ANALYZER =====
// Phân tích vùng chưa được bao phủ để quy hoạch phát tờ rơi

class CoverageAnalyzer {
    constructor(map) {
        this.map = map;
        this.coverageCircles = new L.LayerGroup();
        this.gapLayer = null;
        this.opportunityMarkers = new L.LayerGroup();
        this.gridLayer = new L.LayerGroup();
        this.isShowingGaps = false;

        // Add layers to map
        this.coverageCircles.addTo(this.map);
        this.opportunityMarkers.addTo(this.map);
        this.gridLayer.addTo(this.map);
    }

    // Hiển thị vòng tròn bán kính phục vụ của mỗi store
    showCoverageRadius(storeIds = null, radiusKm = 5) {
        this.clearCoverageRadius();

        const stores = storeIds
            ? STORES_DATA.filter(s => storeIds.includes(s.id))
            : STORES_DATA;

        const colorMap = window.App.stores.colorMap;

        stores.forEach(store => {
            const color = colorMap.get(store.id) || '#00d4ff';

            // Outer circle (full radius)
            const outerCircle = L.circle([store.latitude, store.longitude], {
                radius: radiusKm * 1000, // Convert to meters
                color: color,
                fillColor: color,
                fillOpacity: 0.08,
                weight: 2,
                dashArray: '10, 5',
                className: 'coverage-circle'
            });

            // Inner circle (core area - 50% radius)
            const innerCircle = L.circle([store.latitude, store.longitude], {
                radius: radiusKm * 500,
                color: color,
                fillColor: color,
                fillOpacity: 0.15,
                weight: 1,
                className: 'coverage-circle-inner'
            });

            outerCircle.bindTooltip(`${store.name}<br>Bán kính: ${radiusKm}km`, {
                permanent: false,
                direction: 'top'
            });

            this.coverageCircles.addLayer(innerCircle);
            this.coverageCircles.addLayer(outerCircle);
        });

        Utils.showToast(`Đang hiển thị bán kính ${radiusKm}km cho ${stores.length} siêu thị`, 'success');
    }

    // Xóa vòng tròn bán kính
    clearCoverageRadius() {
        this.coverageCircles.clearLayers();
    }

    // Phân tích và hiển thị GAP ZONES (vùng chưa được phủ sóng)
    analyzeGaps(radiusKm = 5) {
        this.clearGapLayer();

        // Tạo grid chia nhỏ bản đồ
        const bounds = this.map.getBounds();
        const gridSize = 0.01; // Khoảng 1km mỗi ô

        const gaps = [];
        const opportunities = [];

        // Scan từng điểm trong grid
        for (let lat = bounds.getSouth(); lat <= bounds.getNorth(); lat += gridSize) {
            for (let lng = bounds.getWest(); lng <= bounds.getEast(); lng += gridSize) {

                // Tính khoảng cách đến store gần nhất
                let minDistance = Infinity;
                let nearestStore = null;

                STORES_DATA.forEach(store => {
                    const dist = Utils.calculateDistance(lat, lng, store.latitude, store.longitude);
                    if (dist < minDistance) {
                        minDistance = dist;
                        nearestStore = store;
                    }
                });

                // Đếm số đơn hàng trong bán kính 1km của điểm này
                const orderCount = ORDERS_DATA.filter(order => {
                    const dist = Utils.calculateDistance(lat, lng, order.customerLat, order.customerLng);
                    return dist <= 1; // Trong bán kính 1km
                }).length;

                // Xác định loại vùng
                if (minDistance > radiusKm) {
                    // Ngoài vùng phủ sóng của tất cả stores
                    gaps.push({
                        lat, lng,
                        type: 'out_of_range',
                        distance: minDistance,
                        orderCount,
                        priority: 'low'
                    });
                } else if (minDistance <= radiusKm && orderCount < 5) {
                    // Trong vùng phủ sóng nhưng ít đơn hàng -> CẦN ĐẨY MẠNH
                    const priority = minDistance <= radiusKm * 0.5 ? 'high' : 'medium';
                    opportunities.push({
                        lat, lng,
                        type: 'opportunity',
                        distance: minDistance,
                        nearestStore,
                        orderCount,
                        priority
                    });
                }
            }
        }

        // Hiển thị opportunities trên map
        this.showOpportunityZones(opportunities);

        // Lưu kết quả phân tích
        this.analysisResult = { gaps, opportunities };

        // Cập nhật UI
        this.updateGapReport(opportunities);

        return { gaps, opportunities };
    }

    // Hiển thị vùng cơ hội (cần đẩy mạnh truyền thông)
    showOpportunityZones(opportunities) {
        this.opportunityMarkers.clearLayers();

        // Nhóm các opportunity theo priority
        const highPriority = opportunities.filter(o => o.priority === 'high');
        const mediumPriority = opportunities.filter(o => o.priority === 'medium');

        // Tạo heatmap "ngược" cho vùng cơ hội (màu xanh = cần phát tờ rơi)
        const opportunityData = opportunities.map(o => [
            o.lat, o.lng,
            o.priority === 'high' ? 1.0 : 0.6
        ]);

        if (opportunityData.length > 0) {
            this.gapLayer = L.heatLayer(opportunityData, {
                radius: 30,
                blur: 20,
                maxZoom: 15,
                max: 1.0,
                minOpacity: 0.4,
                gradient: {
                    0.0: 'rgba(59, 130, 246, 0)',    // Transparent
                    0.3: 'rgba(59, 130, 246, 0.3)',  // Light blue
                    0.5: 'rgba(139, 92, 246, 0.5)', // Purple
                    0.7: 'rgba(236, 72, 153, 0.7)', // Pink
                    1.0: 'rgba(239, 68, 68, 0.9)'    // Red = highest priority
                }
            }).addTo(this.map);
        }

        // Thêm markers cho top opportunities
        const topOpportunities = highPriority.slice(0, 20);
        topOpportunities.forEach((opp, index) => {
            const marker = L.marker([opp.lat, opp.lng], {
                icon: L.divIcon({
                    className: 'opportunity-marker',
                    html: `
                        <div class="opp-marker-pin ${opp.priority}">
                            <span class="opp-icon">📍</span>
                            <span class="opp-rank">${index + 1}</span>
                        </div>
                    `,
                    iconSize: [36, 36],
                    iconAnchor: [18, 36]
                })
            });

            marker.bindPopup(`
                <div class="opportunity-popup">
                    <h4>🎯 Điểm tiềm năng #${index + 1}</h4>
                    <p><strong>Store gần nhất:</strong> ${opp.nearestStore?.name || 'N/A'}</p>
                    <p><strong>Khoảng cách:</strong> ${opp.distance.toFixed(1)} km</p>
                    <p><strong>Đơn hàng hiện tại:</strong> ${opp.orderCount}</p>
                    <p><strong>Mức độ ưu tiên:</strong> <span class="priority-badge ${opp.priority}">${opp.priority.toUpperCase()}</span></p>
                    <p class="recommendation">💡 Khuyến nghị: Tập trung phát tờ rơi tại khu vực này</p>
                </div>
            `);

            this.opportunityMarkers.addLayer(marker);
        });

        this.isShowingGaps = true;
        Utils.showToast(`Đã xác định ${opportunities.length} vùng cần đẩy mạnh truyền thông`, 'success');
    }

    // Xóa gap layer
    clearGapLayer() {
        if (this.gapLayer) {
            this.map.removeLayer(this.gapLayer);
            this.gapLayer = null;
        }
        this.opportunityMarkers.clearLayers();
        this.isShowingGaps = false;
    }

    // Hiển thị Grid phân tích
    showAnalysisGrid(cellSizeKm = 2) {
        this.gridLayer.clearLayers();

        const bounds = this.map.getBounds();
        const cellSize = cellSizeKm / 111.32; // Convert km to degrees

        let cellId = 0;

        for (let lat = bounds.getSouth(); lat < bounds.getNorth(); lat += cellSize) {
            for (let lng = bounds.getWest(); lng < bounds.getEast(); lng += cellSize) {
                cellId++;

                // Đếm orders trong cell này
                const cellOrders = ORDERS_DATA.filter(order => {
                    return order.customerLat >= lat &&
                        order.customerLat < lat + cellSize &&
                        order.customerLng >= lng &&
                        order.customerLng < lng + cellSize;
                });

                // Đếm stores trong cell
                const cellStores = STORES_DATA.filter(store => {
                    return store.latitude >= lat &&
                        store.latitude < lat + cellSize &&
                        store.longitude >= lng &&
                        store.longitude < lng + cellSize;
                });

                // Xác định màu dựa trên mật độ
                let fillColor, fillOpacity, status;
                const orderDensity = cellOrders.length;

                if (cellStores.length > 0) {
                    // Có store trong cell
                    fillColor = '#10b981'; // Green
                    fillOpacity = 0.2;
                    status = 'store_present';
                } else if (orderDensity === 0) {
                    // Không có đơn hàng -> HIGH PRIORITY
                    fillColor = '#ef4444'; // Red
                    fillOpacity = 0.4;
                    status = 'no_coverage';
                } else if (orderDensity < 10) {
                    // Ít đơn hàng -> MEDIUM PRIORITY
                    fillColor = '#f59e0b'; // Orange
                    fillOpacity = 0.3;
                    status = 'low_coverage';
                } else if (orderDensity < 30) {
                    // Trung bình
                    fillColor = '#3b82f6'; // Blue
                    fillOpacity = 0.2;
                    status = 'medium_coverage';
                } else {
                    // Tốt
                    fillColor = '#10b981'; // Green
                    fillOpacity = 0.15;
                    status = 'good_coverage';
                }

                const rect = L.rectangle(
                    [[lat, lng], [lat + cellSize, lng + cellSize]],
                    {
                        color: fillColor,
                        fillColor: fillColor,
                        fillOpacity: fillOpacity,
                        weight: 1,
                        className: `grid-cell ${status}`
                    }
                );

                rect.bindTooltip(`
                    <strong>Ô #${cellId}</strong><br>
                    📦 Đơn hàng: ${orderDensity}<br>
                    🏪 Stores: ${cellStores.length}<br>
                    📊 Trạng thái: ${this.getStatusLabel(status)}
                `, { sticky: true });

                rect.bindPopup(`
                    <div class="grid-popup">
                        <h4>📊 Phân tích ô #${cellId}</h4>
                        <table>
                            <tr><td>Đơn hàng:</td><td><strong>${orderDensity}</strong></td></tr>
                            <tr><td>Siêu thị:</td><td><strong>${cellStores.length}</strong></td></tr>
                            <tr><td>Trạng thái:</td><td><span class="status-${status}">${this.getStatusLabel(status)}</span></td></tr>
                        </table>
                        ${status === 'no_coverage' || status === 'low_coverage' ?
                        '<p class="action-needed">⚠️ Cần phát tờ rơi tại khu vực này!</p>' : ''}
                    </div>
                `);

                this.gridLayer.addLayer(rect);
            }
        }

        Utils.showToast(`Đã hiển thị lưới phân tích ${cellSizeKm}km`, 'success');
    }

    // Xóa grid
    clearGrid() {
        this.gridLayer.clearLayers();
    }

    // Get status label
    getStatusLabel(status) {
        const labels = {
            'store_present': '✅ Có store',
            'good_coverage': '🟢 Tốt',
            'medium_coverage': '🔵 Trung bình',
            'low_coverage': '🟠 Cần cải thiện',
            'no_coverage': '🔴 Cần phát tờ rơi'
        };
        return labels[status] || status;
    }

    // Cập nhật báo cáo Gap Analysis
    updateGapReport(opportunities) {
        const highCount = opportunities.filter(o => o.priority === 'high').length;
        const mediumCount = opportunities.filter(o => o.priority === 'medium').length;

        // Cập nhật UI nếu có panel
        const reportContainer = document.getElementById('gap-report');
        if (reportContainer) {
            reportContainer.innerHTML = `
                <div class="gap-summary">
                    <div class="gap-stat high">
                        <span class="gap-count">${highCount}</span>
                        <span class="gap-label">Ưu tiên cao</span>
                    </div>
                    <div class="gap-stat medium">
                        <span class="gap-count">${mediumCount}</span>
                        <span class="gap-label">Ưu tiên TB</span>
                    </div>
                </div>
                <p class="gap-advice">
                    💡 Tổng cộng <strong>${opportunities.length}</strong> vùng cần đẩy mạnh phát tờ rơi
                </p>
            `;
            reportContainer.classList.remove('hidden');
        }
    }

    // Export Gap Report
    exportGapReport() {
        if (!this.analysisResult) {
            Utils.showToast('Chưa có dữ liệu phân tích. Hãy chạy Gap Analysis trước!', 'warning');
            return;
        }

        const report = {
            generatedAt: new Date().toISOString(),
            summary: {
                totalOpportunities: this.analysisResult.opportunities.length,
                highPriority: this.analysisResult.opportunities.filter(o => o.priority === 'high').length,
                mediumPriority: this.analysisResult.opportunities.filter(o => o.priority === 'medium').length
            },
            topOpportunities: this.analysisResult.opportunities
                .filter(o => o.priority === 'high')
                .slice(0, 50)
                .map(o => ({
                    coordinates: { lat: o.lat, lng: o.lng },
                    nearestStore: o.nearestStore?.name,
                    distanceToStore: o.distance.toFixed(2) + ' km',
                    currentOrders: o.orderCount,
                    priority: o.priority,
                    recommendation: 'Phát tờ rơi tại khu vực này'
                }))
        };

        // Download
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gap-analysis-report-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        Utils.showToast('Đã xuất báo cáo Gap Analysis', 'success');
    }

    // Toggle all analysis layers
    toggleAll() {
        if (this.isShowingGaps) {
            this.clearAll();
        } else {
            this.showCoverageRadius(null, 5);
            this.analyzeGaps(5);
        }
    }

    // Clear all
    clearAll() {
        this.clearCoverageRadius();
        this.clearGapLayer();
        this.clearGrid();
        this.clearStrategicLayer();
        this.isShowingGaps = false;
    }

    // ===== STRATEGIC ANALYSIS =====
    // Phân tích chiến lược: Vùng ít bao phủ + Gần đối thủ = VỊ TRÍ VÀNG

    strategicLayer = new L.LayerGroup();
    goldenZones = [];

    initStrategicLayer() {
        if (!this.strategicLayer._map) {
            this.strategicLayer.addTo(this.map);
        }
    }

    // Phân tích Strategic (kết hợp đối thủ)
    analyzeStrategicZones(radiusKm = 5, competitorRadiusKm = 2) {
        this.clearStrategicLayer();
        this.initStrategicLayer();

        const bounds = this.map.getBounds();
        const gridSize = 0.008; // ~800m mỗi ô

        this.goldenZones = [];
        const strategicPoints = [];

        // Scan grid
        for (let lat = bounds.getSouth(); lat <= bounds.getNorth(); lat += gridSize) {
            for (let lng = bounds.getWest(); lng <= bounds.getEast(); lng += gridSize) {

                // 1. Khoảng cách đến Erablue gần nhất
                let minDistErablue = Infinity;
                let nearestErablue = null;
                STORES_DATA.forEach(store => {
                    const dist = Utils.calculateDistance(lat, lng, store.latitude, store.longitude);
                    if (dist < minDistErablue) {
                        minDistErablue = dist;
                        nearestErablue = store;
                    }
                });

                // 2. Khoảng cách đến đối thủ gần nhất
                let minDistCompetitor = Infinity;
                let nearestCompetitor = null;
                if (typeof COMPETITORS_DATA !== 'undefined') {
                    COMPETITORS_DATA.forEach(comp => {
                        const dist = Utils.calculateDistance(lat, lng, comp.latitude, comp.longitude);
                        if (dist < minDistCompetitor) {
                            minDistCompetitor = dist;
                            nearestCompetitor = comp;
                        }
                    });
                }

                // 3. Đếm đơn hàng trong khu vực
                const orderCount = ORDERS_DATA.filter(order => {
                    const dist = Utils.calculateDistance(lat, lng, order.customerLat, order.customerLng);
                    return dist <= 1;
                }).length;

                // 4. Tính điểm chiến lược (Score)
                // VỊ TRÍ VÀNG = Gần đối thủ + Ít đơn hàng Erablue + Trong vùng phục vụ
                let strategicScore = 0;
                let zoneType = 'normal';

                const inServiceArea = minDistErablue <= radiusKm;
                const nearCompetitor = minDistCompetitor <= competitorRadiusKm;
                const lowCoverage = orderCount < 5;

                if (inServiceArea && nearCompetitor && lowCoverage) {
                    // 🌟 VỊ TRÍ VÀNG - Ưu tiên cao nhất
                    strategicScore = 100;
                    zoneType = 'golden';
                } else if (nearCompetitor && lowCoverage) {
                    // 🔴 Gần đối thủ, ít coverage - Cần phản công
                    strategicScore = 80;
                    zoneType = 'attack';
                } else if (inServiceArea && !nearCompetitor && lowCoverage) {
                    // 🟠 Trong vùng phục vụ nhưng ít đơn - Cần phát triển
                    strategicScore = 60;
                    zoneType = 'develop';
                } else if (nearCompetitor && !lowCoverage) {
                    // 🟢 Gần đối thủ nhưng đang có coverage tốt - Giữ vững
                    strategicScore = 40;
                    zoneType = 'defend';
                }

                if (strategicScore >= 60) {
                    const point = {
                        lat, lng,
                        zoneType,
                        strategicScore,
                        minDistErablue,
                        nearestErablue,
                        minDistCompetitor,
                        nearestCompetitor,
                        orderCount
                    };
                    strategicPoints.push(point);

                    if (zoneType === 'golden') {
                        this.goldenZones.push(point);
                    }
                }
            }
        }

        // Render strategic zones
        this.renderStrategicZones(strategicPoints);

        // Update report
        this.updateStrategicReport(strategicPoints);

        return { strategicPoints, goldenZones: this.goldenZones };
    }

    // Render strategic zones on map
    renderStrategicZones(points) {
        const heatData = points.map(p => [
            p.lat, p.lng,
            p.strategicScore / 100
        ]);

        if (heatData.length > 0) {
            const strategicHeat = L.heatLayer(heatData, {
                radius: 35,
                blur: 25,
                maxZoom: 15,
                gradient: {
                    0.4: 'rgba(59, 130, 246, 0.3)',   // Blue - Develop
                    0.6: 'rgba(245, 158, 11, 0.5)',  // Orange - Develop
                    0.8: 'rgba(239, 68, 68, 0.7)',   // Red - Attack
                    1.0: 'rgba(234, 179, 8, 0.9)'    // Gold - Golden Zone
                }
            });
            this.strategicLayer.addLayer(strategicHeat);
        }

        // Add markers for golden zones
        const topGolden = this.goldenZones
            .sort((a, b) => b.strategicScore - a.strategicScore)
            .slice(0, 15);

        topGolden.forEach((zone, idx) => {
            const marker = L.marker([zone.lat, zone.lng], {
                icon: L.divIcon({
                    className: 'golden-zone-marker',
                    html: `
                        <div class="golden-marker" style="
                            width: 40px;
                            height: 40px;
                            background: linear-gradient(135deg, #f59e0b, #eab308);
                            border: 3px solid white;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 16px;
                            box-shadow: 0 0 20px rgba(245, 158, 11, 0.6);
                            animation: pulse-gold 2s infinite;
                        ">
                            ⭐
                        </div>
                        <span style="
                            position: absolute;
                            top: -10px;
                            right: -10px;
                            background: #ef4444;
                            color: white;
                            font-size: 11px;
                            font-weight: bold;
                            padding: 2px 6px;
                            border-radius: 10px;
                            border: 2px solid white;
                        ">#${idx + 1}</span>
                    `,
                    iconSize: [40, 40],
                    iconAnchor: [20, 20]
                })
            });

            const competitorName = zone.nearestCompetitor
                ? COMPETITOR_BRANDS[zone.nearestCompetitor.brand]?.name || zone.nearestCompetitor.name
                : 'N/A';

            marker.bindPopup(`
                <div class="strategic-popup golden">
                    <div class="popup-header golden">
                        <span class="golden-icon">⭐</span>
                        <h4>VỊ TRÍ VÀNG #${idx + 1}</h4>
                    </div>
                    <div class="popup-body">
                        <div class="popup-row">
                            <span class="label">🏪 Erablue gần nhất:</span>
                            <span class="value">${zone.nearestErablue?.name || 'N/A'}</span>
                        </div>
                        <div class="popup-row">
                            <span class="label">📏 Khoảng cách:</span>
                            <span class="value">${zone.minDistErablue.toFixed(1)} km</span>
                        </div>
                        <div class="popup-row competitor">
                            <span class="label">⚔️ Đối thủ gần nhất:</span>
                            <span class="value">${competitorName}</span>
                        </div>
                        <div class="popup-row">
                            <span class="label">📏 Cách đối thủ:</span>
                            <span class="value">${zone.minDistCompetitor.toFixed(1)} km</span>
                        </div>
                        <div class="popup-row">
                            <span class="label">📦 Đơn hàng hiện tại:</span>
                            <span class="value danger">${zone.orderCount}</span>
                        </div>
                    </div>
                    <div class="popup-recommendation">
                        💎 <strong>KHUYẾN NGHỊ:</strong> Ưu tiên phát tờ rơi tại đây!<br>
                        <small>Đây là vùng gần đối thủ nhưng Erablue chưa bao phủ tốt.</small>
                    </div>
                </div>
            `);

            this.strategicLayer.addLayer(marker);
        });

        Utils.showToast(`🌟 Đã xác định ${this.goldenZones.length} VỊ TRÍ VÀNG`, 'success');
    }

    // Clear strategic layer
    clearStrategicLayer() {
        if (this.strategicLayer) {
            this.strategicLayer.clearLayers();
        }
        this.goldenZones = [];
    }

    // Update strategic report
    updateStrategicReport(points) {
        const golden = points.filter(p => p.zoneType === 'golden').length;
        const attack = points.filter(p => p.zoneType === 'attack').length;
        const develop = points.filter(p => p.zoneType === 'develop').length;

        const reportContainer = document.getElementById('gap-report');
        if (reportContainer) {
            reportContainer.innerHTML = `
                <div class="strategic-summary">
                    <div class="strategic-stat golden">
                        <span class="stat-icon">⭐</span>
                        <span class="stat-count">${golden}</span>
                        <span class="stat-label">Vị trí vàng</span>
                    </div>
                    <div class="strategic-stat attack">
                        <span class="stat-icon">⚔️</span>
                        <span class="stat-count">${attack}</span>
                        <span class="stat-label">Cần phản công</span>
                    </div>
                    <div class="strategic-stat develop">
                        <span class="stat-icon">📈</span>
                        <span class="stat-count">${develop}</span>
                        <span class="stat-label">Cần phát triển</span>
                    </div>
                </div>
                <p class="strategic-advice">
                    🎯 Ưu tiên phát tờ rơi tại <strong>${golden}</strong> vị trí vàng (gần đối thủ + ít coverage)
                </p>
            `;
            reportContainer.classList.remove('hidden');
        }
    }

    // Export strategic report
    exportStrategicReport() {
        if (this.goldenZones.length === 0) {
            Utils.showToast('Chưa có dữ liệu. Hãy chạy Strategic Analysis trước!', 'warning');
            return;
        }

        const report = {
            generatedAt: new Date().toISOString(),
            type: 'strategic_analysis',
            summary: {
                totalGoldenZones: this.goldenZones.length,
                competitorCount: typeof COMPETITORS_DATA !== 'undefined' ? COMPETITORS_DATA.length : 0,
                erablueStoreCount: STORES_DATA.length
            },
            goldenZones: this.goldenZones.map((z, idx) => ({
                rank: idx + 1,
                coordinates: { lat: z.lat, lng: z.lng },
                strategicScore: z.strategicScore,
                nearestErablue: z.nearestErablue?.name,
                distanceToErablue: z.minDistErablue.toFixed(2) + ' km',
                nearestCompetitor: z.nearestCompetitor?.name,
                competitorBrand: z.nearestCompetitor?.brand,
                distanceToCompetitor: z.minDistCompetitor.toFixed(2) + ' km',
                currentOrders: z.orderCount,
                recommendation: 'VỊ TRÍ VÀNG - Ưu tiên phát tờ rơi cao nhất'
            })),
            competitorData: typeof COMPETITORS_DATA !== 'undefined' ? {
                lastSync: COMPETITOR_SYNC.lastUpdate,
                totalCompetitors: COMPETITORS_DATA.length,
                byBrand: Object.keys(COMPETITOR_BRANDS).map(b => ({
                    brand: COMPETITOR_BRANDS[b].name,
                    count: COMPETITORS_DATA.filter(c => c.brand === b).length
                }))
            } : null
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `strategic-analysis-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        Utils.showToast('Đã xuất báo cáo Strategic Analysis', 'success');
    }
}

window.CoverageAnalyzer = CoverageAnalyzer;
