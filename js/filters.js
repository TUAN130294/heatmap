// ===== FILTERS MANAGER =====

class FiltersManager {
    constructor() {
        this.activeFilters = {
            city: null,
            districts: [],
            dateFrom: null,
            dateTo: null,
            stores: []
        };
        this.selectedStores = new Set();
    }

    init() {
        this.populateCities();
        this.populateStoreList();
        this.bindEvents();
        this.setDefaultDates();

        console.log('Filters initialized');
    }

    populateCities() {
        const select = document.getElementById('city-filter');
        select.innerHTML = '<option value="">-- Tất cả thành phố --</option>';

        CITIES_DATA.forEach(city => {
            const option = document.createElement('option');
            option.value = city.code;
            option.textContent = city.name;
            select.appendChild(option);
        });
    }

    populateDistricts(cityCode) {
        const container = document.getElementById('district-filter');

        if (!cityCode) {
            container.innerHTML = '<p class="placeholder-text">Chọn thành phố trước</p>';
            return;
        }

        const city = CITIES_DATA.find(c => c.code === cityCode);
        if (!city) return;

        container.innerHTML = '';
        city.districts.forEach(district => {
            const item = document.createElement('label');
            item.className = 'checkbox-item';
            item.innerHTML = `
                <input type="checkbox" value="${district.code}" data-district>
                <span>${district.name}</span>
            `;
            container.appendChild(item);
        });

        // Bind district checkbox events
        container.querySelectorAll('input[data-district]').forEach(cb => {
            cb.addEventListener('change', () => this.onDistrictChange());
        });
    }

    populateStoreList() {
        const container = document.getElementById('store-list');
        const stores = window.App.stores.getAllStores();
        const colorMap = window.App.stores.colorMap;

        container.innerHTML = '';
        stores.forEach(store => {
            const color = colorMap.get(store.id);
            const item = document.createElement('label');
            item.className = 'store-item';
            item.dataset.storeId = store.id;
            item.innerHTML = `
                <input type="checkbox" value="${store.id}" data-store>
                <span class="store-color" style="background-color: ${color}"></span>
                <span class="store-name">${store.name}</span>
                <span class="store-orders">${store.totalOrders}</span>
            `;
            container.appendChild(item);
        });

        // Update store count
        document.getElementById('store-count').textContent = stores.length;

        // Bind events
        container.querySelectorAll('input[data-store]').forEach(cb => {
            cb.addEventListener('change', (e) => this.onStoreSelect(e));
        });
    }

    setDefaultDates() {
        const today = new Date();
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        document.getElementById('date-from').value = threeMonthsAgo.toISOString().split('T')[0];
        document.getElementById('date-to').value = today.toISOString().split('T')[0];
    }

