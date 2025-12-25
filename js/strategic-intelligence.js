// ===== STRATEGIC BUSINESS INTELLIGENCE MODULE =====
// Extended analytics for market analysis, competitor strategy, and expansion planning

class StrategicIntelligence {
    constructor() {
        this.marketData = null;
        this.competitorScore = {};
        this.expansionPriority = [];
        this.revenueOpportunities = [];
    }

    // ===== MARKET SHARE ANALYSIS =====
    // Estimate market share based on coverage and competitor density
    calculateMarketShare() {
        const bounds = window.App.map.getBounds();
        const gridSize = 0.01; // ~1km cells

        let totalCells = 0;
        let erablueDominant = 0;
        let competitorDominant = 0;
        let contested = 0;
        let uncovered = 0;

        for (let lat = bounds.getSouth(); lat <= bounds.getNorth(); lat += gridSize) {
            for (let lng = bounds.getWest(); lng <= bounds.getEast(); lng += gridSize) {
                totalCells++;

                // Calculate Erablue coverage score
                let erablueScore = 0;
                STORES_DATA.forEach(store => {
                    const dist = Utils.calculateDistance(lat, lng, store.latitude, store.longitude);
                    if (dist <= 5) erablueScore += (5 - dist) / 5;
                });

                // Calculate competitor coverage score
                let competitorScore = 0;
                if (typeof COMPETITORS_DATA !== 'undefined') {
                    COMPETITORS_DATA.forEach(comp => {
                        const dist = Utils.calculateDistance(lat, lng, comp.latitude, comp.longitude);
                        if (dist <= 5) competitorScore += (5 - dist) / 5;
                    });
                }

                // Classify cell
                if (erablueScore > 0.5 && competitorScore < 0.3) {
                    erablueDominant++;
                } else if (competitorScore > 0.5 && erablueScore < 0.3) {
                    competitorDominant++;
                } else if (erablueScore > 0.2 && competitorScore > 0.2) {
                    contested++;
                } else {
                    uncovered++;
                }
            }
        }

        this.marketData = {
            totalCells,
            erablueShare: ((erablueDominant / totalCells) * 100).toFixed(1),
            competitorShare: ((competitorDominant / totalCells) * 100).toFixed(1),
            contestedShare: ((contested / totalCells) * 100).toFixed(1),
            uncoveredShare: ((uncovered / totalCells) * 100).toFixed(1),
            erablueDominant,
            competitorDominant,
            contested,
            uncovered
        };

        return this.marketData;
    }

    // ===== COMPETITOR THREAT SCORING =====
    // Score each competitor location by threat level
    calculateCompetitorThreatScores() {
        if (typeof COMPETITORS_DATA === 'undefined') return [];

        const scores = [];

        COMPETITORS_DATA.forEach(comp => {
            // Find nearest Erablue store
            let minDistErablue = Infinity;
            let nearestErablue = null;
            STORES_DATA.forEach(store => {
                const dist = Utils.calculateDistance(
                    comp.latitude, comp.longitude,
                    store.latitude, store.longitude
                );
                if (dist < minDistErablue) {
                    minDistErablue = dist;
                    nearestErablue = store;
                }
            });

            // Count Erablue orders near this competitor
            const ordersNearby = ORDERS_DATA.filter(order => {
                const dist = Utils.calculateDistance(
                    comp.latitude, comp.longitude,
                    order.customerLat, order.customerLng
                );
                return dist <= 2; // Within 2km
            }).length;

            // Calculate threat score (0-100)
            let threatScore = 0;

            // Proximity factor (closer = higher threat)
            if (minDistErablue <= 1) threatScore += 40;
            else if (minDistErablue <= 2) threatScore += 30;
            else if (minDistErablue <= 3) threatScore += 20;
            else if (minDistErablue <= 5) threatScore += 10;

            // Brand strength factor
            const brandInfo = COMPETITOR_BRANDS[comp.brand];
            if (brandInfo?.threat === 'high') threatScore += 30;
            else if (brandInfo?.threat === 'medium') threatScore += 20;
            else threatScore += 10;

            // Low Erablue presence factor (fewer orders = higher threat)
            if (ordersNearby < 5) threatScore += 30;
            else if (ordersNearby < 15) threatScore += 20;
            else if (ordersNearby < 30) threatScore += 10;

            scores.push({
                competitor: comp,
                brand: brandInfo?.name || comp.brand,
                threatScore: Math.min(threatScore, 100),
                threatLevel: threatScore >= 70 ? 'critical' :
                    threatScore >= 50 ? 'high' :
                        threatScore >= 30 ? 'medium' : 'low',
                distanceToErablue: minDistErablue.toFixed(1),
                nearestErablue: nearestErablue?.name,
                ordersNearby,
                recommendation: this.getThreatRecommendation(threatScore, ordersNearby)
            });
        });

        // Sort by threat score descending
        scores.sort((a, b) => b.threatScore - a.threatScore);
        this.competitorScore = scores;

        return scores;
    }

