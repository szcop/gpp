// Analytics Tracker for Live Dashboard
class AnalyticsTracker {
    constructor() {
        this.storageKey = 'redirector_analytics';
        this.data = this.loadData();
        this.init();
    }
    
    loadData() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : this.getDefaultData();
        } catch (e) {
            return this.getDefaultData();
        }
    }
    
    getDefaultData() {
        return {
            totalVisitors: 0,
            todayVisitors: 0,
            onlineNow: 0,
            botBlocks: 0,
            domains: {
                domain1: { total: 0, today: 0, hour: 0, success: 0 },
                domain2: { total: 0, today: 0, hour: 0, success: 0 },
                domain3: { total: 0, today: 0, hour: 0, success: 0 }
            },
            recentVisitors: [],
            hourlyStats: {},
            dailyStats: {}
        };
    }
    
    init() {
        // Track page load
        this.trackPageLoad();
        
        // Track mouse movement (human activity)
        this.trackHumanActivity();
        
        // Track page visibility
        this.trackVisibility();
    }
    
    trackPageLoad() {
        const now = new Date();
        const today = now.toDateString();
        const hour = now.getHours();
        
        // Increment total visitors
        this.data.totalVisitors++;
        
        // Increment today's visitors
        if (this.data.dailyStats[today]) {
            this.data.dailyStats[today]++;
        } else {
            this.data.dailyStats[today] = 1;
        }
        
        this.data.todayVisitors = this.data.dailyStats[today] || 0;
        
        // Update hourly stats
        const hourKey = `${today}_${hour}`;
        if (this.data.hourlyStats[hourKey]) {
            this.data.hourlyStats[hourKey]++;
        } else {
            this.data.hourlyStats[hourKey] = 1;
        }
        
        // Set online now (simplified - in production, use WebSocket or server-side tracking)
        this.data.onlineNow = Math.min(this.data.todayVisitors, 50);
        
        this.saveData();
    }
    
    trackRedirect(domain, success = true) {
        const now = new Date();
        const today = now.toDateString();
        const hour = now.getHours();
        
        // Get name parameter
        const nameParam = this.getNameParameter();
        
        // Debug logging
        console.log('Analytics tracking:', {
            domain: domain,
            success: success,
            nameParam: nameParam
        });
        
        // Determine domain index based on actual domains
        let domainKey = 'domain1';
        if (domain.includes('partieve.de')) domainKey = 'domain2';
        else if (domain.includes('vipinvite.de')) domainKey = 'domain3';
        
        console.log('Domain key assigned:', domainKey);
        
        // Update domain stats
        this.data.domains[domainKey].total++;
        
        if (this.data.domains[domainKey].today === 0) {
            this.data.domains[domainKey].today = 1;
        } else {
            this.data.domains[domainKey].today++;
        }
        
        // Update hourly stats for domain
        const hourKey = `${today}_${hour}`;
        if (this.data.hourlyStats[hourKey]) {
            this.data.hourlyStats[hourKey]++;
        } else {
            this.data.hourlyStats[hourKey] = 1;
        }
        
        // Update success rate (calculate as percentage)
        if (success) {
            this.data.domains[domainKey].success = 100; // If redirect happened, it's 100% success
        }
        
        // Add to recent visitors with name parameter
        this.addRecentVisitor(domain, success, nameParam);
        
        this.saveData();
    }
    
    getNameParameter() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('name');
    }
    
    trackBotBlock() {
        this.data.botBlocks++;
        this.saveData();
    }
    
    addRecentVisitor(domain, success, nameParam = null) {
        const visitor = {
            time: new Date().toLocaleTimeString(),
            domain: domain,
            success: success,
            name: nameParam,
            timestamp: Date.now()
        };
        
        this.data.recentVisitors.unshift(visitor);
        
        // Keep only last 50 visitors
        if (this.data.recentVisitors.length > 50) {
            this.data.recentVisitors = this.data.recentVisitors.slice(0, 50);
        }
    }
    
    trackHumanActivity() {
        let mouseMovements = 0;
        let scrollEvents = 0;
        
        document.addEventListener('mousemove', () => {
            mouseMovements++;
            if (mouseMovements > 5) {
                sessionStorage.setItem('human_activity', 'true');
            }
        });
        
        window.addEventListener('scroll', () => {
            scrollEvents++;
            if (scrollEvents > 2) {
                sessionStorage.setItem('human_scroll', 'true');
            }
        });
    }
    
    trackVisibility() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // User left the page
                this.data.onlineNow = Math.max(0, this.data.onlineNow - 1);
            } else {
                // User returned to the page
                this.data.onlineNow++;
            }
            this.saveData();
        });
    }
    
    saveData() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (e) {
            console.warn('Could not save analytics data');
        }
    }
    
    getData() {
        return this.data;
    }
    
    getStats() {
        return {
            totalVisitors: this.data.totalVisitors,
            todayVisitors: this.data.todayVisitors,
            onlineNow: this.data.onlineNow,
            botBlocks: this.data.botBlocks,
            domains: this.data.domains,
            recentVisitors: this.data.recentVisitors.slice(0, 10),
            hourlyStats: this.data.hourlyStats,
            dailyStats: this.data.dailyStats
        };
    }
    
    // Export data for external use
    exportData() {
        return JSON.stringify(this.data, null, 2);
    }
    
    // Clear all data
    clearData() {
        this.data = this.getDefaultData();
        this.saveData();
    }
}

// Global analytics tracker
window.analyticsTracker = new AnalyticsTracker();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsTracker;
}