    bindEvents() {
        // City filter
        document.getElementById('city-filter').addEventListener('change', (e) => {
            this.activeFilters.city = e.target.value || null;
            this.populateDistricts(e.target.value);
            this.filterStoreList();

            if (e.target.value) {
                window.App.map.flyToCity(e.target.value);
            }
        });

        // Date inputs
        document.getElementById('date-from').addEventListener('change', (e) => {
            this.activeFilters.dateFrom = e.target.value || null;
        });

        document.getElementById('date-to').addEventListener('change', (e) => {
            this.activeFilters.dateTo = e.target.value || null;
        });

        // Quick date buttons
        document.querySelectorAll('.quick-date-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.quick-date-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                const range = e.target.dataset.range;
                if (range === 'all') {
                    this.setDefaultDates();
                } else {
                    const { from, to } = Utils.getDateRange(parseInt(range));
                    document.getElementById('date-from').value = from;
                    document.getElementById('date-to').value = to;
                    this.activeFilters.dateFrom = from;
                    this.activeFilters.dateTo = to;
                }
            });
        });

        // Intensity slider (debounced for performance)
        const intensitySlider = document.getElementById('intensity-slider');
        const intensityValue = document.getElementById('intensity-value');
        const debouncedIntensity = Utils.debounce((val) => {
            window.App.heatmap.updateRadius(val);
        }, 150);
        intensitySlider.addEventListener('input', (e) => {
            intensityValue.textContent = e.target.value;
            debouncedIntensity(parseInt(e.target.value));
        });

        // Radius slider (debounced for performance)
        const radiusSlider = document.getElementById('radius-slider');
        const radiusValue = document.getElementById('radius-value');
        const debouncedRadius = Utils.debounce((val) => {
            window.App.heatmap.updateBlur(val);
        }, 150);
        radiusSlider.addEventListener('input', (e) => {
            radiusValue.textContent = e.target.value;
            debouncedRadius(parseInt(e.target.value));
        });

        // Select/Deselect all stores
        document.getElementById('btn-select-all').addEventListener('click', () => {
            this.selectAllStores();
        });

        document.getElementById('btn-deselect-all').addEventListener('click', () => {
            this.deselectAllStores();
        });

        // Apply filter button
        document.getElementById('btn-apply-filter').addEventListener('click', () => {
            this.applyFilters();
        });

        // Clear heatmap button
        document.getElementById('btn-clear-heatmap').addEventListener('click', () => {
            this.clearHeatmaps();
        });

        // Reset filters
        document.getElementById('btn-reset-filters').addEventListener('click', () => {
            this.resetFilters();
        });
    }

    onDistrictChange() {
        const checked = document.querySelectorAll('#district-filter input:checked');
        this.activeFilters.districts = [...checked].map(cb => cb.value);
        this.filterStoreList();
    }

    onStoreSelect(e) {
        const storeId = e.target.value;
        const item = e.target.closest('.store-item');

        if (e.target.checked) {
            this.selectedStores.add(storeId);
            item.classList.add('selected');
        } else {
            this.selectedStores.delete(storeId);
            item.classList.remove('selected');
        }
    }

    filterStoreList() {
        const stores = window.App.stores.getAllStores();
        const container = document.getElementById('store-list');

        stores.forEach(store => {
            const item = container.querySelector(`[data-store-id="${store.id}"]`);
            if (!item) return;

            let visible = true;

            // Filter by city
            if (this.activeFilters.city && store.city !== this.activeFilters.city) {
                visible = false;
            }

            // Filter by district
            if (this.activeFilters.districts.length > 0 &&
                !this.activeFilters.districts.includes(store.district)) {
                visible = false;
            }

            item.style.display = visible ? 'flex' : 'none';
        });
    }

    selectAllStores() {
        const checkboxes = document.querySelectorAll('#store-list input[data-store]:not([style*="display: none"])');
        checkboxes.forEach(cb => {
            if (cb.closest('.store-item').style.display !== 'none') {
                cb.checked = true;
                this.selectedStores.add(cb.value);
                cb.closest('.store-item').classList.add('selected');
            }
        });
    }

    deselectAllStores() {
        const checkboxes = document.querySelectorAll('#store-list input[data-store]');
        checkboxes.forEach(cb => {
            cb.checked = false;
            cb.closest('.store-item').classList.remove('selected');
        });
        this.selectedStores.clear();
    }

    applyFilters() {
        if (this.selectedStores.size === 0) {
            Utils.showToast('Vui lòng chọn ít nhất 1 siêu thị', 'warning');
            return;
        }

        // Performance warning for many stores
        if (this.selectedStores.size > 10) {
            Utils.showToast(`Đang tải ${this.selectedStores.size} heatmap, có thể mất vài giây...`, 'info');
        }

        // Show loading
        window.App.showLoading(true);

        // Update active filters
        this.activeFilters.stores = [...this.selectedStores];
        this.activeFilters.dateFrom = document.getElementById('date-from').value;
        this.activeFilters.dateTo = document.getElementById('date-to').value;

        // Clear cache for fresh data
        window.App.heatmap.clearCache();

        // Use requestAnimationFrame to allow UI update
        requestAnimationFrame(() => {
            // Show heatmaps
            const colorMap = window.App.stores.colorMap;
            window.App.heatmap.clearAllHeatmaps();
            window.App.heatmap.showMultipleHeatmaps(this.activeFilters.stores, colorMap);

            // Update analytics
            window.App.analytics.updateStats();

            // Hide loading after short delay
            setTimeout(() => {
                window.App.showLoading(false);
                Utils.showToast(`Đã hiển thị ${this.selectedStores.size} heatmap`, 'success');
            }, 300);
        });
    }

    clearHeatmaps() {
        window.App.heatmap.clearAllHeatmaps();
        Utils.showToast('Đã xóa tất cả heatmap', 'info');
    }

    resetFilters() {
        // Reset city
        document.getElementById('city-filter').value = '';
        this.activeFilters.city = null;

        // Reset districts
        document.getElementById('district-filter').innerHTML =
            '<p class="placeholder-text">Chọn thành phố trước</p>';
        this.activeFilters.districts = [];

        // Reset dates
        this.setDefaultDates();
        document.querySelectorAll('.quick-date-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.quick-date-btn[data-range="all"]').classList.add('active');

        // Reset sliders
        document.getElementById('intensity-slider').value = 25;
        document.getElementById('intensity-value').textContent = '25';
        document.getElementById('radius-slider').value = 20;
        document.getElementById('radius-value').textContent = '20';

        // Deselect stores
        this.deselectAllStores();

        // Repopulate store list
        this.populateStoreList();

        // Clear heatmaps
        window.App.heatmap.clearAllHeatmaps();

        // Reset map view
        window.App.map.flyToCenter();

        Utils.showToast('Đã reset bộ lọc', 'info');
    }

    getActiveFilters() {
        return { ...this.activeFilters };
    }
}

window.FiltersManager = FiltersManager;