    getThreatRecommendation(score, orders) {
        if (score >= 70 && orders < 10) {
            return 'URGENT: Intensive flyer campaign + promotional offers';
        } else if (score >= 50) {
            return 'HIGH: Regular marketing presence required';
        } else if (score >= 30) {
            return 'MEDIUM: Monitor and maintain visibility';
        } else {
            return 'LOW: Maintain current strategy';
        }
    }

    // ===== EXPANSION PRIORITY MATRIX =====
    // Identify best locations for new store opening
    calculateExpansionPriority(searchRadiusKm = 10) {
        const bounds = window.App.map.getBounds();
        const gridSize = 0.015; // ~1.5km cells

        const candidates = [];

        for (let lat = bounds.getSouth(); lat <= bounds.getNorth(); lat += gridSize) {
            for (let lng = bounds.getWest(); lng <= bounds.getEast(); lng += gridSize) {

                // Check distance to nearest Erablue
                let minDistErablue = Infinity;
                STORES_DATA.forEach(store => {
                    const dist = Utils.calculateDistance(lat, lng, store.latitude, store.longitude);
                    if (dist < minDistErablue) minDistErablue = dist;
                });

                // Skip if too close to existing store
                if (minDistErablue < 3) continue;

                // Count competitor density
                let competitorCount = 0;
                let nearestCompetitorDist = Infinity;
                if (typeof COMPETITORS_DATA !== 'undefined') {
                    COMPETITORS_DATA.forEach(comp => {
                        const dist = Utils.calculateDistance(lat, lng, comp.latitude, comp.longitude);
                        if (dist <= 3) competitorCount++;
                        if (dist < nearestCompetitorDist) nearestCompetitorDist = dist;
                    });
                }

                // Count potential customers (orders from neighboring areas)
                const potentialCustomers = ORDERS_DATA.filter(order => {
                    const dist = Utils.calculateDistance(lat, lng, order.customerLat, order.customerLng);
                    return dist <= 5;
                }).length;

                // Calculate expansion score
                let expansionScore = 0;

                // Distance from existing stores (further = more coverage expansion)
                if (minDistErablue >= 5) expansionScore += 25;
                else if (minDistErablue >= 4) expansionScore += 20;
                else if (minDistErablue >= 3) expansionScore += 15;

                // Competitor presence (more competitors = more market potential)
                if (competitorCount >= 3) expansionScore += 25;
                else if (competitorCount >= 2) expansionScore += 20;
                else if (competitorCount >= 1) expansionScore += 15;

                // Customer density (more nearby orders = proven demand)
                if (potentialCustomers >= 50) expansionScore += 30;
                else if (potentialCustomers >= 30) expansionScore += 25;
                else if (potentialCustomers >= 15) expansionScore += 15;
                else if (potentialCustomers >= 5) expansionScore += 10;

                // Strategic positioning (close to competitors but not too close)
                if (nearestCompetitorDist <= 2 && nearestCompetitorDist >= 0.5) {
                    expansionScore += 20;
                }

                if (expansionScore >= 40) {
                    candidates.push({
                        lat, lng,
                        expansionScore,
                        priority: expansionScore >= 70 ? 'A' :
                            expansionScore >= 55 ? 'B' : 'C',
                        distToNearestStore: minDistErablue.toFixed(1),
                        competitorCount,
                        potentialCustomers,
                        estimatedMonthlyRevenue: this.estimateRevenue(potentialCustomers),
                        recommendation: this.getExpansionRecommendation(expansionScore)
                    });
                }
            }
        }

        // Sort by score
        candidates.sort((a, b) => b.expansionScore - a.expansionScore);
        this.expansionPriority = candidates.slice(0, 30);

        return this.expansionPriority;
    }

