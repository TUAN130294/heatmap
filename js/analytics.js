// ===== ANALYTICS MANAGER =====

class AnalyticsManager {
    constructor() {
        this.currentStore = null;
    }

    init() {
        this.updateStats();
        this.updateTopStores();
        this.updateDistanceChart();

        console.log('Analytics initialized');
    }

    updateStats() {
        const filteredOrders = this.getFilteredOrders();
        const filteredStores = this.getFilteredStores();

        // Total stores
        document.getElementById('stat-stores').textContent = filteredStores.length;

        // Total orders
        document.getElementById('stat-orders').textContent =
            Utils.formatNumber(filteredOrders.length);

        // Total revenue
        const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.orderValue, 0);
        document.getElementById('stat-revenue').textContent =
            Utils.formatCurrency(totalRevenue);

        // Average distance
        if (filteredOrders.length > 0) {
            const avgDist = filteredOrders.reduce((sum, o) => sum + o.distance, 0) / filteredOrders.length;
            document.getElementById('stat-avg-distance').textContent = avgDist.toFixed(1);
        } else {
            document.getElementById('stat-avg-distance').textContent = '0';
        }

        // Update charts
        this.updateTopStores(filteredStores);
        this.updateDistanceChart(filteredOrders);
    }

    getFilteredOrders() {
        const filters = window.App.filters?.getActiveFilters() || {};

        return ORDERS_DATA.filter(order => {
            // Filter by selected stores
            if (filters.stores?.length > 0 && !filters.stores.includes(order.storeId)) {
                return false;
            }

            // Filter by date
            if (filters.dateFrom && order.orderDate < filters.dateFrom) return false;
            if (filters.dateTo && order.orderDate > filters.dateTo) return false;

            return true;
        });
    }

    getFilteredStores() {
        const filters = window.App.filters?.getActiveFilters() || {};
        let stores = window.App.stores?.getAllStores() || [];

        if (filters.city) {
            stores = stores.filter(s => s.city === filters.city);
        }

        if (filters.districts?.length > 0) {
            stores = stores.filter(s => filters.districts.includes(s.district));
        }

        return stores;
    }

    updateTopStores(stores = null) {
        const container = document.getElementById('top-stores');
        const topStores = (stores || window.App.stores?.getAllStores() || [])
            .sort((a, b) => b.totalOrders - a.totalOrders)
            .slice(0, 5);

        container.innerHTML = topStores.map((store, index) => {
            let rankClass = '';
            if (index === 0) rankClass = 'gold';
            else if (index === 1) rankClass = 'silver';
            else if (index === 2) rankClass = 'bronze';

            return `
                <div class="top-store-item" onclick="window.App.showStoreHeatmap('${store.id}')">
                    <span class="top-store-rank ${rankClass}">${index + 1}</span>
                    <span class="top-store-color" style="background-color: ${store.colorCode}"></span>
                    <div class="top-store-info">
                        <div class="top-store-name">${store.name}</div>
                        <div class="top-store-value">${Utils.formatNumber(store.totalOrders)} đơn</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateDistanceChart(orders = null) {
        const data = orders || ORDERS_DATA;
        const total = data.length;

        if (total === 0) return;

        // Calculate distance distribution
        const dist0_3 = data.filter(o => o.distance <= 3).length;
        const dist3_5 = data.filter(o => o.distance > 3 && o.distance <= 5).length;
        const dist5_10 = data.filter(o => o.distance > 5 && o.distance <= 10).length;
        const dist10plus = data.filter(o => o.distance > 10).length;

        const percentages = {
            '0-3km': Math.round(dist0_3 / total * 100),
            '3-5km': Math.round(dist3_5 / total * 100),
            '5-10km': Math.round(dist5_10 / total * 100),
            '10km+': Math.round(dist10plus / total * 100)
        };

        // Update chart bars
        document.querySelectorAll('.chart-bar').forEach(bar => {
            const range = bar.dataset.range;
            const pct = percentages[range] || 0;
            bar.querySelector('.bar-fill').style.setProperty('--percentage', `${pct}%`);
            bar.querySelector('.bar-value').textContent = `${pct}%`;
        });
    }

    showStoreDetails(store) {
        this.currentStore = store;

        const container = document.getElementById('store-details');
        const content = document.getElementById('store-details-content');

        // Get store orders
        const orders = ORDERS_DATA.filter(o => o.storeId === store.id);

        // Calculate top areas
        const districtCounts = {};
        orders.forEach(o => {
            // Use approximate district based on position
            const key = this.getApproxArea(o.customerLat, o.customerLng);
            districtCounts[key] = (districtCounts[key] || 0) + 1;
        });

        const topAreas = Object.entries(districtCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        content.innerHTML = `
            <div class="detail-header" style="border-left: 4px solid ${store.colorCode}; padding-left: 12px; margin-bottom: 12px;">
                <h4 style="margin: 0; font-size: 14px;">${store.name}</h4>
                <p style="margin: 4px 0 0; font-size: 12px; color: var(--text-secondary);">${store.address}</p>
            </div>
            
            <div class="detail-stats" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
                <div style="background: var(--bg-glass-light); padding: 8px; border-radius: 6px; text-align: center;">
                    <div style="font-size: 16px; font-weight: 700;">${Utils.formatNumber(store.totalOrders)}</div>
                    <div style="font-size: 10px; color: var(--text-tertiary);">Tổng đơn</div>
                </div>
                <div style="background: var(--bg-glass-light); padding: 8px; border-radius: 6px; text-align: center;">
                    <div style="font-size: 16px; font-weight: 700;">${Utils.formatCurrency(store.totalRevenue)}</div>
                    <div style="font-size: 10px; color: var(--text-tertiary);">Doanh thu</div>
                </div>
            </div>
            
            <div class="top-areas">
                <h5 style="font-size: 12px; margin-bottom: 8px;">📍 Khu vực khách hàng chính:</h5>
                <ol style="margin: 0; padding-left: 20px; font-size: 12px; color: var(--text-secondary);">
                    ${topAreas.map(([area, count]) => `
                        <li style="margin-bottom: 4px;">${area} - <span style="color: var(--accent-primary)">${count} đơn</span></li>
                    `).join('')}
                </ol>
            </div>
        `;

        container.classList.remove('hidden');
    }

    getApproxArea(lat, lng) {
        // Simplified area detection based on coordinates
        if (lat > -6.15 && lng > 106.85) return 'Kelapa Gading';
        if (lat > -6.18 && lat < -6.15) return 'Sunter';
        if (lat < -6.25 && lng < 106.80) return 'Pondok Indah';
        if (lat < -6.24 && lng > 106.80) return 'Kemang';
        if (lat > -6.20 && lng < 106.82) return 'Menteng';
        if (lat > -6.20 && lng > 106.85) return 'Rawamangun';
        if (lng < 106.70) return 'Tangerang';
        if (lng > 106.95) return 'Bekasi';
        if (lat < -6.35) return 'Depok';
        return 'Jakarta Area';
    }

    hideStoreDetails() {
        document.getElementById('store-details').classList.add('hidden');
        this.currentStore = null;
    }
}

window.AnalyticsManager = AnalyticsManager;
