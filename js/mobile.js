// ===== MOBILE UI MANAGER =====

class MobileManager {
    constructor() {
        this.bottomSheet = null;
        this.isSheetExpanded = false;
        this.activeTab = 'filters';
        this.selectedStores = new Set();
        this.touchStartY = 0;
        this.isMobile = window.innerWidth <= 768;
    }

    init() {
        if (!this.isMobile) return;

        this.bottomSheet = document.getElementById('mobile-bottom-sheet');

        this.bindNavigation();
        this.bindBottomSheet();
        this.bindQuickActions();
        this.bindFABs();
        this.bindSheetControls();
        this.populateMobileStores();
        this.populateMobileCities();
        this.updateMobileStats();

        // Handle resize
        window.addEventListener('resize', Utils.debounce(() => {
            this.isMobile = window.innerWidth <= 768;
        }, 250));

        console.log('📱 Mobile UI initialized');
    }

    // ===== NAVIGATION =====
    bindNavigation() {
        const navItems = document.querySelectorAll('.mobile-nav-item');

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remove active from all
                navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                const navId = item.id;
                this.handleNavigation(navId);
            });
        });
    }

    handleNavigation(navId) {
        switch (navId) {
            case 'nav-map':
                this.collapseSheet();
                Utils.showToast('🗺️ Chế độ bản đồ', 'info');
                break;
            case 'nav-stores':
                this.activeTab = 'stores';
                this.switchSheetTab('stores');
                this.expandSheet();
                break;
            case 'nav-analytics':
                this.showMobileAnalytics();
                break;
            case 'nav-settings':
                Utils.showToast('⚙️ Cài đặt sẽ có trong phiên bản tiếp theo', 'info');
                break;
        }
    }

    // ===== BOTTOM SHEET =====
    bindBottomSheet() {
        const handleArea = document.getElementById('sheet-handle-area');
        const closeBtn = document.getElementById('btn-sheet-close');

        // Drag to expand/collapse
        handleArea.addEventListener('touchstart', (e) => {
            this.touchStartY = e.touches[0].clientY;
        });

        handleArea.addEventListener('touchmove', (e) => {
            const touchY = e.touches[0].clientY;
            const diff = this.touchStartY - touchY;

            if (diff > 50 && !this.isSheetExpanded) {
                this.expandSheet();
            } else if (diff < -50 && this.isSheetExpanded) {
                this.collapseSheet();
            }
        });

        // Click to toggle
        handleArea.addEventListener('click', () => {
            this.toggleSheet();
        });

        // Close button
        closeBtn.addEventListener('click', () => {
            this.collapseSheet();
        });

        // Tab switching
        document.querySelectorAll('.sheet-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                this.switchSheetTab(tabName);
            });
        });
    }

    expandSheet() {
        this.bottomSheet.classList.add('expanded');
        this.isSheetExpanded = true;
    }

    collapseSheet() {
        this.bottomSheet.classList.remove('expanded');
        this.isSheetExpanded = false;
    }

    toggleSheet() {
        if (this.isSheetExpanded) {
            this.collapseSheet();
        } else {
            this.expandSheet();
        }
    }

    switchSheetTab(tabName) {
        // Update tabs
        document.querySelectorAll('.sheet-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Update panels
        document.querySelectorAll('.sheet-panel').forEach(panel => {
            panel.style.display = 'none';
        });

        const activePanel = document.getElementById(`sheet-${tabName}`);
        if (activePanel) {
            activePanel.style.display = 'block';
        }

        this.activeTab = tabName;
    }

    // ===== QUICK ACTIONS =====
    bindQuickActions() {
        document.getElementById('chip-heatmap')?.addEventListener('click', () => {
            this.showAllHeatmaps();
        });

        document.getElementById('chip-gaps')?.addEventListener('click', () => {
            this.findGaps();
        });

        document.getElementById('chip-coverage')?.addEventListener('click', () => {
            this.showCoverage();
        });

        document.getElementById('chip-clear')?.addEventListener('click', () => {
            this.clearAll();
        });
    }

    // ===== FABs =====
    bindFABs() {
        document.getElementById('fab-heatmap')?.addEventListener('click', () => {
            this.showAllHeatmaps();
        });

        document.getElementById('fab-gaps')?.addEventListener('click', () => {
            this.findGaps();
        });
    }

    // ===== SHEET CONTROLS =====
    bindSheetControls() {
        // City filter
        document.getElementById('mobile-city-filter')?.addEventListener('change', (e) => {
            const cityCode = e.target.value;
            if (cityCode) {
                window.App.map.flyToCity(cityCode);
            }
            this.filterMobileStores(cityCode);
        });

        // Intensity slider
        const intensitySlider = document.getElementById('mobile-intensity');
        const intensityValue = document.getElementById('mobile-intensity-value');
        intensitySlider?.addEventListener('input', (e) => {
            intensityValue.textContent = e.target.value;
            window.App.heatmap.updateRadius(parseInt(e.target.value));
        });

        // Coverage radius slider
        const radiusSlider = document.getElementById('mobile-coverage-radius');
        const radiusValue = document.getElementById('mobile-radius-value');
        radiusSlider?.addEventListener('input', (e) => {
            radiusValue.textContent = e.target.value + ' km';
        });

        // Select/Deselect all
        document.getElementById('mobile-select-all')?.addEventListener('click', () => {
            this.selectAllMobileStores();
        });

        document.getElementById('mobile-deselect-all')?.addEventListener('click', () => {
            this.deselectAllMobileStores();
        });

        // Coverage button
        document.getElementById('mobile-show-coverage')?.addEventListener('click', () => {
            this.showCoverage();
        });

        // Find gaps button
        document.getElementById('mobile-find-gaps')?.addEventListener('click', () => {
            this.findGaps();
        });
    }

    // ===== POPULATE DATA =====
    populateMobileCities() {
        const select = document.getElementById('mobile-city-filter');
        if (!select) return;

        CITIES_DATA.forEach(city => {
            const option = document.createElement('option');
            option.value = city.code;
            option.textContent = city.name;
            select.appendChild(option);
        });
    }

    populateMobileStores() {
        const container = document.getElementById('mobile-store-list');
        if (!container) return;

        const stores = window.App?.stores?.getAllStores() || STORES_DATA;
        const colorMap = window.App?.stores?.colorMap || new Map();

        container.innerHTML = '';
        stores.forEach(store => {
            const color = colorMap.get(store.id) || '#00d4ff';
            const item = document.createElement('label');
            item.className = 'store-item';
            item.dataset.storeId = store.id;
            item.dataset.city = store.city;
            item.innerHTML = `
                <input type="checkbox" value="${store.id}" data-mobile-store>
                <span class="store-color" style="background-color: ${color}"></span>
                <span class="store-name">${store.name}</span>
                <span class="store-orders">${store.totalOrders || 0}</span>
            `;
            container.appendChild(item);

            // Bind event
            item.querySelector('input').addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.selectedStores.add(store.id);
                    item.classList.add('selected');
                } else {
                    this.selectedStores.delete(store.id);
                    item.classList.remove('selected');
                }
            });
        });
    }

    filterMobileStores(cityCode) {
        const container = document.getElementById('mobile-store-list');
        if (!container) return;

        container.querySelectorAll('.store-item').forEach(item => {
            if (!cityCode || item.dataset.city === cityCode) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    selectAllMobileStores() {
        document.querySelectorAll('#mobile-store-list input[data-mobile-store]').forEach(cb => {
            const item = cb.closest('.store-item');
            if (item.style.display !== 'none') {
                cb.checked = true;
                this.selectedStores.add(cb.value);
                item.classList.add('selected');
            }
        });
        Utils.showToast(`Đã chọn ${this.selectedStores.size} siêu thị`, 'success');
    }

    deselectAllMobileStores() {
        document.querySelectorAll('#mobile-store-list input[data-mobile-store]').forEach(cb => {
            cb.checked = false;
            cb.closest('.store-item').classList.remove('selected');
        });
        this.selectedStores.clear();
    }

    // ===== ACTIONS =====
    showAllHeatmaps() {
        if (this.selectedStores.size === 0) {
            // Select all if none selected
            this.selectAllMobileStores();
        }

        window.App.showLoading(true);

        setTimeout(() => {
            const colorMap = window.App.stores.colorMap;
            window.App.heatmap.clearAllHeatmaps();
            window.App.heatmap.showMultipleHeatmaps([...this.selectedStores], colorMap);
            window.App.showLoading(false);
            Utils.showToast(`🔥 Đang hiển thị ${this.selectedStores.size} heatmap`, 'success');
            this.collapseSheet();
        }, 100);
    }

    showCoverage() {
        const radius = parseInt(document.getElementById('mobile-coverage-radius')?.value || 5);
        window.App.coverage.showCoverageRadius(null, radius);
        this.collapseSheet();
    }

    findGaps() {
        const radius = parseInt(document.getElementById('mobile-coverage-radius')?.value || 5);

        window.App.showLoading(true);

        setTimeout(() => {
            window.App.coverage.analyzeGaps(radius);
            window.App.showLoading(false);
            this.collapseSheet();
        }, 100);
    }

    clearAll() {
        window.App.heatmap.clearAllHeatmaps();
        window.App.coverage.clearAll();
        Utils.showToast('🧹 Đã xóa tất cả layers', 'info');
    }

    // ===== STATS =====
    updateMobileStats() {
        const stores = STORES_DATA.length;
        const orders = ORDERS_DATA.length;
        const avgDistance = Utils.calculateAverageDistance();

        document.getElementById('mobile-stat-stores').textContent = stores;
        document.getElementById('mobile-stat-orders').textContent =
            orders >= 1000 ? (orders / 1000).toFixed(1) + 'K' : orders;
        document.getElementById('mobile-stat-distance').textContent = avgDistance.toFixed(1);
    }

    showMobileAnalytics() {
        // Create analytics modal
        const activeStores = window.App.heatmap.getActiveStores();
        const totalOrders = ORDERS_DATA.filter(o =>
            activeStores.length === 0 || activeStores.includes(o.storeId)
        ).length;

        const content = `
            <div style="padding: 20px;">
                <h3 style="margin-bottom: 16px;">📊 Thống kê nhanh</h3>
                <div class="stats-overview" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div class="stat-card">
                        <div class="stat-icon">🏪</div>
                        <div class="stat-info">
                            <span class="stat-value">${STORES_DATA.length}</span>
                            <span class="stat-label">Siêu thị</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📦</div>
                        <div class="stat-info">
                            <span class="stat-value">${totalOrders.toLocaleString()}</span>
                            <span class="stat-label">Đơn hàng</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🎯</div>
                        <div class="stat-info">
                            <span class="stat-value">${activeStores.length}</span>
                            <span class="stat-label">Active</span>
                        </div>
                    </div>
                    <div class="stat-card highlight">
                        <div class="stat-icon">📏</div>
                        <div class="stat-info">
                            <span class="stat-value">${Utils.calculateAverageDistance().toFixed(1)}</span>
                            <span class="stat-label">KM TB</span>
                        </div>
                    </div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" 
                        class="btn-primary" style="width: 100%; margin-top: 20px;">
                    Đóng
                </button>
            </div>
        `;

        // Create modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.8);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;
        modal.innerHTML = `
            <div style="background: var(--bg-secondary); border-radius: 16px; max-width: 400px; width: 100%;">
                ${content}
            </div>
        `;
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        document.body.appendChild(modal);
    }
}

// Utils extension
if (typeof Utils !== 'undefined') {
    Utils.calculateAverageDistance = function () {
        if (ORDERS_DATA.length === 0) return 0;
        const total = ORDERS_DATA.reduce((sum, order) => sum + (order.distance || 0), 0);
        return total / ORDERS_DATA.length;
    };
}

// Export
window.MobileManager = MobileManager;