    estimateRevenue(orderDensity) {
        // Estimate based on average order value and potential capture rate
        const avgOrderValue = 450000; // IDR
        const ordersPerCustomer = 2.5; // Monthly
        const captureRate = 0.3; // 30% of potential
        const estimatedMonthly = orderDensity * avgOrderValue * ordersPerCustomer * captureRate;
        return this.formatCurrency(estimatedMonthly);
    }

    getExpansionRecommendation(score) {
        if (score >= 70) return 'Priority A: Immediate expansion opportunity';
        if (score >= 55) return 'Priority B: Strong potential for Q2';
        return 'Priority C: Monitor for future consideration';
    }

    // ===== REVENUE OPPORTUNITY ZONES =====
    // Identify zones with high revenue potential based on order patterns
    calculateRevenueOpportunities() {
        const zones = [];
        const gridSize = 0.012;
        const bounds = window.App.map.getBounds();

        for (let lat = bounds.getSouth(); lat <= bounds.getNorth(); lat += gridSize) {
            for (let lng = bounds.getWest(); lng <= bounds.getEast(); lng += gridSize) {

                // Get orders in this zone
                const zoneOrders = ORDERS_DATA.filter(order => {
                    return order.customerLat >= lat && order.customerLat < lat + gridSize &&
                        order.customerLng >= lng && order.customerLng < lng + gridSize;
                });

                if (zoneOrders.length < 3) continue;

                // Calculate zone metrics
                const totalRevenue = zoneOrders.reduce((sum, o) => sum + o.orderValue, 0);
                const avgOrderValue = totalRevenue / zoneOrders.length;

                // Check coverage quality
                let nearestStoreDist = Infinity;
                STORES_DATA.forEach(store => {
                    const dist = Utils.calculateDistance(lat + gridSize / 2, lng + gridSize / 2,
                        store.latitude, store.longitude);
                    if (dist < nearestStoreDist) nearestStoreDist = dist;
                });

                // Revenue opportunity = high value + poor coverage
                const opportunityScore = (avgOrderValue / 100000) * (nearestStoreDist / 5);

                if (opportunityScore > 2) {
                    zones.push({
                        lat: lat + gridSize / 2,
                        lng: lng + gridSize / 2,
                        orderCount: zoneOrders.length,
                        totalRevenue,
                        avgOrderValue: Math.round(avgOrderValue),
                        distanceToStore: nearestStoreDist.toFixed(1),
                        opportunityScore: Math.round(opportunityScore * 10),
                        monthlyPotential: this.formatCurrency(totalRevenue * 4),
                        recommendation: opportunityScore > 5 ?
                            'High-value zone with poor coverage - prioritize' :
                            'Good revenue potential - maintain presence'
                    });
                }
            }
        }

        zones.sort((a, b) => b.opportunityScore - a.opportunityScore);
        this.revenueOpportunities = zones.slice(0, 20);
        return this.revenueOpportunities;
    }

