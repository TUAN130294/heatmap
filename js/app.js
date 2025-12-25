// ===== ERABLUE HEATMAP - MAIN APPLICATION =====

const App = {
    map: null,
    heatmap: null,
    stores: null,
    filters: null,
    analytics: null,
    coverage: null,    // Gap Analysis
    competitors: null, // Competitor Analysis
    mobile: null,      // Mobile UI
    isMobile: window.innerWidth <= 768,

    async init() {
        console.log('🏪 Initializing Erablue Heatmap...');

        try {
            // Show loading
            this.showLoading(true);

            // Initialize map
            this.map = new MapManager();
            this.map.init();

            // Initialize stores (needs map)
            this.stores = new StoresManager(this.map);
            this.stores.init();

            // Initialize heatmap (needs map)
            this.heatmap = new HeatmapManager(this.map.getMap());

            // Initialize filters (needs stores)
            this.filters = new FiltersManager();
            this.filters.init();

            // Initialize analytics
            this.analytics = new AnalyticsManager();
            this.analytics.init();

            // Initialize coverage analyzer (Gap Analysis)
            this.coverage = new CoverageAnalyzer(this.map.getMap());

            // Initialize competitor manager
            this.competitors = new CompetitorManager(this.map.getMap());
            this.updateCompetitorUI();

            // Initialize mobile UI (after all others)
            this.mobile = new MobileManager();
            this.mobile.init();

            // Bind global events
            this.bindEvents();

            // Hide loading
            this.showLoading(false);

            console.log('✅ Application initialized successfully!');

            const welcomeMsg = this.isMobile
                ? '📱 Chào mừng! Nhấn 🔥 để xem heatmap'
                : '🏪 Chào mừng đến Erablue Heatmap Pro!';
            Utils.showToast(welcomeMsg, 'success');

        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showLoading(false);
            Utils.showToast('Lỗi khởi tạo ứng dụng', 'error');
        }
    },

    bindEvents() {
        // View toggle
        document.getElementById('btn-single-view').addEventListener('click', () => {
            this.setViewMode('single');
        });

        document.getElementById('btn-multi-view').addEventListener('click', () => {
            this.setViewMode('multi');
        });

        document.getElementById('btn-gap-view').addEventListener('click', () => {
            this.setViewMode('gap');
        });

        // Export button
        document.getElementById('btn-export').addEventListener('click', () => {
            this.exportData();
        });

        // Settings button
        document.getElementById('btn-settings').addEventListener('click', () => {
            Utils.showToast('Cài đặt sẽ được thêm trong phiên bản tiếp theo', 'info');
        });

        // Stats panel collapse
        document.getElementById('btn-collapse-stats').addEventListener('click', () => {
            const panel = document.getElementById('stats-panel');
            panel.classList.toggle('collapsed');
        });

        // ===== GAP ANALYSIS EVENTS =====

        // Coverage radius slider
        const radiusSlider = document.getElementById('coverage-radius');
        const radiusValue = document.getElementById('coverage-radius-value');
        radiusSlider.addEventListener('input', (e) => {
            radiusValue.textContent = e.target.value;
        });

        // Show coverage radius
        document.getElementById('btn-show-coverage').addEventListener('click', () => {
            const radius = parseInt(document.getElementById('coverage-radius').value);
            this.coverage.showCoverageRadius(null, radius);
        });

        // Find gap zones
        document.getElementById('btn-show-gaps').addEventListener('click', () => {
            const radius = parseInt(document.getElementById('coverage-radius').value);
            this.showLoading(true);

            setTimeout(() => {
                this.coverage.analyzeGaps(radius);
                this.showLoading(false);
            }, 100);
        });

        // Show analysis grid
        document.getElementById('btn-show-grid').addEventListener('click', () => {
            this.coverage.showAnalysisGrid(2);
        });

        // Export gap report
        document.getElementById('btn-export-gaps').addEventListener('click', () => {
            this.coverage.exportGapReport();
        });

        // ===== COMPETITOR ANALYSIS EVENTS =====

        // Show competitors
        document.getElementById('btn-show-competitors')?.addEventListener('click', () => {
            const selectedBrands = this.getSelectedCompetitorBrands();
            this.competitors.showCompetitors(selectedBrands.length > 0 ? selectedBrands : null);
        });

        // Competitor heatmap
        document.getElementById('btn-competitor-heat')?.addEventListener('click', () => {
            this.competitors.showCompetitorHeatmap();
        });

        // ===== STRATEGIC BUSINESS INTELLIGENCE EVENTS =====

        // Competitor radius slider
        const competitorRadiusSlider = document.getElementById('competitor-radius');
        const competitorRadiusValue = document.getElementById('competitor-radius-value');
        competitorRadiusSlider?.addEventListener('input', (e) => {
            competitorRadiusValue.textContent = e.target.value + ' km';
        });

        // Market Share Analysis
        document.getElementById('btn-market-share')?.addEventListener('click', () => {
            this.showLoading(true);
            setTimeout(() => {
                const result = window.StrategicIntelligence.calculateMarketShare();
                this.showMarketShareReport(result);
                this.showLoading(false);
            }, 100);
        });

        // Competitor Threat Score
        document.getElementById('btn-threat-score')?.addEventListener('click', () => {
            this.showLoading(true);
            // Show competitors first
            this.competitors.showCompetitors();
            setTimeout(() => {
                const threats = window.StrategicIntelligence.calculateCompetitorThreatScores();
                this.showThreatReport(threats);
                this.showLoading(false);
            }, 100);
        });

        // Expansion Priority Map
        document.getElementById('btn-expansion-priority')?.addEventListener('click', () => {
            this.showLoading(true);
            setTimeout(() => {
                const priorities = window.StrategicIntelligence.calculateExpansionPriority();
                this.showExpansionReport(priorities);
                this.showLoading(false);
            }, 100);
        });

        // Revenue Opportunity Zones
        document.getElementById('btn-revenue-zones')?.addEventListener('click', () => {
            this.showLoading(true);
            setTimeout(() => {
                const zones = window.StrategicIntelligence.calculateRevenueOpportunities();
                this.showRevenueReport(zones);
                this.showLoading(false);
            }, 100);
        });

        // Find Golden Zones (strategic analysis)
        document.getElementById('btn-strategic-analysis')?.addEventListener('click', () => {
            const serviceRadius = parseInt(document.getElementById('coverage-radius').value);
            const competitorRadius = parseInt(document.getElementById('competitor-radius').value);

            this.showLoading(true);
            this.competitors.showCompetitors();

            setTimeout(() => {
                this.coverage.analyzeStrategicZones(serviceRadius, competitorRadius);
                this.showLoading(false);
            }, 100);
        });

        // Full BI Report Export
        document.getElementById('btn-full-report')?.addEventListener('click', () => {
            this.showLoading(true);
            setTimeout(() => {
                const report = window.StrategicIntelligence.exportFullReport();
                Utils.showToast('Full BI Report exported successfully', 'success');
                this.showLoading(false);
            }, 200);
        });

        // Clear all layers
        document.getElementById('btn-clear-all').addEventListener('click', () => {
            this.heatmap.clearAllHeatmaps();
            this.coverage.clearAll();
            this.competitors.clearCompetitors();
            Utils.showToast('Đã xóa tất cả layers', 'info');
        });

        // Window resize
        window.addEventListener('resize', Utils.debounce(() => {
            this.map.invalidateSize();
        }, 250));

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.heatmap.clearAllHeatmaps();
                this.coverage.clearAll();
                this.competitors.clearCompetitors();
            }
            // Press 'G' for Gap Analysis
            if (e.key === 'g' || e.key === 'G') {
                this.coverage.toggleAll();
            }
            // Press 'C' for Competitors
            if (e.key === 'c' || e.key === 'C') {
                this.competitors.toggleCompetitors();
            }
            // Press 'S' for Strategic
            if (e.key === 's' || e.key === 'S') {
                document.getElementById('btn-strategic-analysis')?.click();
            }
        });
    },

    setViewMode(mode) {
        const singleBtn = document.getElementById('btn-single-view');
        const multiBtn = document.getElementById('btn-multi-view');
        const gapBtn = document.getElementById('btn-gap-view');

        // Reset all
        [singleBtn, multiBtn, gapBtn].forEach(btn => btn.classList.remove('active'));

        if (mode === 'single') {
            singleBtn.classList.add('active');
            this.coverage.clearAll();
            Utils.showToast('Chế độ đơn lẻ: Click vào siêu thị để xem heatmap', 'info');
        } else if (mode === 'multi') {
            multiBtn.classList.add('active');
            this.coverage.clearAll();
            Utils.showToast('Chế độ tổng hợp: Chọn nhiều siêu thị từ bộ lọc', 'info');
        } else if (mode === 'gap') {
            gapBtn.classList.add('active');
            // Auto show gap analysis
            const radius = parseInt(document.getElementById('coverage-radius').value);
            this.coverage.showCoverageRadius(null, radius);
            Utils.showToast('🎯 Gap Analysis: Tìm vùng cần phát tờ rơi', 'info');
        }
    },

    // Show heatmap for single store (called from popup)
    showStoreHeatmap(storeId) {
        const store = this.stores.getStoreById(storeId);
        if (!store) return;

        // Clear existing heatmaps
        this.heatmap.clearAllHeatmaps();

        // Show this store's heatmap
        this.heatmap.showHeatmap(storeId, store.colorCode);

        // Fly to store
        this.map.flyToStore(storeId);

        // Close popup
        this.map.getMap().closePopup();

        Utils.showToast(`Đang hiển thị heatmap: ${store.name}`, 'success');
    },

    // Show store details (called from popup)
    showStoreDetails(storeId) {
        const store = this.stores.getStoreById(storeId);
        if (store) {
            this.analytics.showStoreDetails(store);
        }
    },

    showLoading(show) {
        const overlay = document.getElementById('loading-overlay');
        if (show) {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    },

    exportData() {
        const activeStores = this.heatmap.getActiveStores();

        if (activeStores.length === 0) {
            Utils.showToast('Chưa có heatmap nào được hiển thị', 'warning');
            return;
        }

        // Prepare export data
        const exportData = {
            generatedAt: new Date().toISOString(),
            filters: this.filters.getActiveFilters(),
            stores: activeStores.map(storeId => {
                const store = this.stores.getStoreById(storeId);
                const orders = ORDERS_DATA.filter(o => o.storeId === storeId);
                return {
                    ...store,
                    orderCount: orders.length,
                    totalRevenue: orders.reduce((sum, o) => sum + o.orderValue, 0)
                };
            }),
            summary: {
                totalStores: activeStores.length,
                totalOrders: ORDERS_DATA.filter(o => activeStores.includes(o.storeId)).length
            }
        };

        // Download as JSON
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `erablue-heatmap-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        Utils.showToast('Đã xuất báo cáo thành công!', 'success');
    },

    // Get selected competitor brands from checkboxes
    getSelectedCompetitorBrands() {
        const brands = [];
        document.querySelectorAll('.competitor-brands-filter input:checked').forEach(cb => {
            brands.push(cb.value);
        });
        return brands;
    },

    // Update competitor UI with data
    updateCompetitorUI() {
        // Update competitor count
        const countEl = document.getElementById('competitor-count');
        if (countEl && typeof COMPETITORS_DATA !== 'undefined') {
            countEl.textContent = COMPETITORS_DATA.length;
        }

        // Update sync time
        const syncEl = document.getElementById('competitor-sync-time');
        if (syncEl && typeof COMPETITOR_SYNC !== 'undefined') {
            const syncDate = new Date(COMPETITOR_SYNC.lastUpdate);
            const formattedDate = syncDate.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
            syncEl.textContent = `Cập nhật: ${formattedDate}`;
        }
    },

    // ===== BUSINESS INTELLIGENCE REPORT DISPLAYS =====

    // Show Market Share Report
    showMarketShareReport(data) {
        const reportEl = document.getElementById('strategic-report') || document.getElementById('gap-report');
        if (!reportEl) return;

        reportEl.innerHTML = `
            <div class="bi-report market-share">
                <h5>📈 Market Share Analysis</h5>
                <div class="market-share-bars">
                    <div class="share-bar">
                        <span class="share-label">Erablue</span>
                        <div class="bar-track"><div class="bar-fill erablue" style="width: ${data.erablueShare}%"></div></div>
                        <span class="share-value">${data.erablueShare}%</span>
                    </div>
                    <div class="share-bar">
                        <span class="share-label">Competitors</span>
                        <div class="bar-track"><div class="bar-fill competitor" style="width: ${data.competitorShare}%"></div></div>
                        <span class="share-value">${data.competitorShare}%</span>
                    </div>
                    <div class="share-bar">
                        <span class="share-label">Contested</span>
                        <div class="bar-track"><div class="bar-fill contested" style="width: ${data.contestedShare}%"></div></div>
                        <span class="share-value">${data.contestedShare}%</span>
                    </div>
                    <div class="share-bar">
                        <span class="share-label">Whitespace</span>
                        <div class="bar-track"><div class="bar-fill whitespace" style="width: ${data.uncoveredShare}%"></div></div>
                        <span class="share-value">${data.uncoveredShare}%</span>
                    </div>
                </div>
            </div>
        `;
        reportEl.classList.remove('hidden');
        Utils.showToast('Market share analysis complete', 'success');
    },

    // Show Threat Score Report
    showThreatReport(threats) {
        const reportEl = document.getElementById('strategic-report') || document.getElementById('gap-report');
        if (!reportEl) return;

        const criticalCount = threats.filter(t => t.threatLevel === 'critical').length;
        const highCount = threats.filter(t => t.threatLevel === 'high').length;
        const top3 = threats.slice(0, 3);

        reportEl.innerHTML = `
            <div class="bi-report threat-report">
                <h5>⚠️ Competitor Threat Assessment</h5>
                <div class="threat-summary">
                    <div class="threat-stat critical">
                        <span class="stat-value">${criticalCount}</span>
                        <span class="stat-label">Critical</span>
                    </div>
                    <div class="threat-stat high">
                        <span class="stat-value">${highCount}</span>
                        <span class="stat-label">High</span>
                    </div>
                    <div class="threat-stat total">
                        <span class="stat-value">${threats.length}</span>
                        <span class="stat-label">Total</span>
                    </div>
                </div>
                <div class="top-threats">
                    <small>Top threats:</small>
                    ${top3.map((t, i) => `
                        <div class="threat-item ${t.threatLevel}">
                            <span class="rank">#${i + 1}</span>
                            <span class="name">${t.competitor.name}</span>
                            <span class="score">${t.threatScore}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        reportEl.classList.remove('hidden');
        Utils.showToast(`Identified ${criticalCount} critical threats`, criticalCount > 0 ? 'warning' : 'success');
    },

    // Show Expansion Priority Report
    showExpansionReport(priorities) {
        const reportEl = document.getElementById('strategic-report') || document.getElementById('gap-report');
        if (!reportEl) return;

        const priorityA = priorities.filter(p => p.priority === 'A').length;
        const priorityB = priorities.filter(p => p.priority === 'B').length;

        reportEl.innerHTML = `
            <div class="bi-report expansion-report">
                <h5>🎯 Expansion Priority Matrix</h5>
                <div class="expansion-summary">
                    <div class="priority-stat a">
                        <span class="stat-value">${priorityA}</span>
                        <span class="stat-label">Priority A</span>
                    </div>
                    <div class="priority-stat b">
                        <span class="stat-value">${priorityB}</span>
                        <span class="stat-label">Priority B</span>
                    </div>
                </div>
                <p class="report-note">
                    ${priorityA > 0 ? `Found ${priorityA} high-priority locations for expansion` : 'Zoom to different area for analysis'}
                </p>
            </div>
        `;
        reportEl.classList.remove('hidden');
        Utils.showToast(`Found ${priorities.length} potential expansion zones`, 'success');
    },

    // Show Revenue Zones Report
    showRevenueReport(zones) {
        const reportEl = document.getElementById('strategic-report') || document.getElementById('gap-report');
        if (!reportEl) return;

        reportEl.innerHTML = `
            <div class="bi-report revenue-report">
                <h5>💰 Revenue Opportunity Zones</h5>
                <div class="revenue-summary">
                    <div class="revenue-stat">
                        <span class="stat-value">${zones.length}</span>
                        <span class="stat-label">High-value zones</span>
                    </div>
                </div>
                ${zones.length > 0 ? `
                    <p class="report-note">Top zone: ${zones[0].orderCount} orders, avg ${(zones[0].avgOrderValue / 1000).toFixed(0)}K</p>
                ` : '<p class="report-note">Zoom in for detailed zone analysis</p>'}
            </div>
        `;
        reportEl.classList.remove('hidden');
        Utils.showToast(`Identified ${zones.length} revenue opportunity zones`, 'success');
    }
};

// Make App globally accessible
window.App = App;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
