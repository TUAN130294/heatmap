// ===== ERABLUE HEATMAP - UTILITY FUNCTIONS =====

const Utils = {
    // Format number with thousand separators
    formatNumber(num) {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1) + 'B';
        }
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toLocaleString('id-ID');
    },

    // Format currency (Indonesian Rupiah)
    formatCurrency(amount) {
        if (amount >= 1000000000) {
            return 'Rp ' + (amount / 1000000000).toFixed(1) + 'B';
        }
        if (amount >= 1000000) {
            return 'Rp ' + (amount / 1000000).toFixed(1) + 'M';
        }
        return 'Rp ' + amount.toLocaleString('id-ID');
    },

    // Calculate distance between two points (Haversine formula)
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    },

    toRad(deg) {
        return deg * (Math.PI / 180);
    },

    // Generate random number in range
    random(min, max) {
        return Math.random() * (max - min) + min;
    },

    // Generate random integer
    randomInt(min, max) {
        return Math.floor(this.random(min, max + 1));
    },

    // Generate random point within radius of center
    randomPointInRadius(centerLat, centerLng, radiusKm) {
        const radiusInDegrees = radiusKm / 111.32;
        const u = Math.random();
        const v = Math.random();
        const w = radiusInDegrees * Math.sqrt(u);
        const t = 2 * Math.PI * v;
        const x = w * Math.cos(t);
        const y = w * Math.sin(t);

        // Adjust for latitude
        const newLat = centerLat + y;
        const newLng = centerLng + x / Math.cos(this.toRad(centerLat));

        return { lat: newLat, lng: newLng };
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function  
    throttle(func, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Show toast notification
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const icons = {
            success: '✓',
            error: '✗',
            warning: '⚠',
            info: 'ℹ'
        };

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${icons[type]}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()">×</button>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100px)';
            setTimeout(() => toast.remove(), 300);
        }, CONFIG.ui.toastDuration);
    },

    // Color manipulation
    hexToRgba(hex, alpha = 1) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },

    // Generate gradient for heatmap from base color
    generateHeatGradient(baseColor) {
        return {
            0.0: this.hexToRgba(baseColor, 0.0),
            0.2: this.hexToRgba(baseColor, 0.3),
            0.4: this.hexToRgba(baseColor, 0.5),
            0.6: this.hexToRgba(baseColor, 0.7),
            0.8: this.hexToRgba(baseColor, 0.85),
            1.0: baseColor
        };
    },

    // Graph coloring algorithm for nearby stores
    assignStoreColors(stores, distanceThreshold = 5) {
        const colorAssignments = new Map();
        const sortedStores = [...stores].sort((a, b) => a.id.localeCompare(b.id));

        for (const store of sortedStores) {
            const nearbyColors = new Set();

            // Find colors used by nearby stores
            for (const [storeId, color] of colorAssignments) {
                const otherStore = stores.find(s => s.id === storeId);
                const distance = this.calculateDistance(
                    store.latitude, store.longitude,
                    otherStore.latitude, otherStore.longitude
                );
                if (distance < distanceThreshold) {
                    nearbyColors.add(color);
                }
            }

            // Find first available color not used by nearby stores
            let assignedColor = CONFIG.storeColors[0];
            for (const color of CONFIG.storeColors) {
                if (!nearbyColors.has(color)) {
                    assignedColor = color;
                    break;
                }
            }

            colorAssignments.set(store.id, assignedColor);
        }

        return colorAssignments;
    },

    // Date formatting
    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    },

    // Get date range
    getDateRange(days) {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - days);
        return {
            from: start.toISOString().split('T')[0],
            to: end.toISOString().split('T')[0]
        };
    }
};