    // ===== CUSTOMER ACQUISITION COST ANALYSIS =====
    // Estimate cost efficiency per zone
    calculateCACZones() {
        const zones = [];
        const gridSize = 0.015;
        const bounds = window.App.map.getBounds();

        // Assumed marketing cost per km² per month
        const baseCostPerKm2 = 5000000; // IDR

        for (let lat = bounds.getSouth(); lat <= bounds.getNorth(); lat += gridSize) {
            for (let lng = bounds.getWest(); lng <= bounds.getEast(); lng += gridSize) {

                const zoneOrders = ORDERS_DATA.filter(order => {
                    return order.customerLat >= lat && order.customerLat < lat + gridSize &&
                        order.customerLng >= lng && order.customerLng < lng + gridSize;
                });

                // Count competitors affecting CAC
                let competitorFactor = 1;
                if (typeof COMPETITORS_DATA !== 'undefined') {
                    COMPETITORS_DATA.forEach(comp => {
                        const dist = Utils.calculateDistance(lat, lng, comp.latitude, comp.longitude);
                        if (dist <= 2) competitorFactor += 0.3;
                    });
                }

                // Calculate CAC
                const area = gridSize * gridSize * 111 * 111; // km²
                const marketingCost = baseCostPerKm2 * area * competitorFactor;
                const newCustomersEstimate = Math.max(1, zoneOrders.length * 0.1);
                const cac = marketingCost / newCustomersEstimate;

                zones.push({
                    lat: lat + gridSize / 2,
                    lng: lng + gridSize / 2,
                    existingCustomers: zoneOrders.length,
                    competitorFactor: competitorFactor.toFixed(1),
                    estimatedCAC: this.formatCurrency(cac),
                    efficiency: cac < 500000 ? 'high' : cac < 1500000 ? 'medium' : 'low',
                    recommendation: cac < 500000 ?
                        'Cost-efficient zone - increase investment' :
                        cac < 1500000 ? 'Moderate CAC - optimize campaigns' :
                            'High CAC - reconsider strategy'
                });
            }
        }

        return zones.filter(z => z.existingCustomers > 0);
    }

    // ===== STRATEGIC DASHBOARD DATA =====
    getStrategicDashboard() {
        const marketShare = this.calculateMarketShare();
        const threatScores = this.calculateCompetitorThreatScores();
        const topThreats = threatScores.slice(0, 5);

        // Calculate key metrics
        const totalOrders = ORDERS_DATA.length;
        const totalRevenue = ORDERS_DATA.reduce((sum, o) => sum + o.orderValue, 0);
        const avgBasket = totalRevenue / totalOrders;

        // Competitor analysis
        const competitorCount = typeof COMPETITORS_DATA !== 'undefined' ? COMPETITORS_DATA.length : 0;
        const criticalThreats = threatScores.filter(t => t.threatLevel === 'critical').length;
        const highThreats = threatScores.filter(t => t.threatLevel === 'high').length;

        return {
            overview: {
                storeCount: STORES_DATA.length,
                orderCount: totalOrders,
                totalRevenue: this.formatCurrency(totalRevenue),
                avgBasketSize: this.formatCurrency(avgBasket),
                avgDeliveryDistance: this.calculateAvgDistance() + ' km'
            },
            marketPosition: {
                erablueShare: marketShare.erablueShare + '%',
                competitorShare: marketShare.competitorShare + '%',
                contested: marketShare.contestedShare + '%',
                whitespace: marketShare.uncoveredShare + '%'
            },
            competitorAnalysis: {
                totalCompetitors: competitorCount,
                criticalThreats,
                highThreats,
                topThreats: topThreats.map(t => ({
                    name: t.competitor.name,
                    brand: t.brand,
                    score: t.threatScore,
                    level: t.threatLevel
                }))
            },
            recommendations: this.generateStrategicRecommendations(marketShare, threatScores)
        };
    }

    calculateAvgDistance() {
        if (ORDERS_DATA.length === 0) return 0;
        const totalDist = ORDERS_DATA.reduce((sum, o) => sum + (o.distance || 0), 0);
        return (totalDist / ORDERS_DATA.length).toFixed(1);
    }

