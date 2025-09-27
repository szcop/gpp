// Simple API for Live Dashboard (Cloudflare Pages compatible)
class LiveAPI {
    constructor() {
        this.storageKey = 'redirector_analytics';
        this.init();
    }
    
    init() {
        // Handle API requests
        this.handleRequests();
    }
    
    handleRequests() {
        // Check if this is an API request
        if (window.location.pathname.includes('/api/')) {
            this.handleAPIRequest();
        }
    }
    
    handleAPIRequest() {
        const path = window.location.pathname;
        
        if (path.includes('/api/analytics')) {
            this.handleAnalyticsRequest();
        } else if (path.includes('/api/stats')) {
            this.handleStatsRequest();
        } else if (path.includes('/api/export')) {
            this.handleExportRequest();
        } else {
            this.handle404();
        }
    }
    
    handleAnalyticsRequest() {
        const data = this.getAnalyticsData();
        this.sendResponse(data);
    }
    
    handleStatsRequest() {
        const stats = this.getStats();
        this.sendResponse(stats);
    }
    
    handleExportRequest() {
        const data = this.getAnalyticsData();
        const exportData = {
            timestamp: new Date().toISOString(),
            data: data,
            format: 'json'
        };
        
        this.downloadJSON(exportData, 'redirector-analytics.json');
    }
    
    getAnalyticsData() {
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
    
    getStats() {
        const data = this.getAnalyticsData();
        return {
            totalVisitors: data.totalVisitors,
            todayVisitors: data.todayVisitors,
            onlineNow: data.onlineNow,
            botBlocks: data.botBlocks,
            domains: data.domains,
            recentVisitors: data.recentVisitors.slice(0, 10),
            lastUpdated: new Date().toISOString()
        };
    }
    
    sendResponse(data) {
        // For Cloudflare Pages, we'll return JSON
        document.body.innerHTML = `
            <pre style="font-family: monospace; padding: 20px; background: #f5f5f5; margin: 20px; border-radius: 5px;">
${JSON.stringify(data, null, 2)}
            </pre>
        `;
    }
    
    downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    handle404() {
        document.body.innerHTML = `
            <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
                <h1>404 - API Endpoint Not Found</h1>
                <p>Available endpoints:</p>
                <ul style="text-align: left; display: inline-block;">
                    <li>/api/analytics - Get full analytics data</li>
                    <li>/api/stats - Get summary statistics</li>
                    <li>/api/export - Download analytics data</li>
                </ul>
            </div>
        `;
    }
}

// Initialize API when page loads
document.addEventListener('DOMContentLoaded', () => {
    new LiveAPI();
});
