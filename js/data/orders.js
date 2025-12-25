// ===== ORDERS DATA GENERATOR =====
// Generates ~8000 mockup orders for 25 stores

const ORDERS_DATA = (function () {
    const orders = [];
    let orderId = 1;

    // Jakarta street names for realistic addresses
    const streetNames = [
        'Jl. Sudirman', 'Jl. Thamrin', 'Jl. Gatot Subroto', 'Jl. Rasuna Said',
        'Jl. Kuningan', 'Jl. Casablanca', 'Jl. HR Rasuna Said', 'Jl. Satrio',
        'Jl. Tendean', 'Jl. Pramuka', 'Jl. Matraman', 'Jl. Salemba',
        'Jl. Diponegoro', 'Jl. Imam Bonjol', 'Jl. Wahid Hasyim', 'Jl. Hayam Wuruk',
        'Jl. Gajah Mada', 'Jl. Panglima Polim', 'Jl. Fatmawati', 'Jl. TB Simatupang',
        'Jl. Raya Bogor', 'Jl. Raya Bekasi', 'Jl. Daan Mogot', 'Jl. Panjang',
        'Jl. Kebon Jeruk', 'Jl. Kelapa Gading', 'Jl. Sunter', 'Jl. Pluit',
        'Jl. Pantai Indah', 'Jl. Cempaka Putih', 'Jl. Kemayoran', 'Jl. Cakung'
    ];

    // Generate orders for each store
    STORES_DATA.forEach(store => {
        // Random number of orders per store (200-500)
        const orderCount = 200 + Math.floor(Math.random() * 300);

        for (let i = 0; i < orderCount; i++) {
            // Distance distribution: 60% within 5km, 30% 5-10km, 10% 10-15km
            let maxRadius;
            const distRandom = Math.random();
            if (distRandom < 0.45) {
                maxRadius = 3;      // 45% very close
            } else if (distRandom < 0.75) {
                maxRadius = 5;      // 30% close
            } else if (distRandom < 0.92) {
                maxRadius = 10;     // 17% medium
            } else {
                maxRadius = 15;     // 8% far
            }

            // Generate random point
            const point = generateRandomPoint(
                store.latitude,
                store.longitude,
                0.5, // min radius
                maxRadius
            );

            // Calculate actual distance
            const distance = calculateDistance(
                store.latitude, store.longitude,
                point.lat, point.lng
            );

            // Random date in last 90 days
            const daysAgo = Math.floor(Math.random() * 90);
            const orderDate = new Date();
            orderDate.setDate(orderDate.getDate() - daysAgo);

            // Random order value (50,000 - 2,000,000 IDR)
            const orderValue = 50000 + Math.floor(Math.random() * 1950000);

            orders.push({
                id: `ORD-${String(orderId++).padStart(5, '0')}`,
                storeId: store.id,
                customerAddress: `${streetNames[Math.floor(Math.random() * streetNames.length)]} No. ${Math.floor(Math.random() * 200) + 1}`,
                customerLat: point.lat,
                customerLng: point.lng,
                orderDate: orderDate.toISOString().split('T')[0],
                orderValue: orderValue,
                distance: Math.round(distance * 10) / 10
            });
        }
    });

    // Helper functions
    function generateRandomPoint(centerLat, centerLng, minRadius, maxRadius) {
        const radiusKm = minRadius + Math.random() * (maxRadius - minRadius);
        const radiusInDegrees = radiusKm / 111.32;
        const angle = Math.random() * 2 * Math.PI;

        const deltaLat = radiusInDegrees * Math.cos(angle);
        const deltaLng = radiusInDegrees * Math.sin(angle) / Math.cos(centerLat * Math.PI / 180);

        return {
            lat: centerLat + deltaLat,
            lng: centerLng + deltaLng
        };
    }

    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    return orders;
})();

// Log generated orders count
console.log(`Generated ${ORDERS_DATA.length} orders for ${STORES_DATA.length} stores`);