    generateStrategicRecommendations(marketShare, threats) {
        const recommendations = [];

        // Market share recommendations
        if (parseFloat(marketShare.competitorShare) > parseFloat(marketShare.erablueShare)) {
            recommendations.push({
                priority: 'CRITICAL',
                category: 'Market Share',
                action: 'Competitors dominate the area. Aggressive expansion and marketing required.',
                metric: `Competitor share: ${marketShare.competitorShare}% vs Erablue: ${marketShare.erablueShare}%`
            });
        }

        if (parseFloat(marketShare.uncoveredShare) > 30) {
            recommendations.push({
                priority: 'HIGH',
                category: 'Coverage Gap',
                action: 'Significant whitespace available. Consider new store locations.',
                metric: `Uncovered area: ${marketShare.uncoveredShare}%`
            });
        }

        if (parseFloat(marketShare.contestedShare) > 20) {
            recommendations.push({
                priority: 'MEDIUM',
                category: 'Competition',
                action: 'High competition zones identified. Focus on differentiation and loyalty programs.',
                metric: `Contested zones: ${marketShare.contestedShare}%`
            });
        }

        // Threat recommendations
        const criticalThreats = threats.filter(t => t.threatLevel === 'critical');
        if (criticalThreats.length > 0) {
            recommendations.push({
                priority: 'URGENT',
                category: 'Competitor Threat',
                action: `${criticalThreats.length} competitor location(s) require immediate response campaign.`,
                metric: `Top threat: ${criticalThreats[0].competitor.name}`
            });
        }

        return recommendations;
    }

    // ===== EXPORT COMPREHENSIVE REPORT =====
    exportFullReport() {
        const dashboard = this.getStrategicDashboard();
        const expansionPriority = this.calculateExpansionPriority();
        const revenueOpp = this.calculateRevenueOpportunities();

        const report = {
            reportType: 'Strategic Business Intelligence',
            generatedAt: new Date().toISOString(),
            company: 'Erablue',
            region: 'Jakarta Metropolitan Area',

            executiveSummary: dashboard,

            marketAnalysis: {
                marketShare: this.marketData,
                competitorAnalysis: this.competitorScore.slice(0, 15),
                competitorCount: typeof COMPETITORS_DATA !== 'undefined' ? COMPETITORS_DATA.length : 0,
                brandBreakdown: this.getCompetitorBrandBreakdown()
            },

            expansionStrategy: {
                priorityLocations: expansionPriority,
                totalOpportunities: expansionPriority.length,
                priorityACount: expansionPriority.filter(e => e.priority === 'A').length,
                priorityBCount: expansionPriority.filter(e => e.priority === 'B').length
            },

            revenueOptimization: {
                highValueZones: revenueOpp,
                totalMonthlyPotential: this.calculateTotalPotential(revenueOpp)
            },

            actionPlan: this.generateActionPlan(dashboard, expansionPriority)
        };

        // Download
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `erablue-strategic-report-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        return report;
    }

    getCompetitorBrandBreakdown() {
        if (typeof COMPETITORS_DATA === 'undefined') return {};

        const breakdown = {};
        Object.keys(COMPETITOR_BRANDS).forEach(brand => {
            const count = COMPETITORS_DATA.filter(c => c.brand === brand).length;
            if (count > 0) {
                breakdown[COMPETITOR_BRANDS[brand].name] = {
                    count,
                    threat: COMPETITOR_BRANDS[brand].threat
                };
            }
        });
        return breakdown;
    }

    calculateTotalPotential(zones) {
        const total = zones.reduce((sum, z) => {
            const value = parseInt(z.monthlyPotential.replace(/[^\d]/g, '')) || 0;
            return sum + value;
        }, 0);
        return this.formatCurrency(total);
    }

    generateActionPlan(dashboard, expansion) {
        return {
            immediate: [
                'Deploy flyer teams to top 5 golden zones',
                'Launch competitive pricing in contested areas',
                'Increase delivery radius in underserved zones'
            ],
            shortTerm: [
                `Evaluate ${expansion.filter(e => e.priority === 'A').length} Priority A locations for Q1`,
                'Implement customer loyalty program in high-threat zones',
                'Conduct market research in whitespace areas'
            ],
            longTerm: [
                'Strategic store expansion based on priority matrix',
                'Partnership opportunities in high-CAC zones',
                'Technology investment for delivery optimization'
            ]
        };
    }

    formatCurrency(value) {
        return 'Rp ' + Math.round(value).toLocaleString('id-ID');
    }
}

// Initialize and attach to window
window.StrategicIntelligence = new StrategicIntelligence();
