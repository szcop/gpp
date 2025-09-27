# 🚀 Advanced Redirector System

A powerful, anti-bot redirector system designed for Cloudflare Pages deployment.

## 📁 Files Overview

### Core Files:
- **`index.html`** - Main redirector page (deploy this as your main page)
- **`live.html`** - Live analytics dashboard
- **`analytics-tracker.js`** - Client-side analytics tracking
- **`api.js`** - Analytics API endpoints
- **`robots.txt`** - Anti-indexing protection

### Configuration Files:
- **`_redirects`** - Cloudflare Pages redirect rules

## 🚀 Quick Setup

### 1. Deploy to Cloudflare Pages:
1. Upload all files to your GitHub repository
2. Connect repository to Cloudflare Pages
3. Set build command: `echo "Static site"`
4. Set publish directory: `/` (root)

### 2. Configure Your Domains:
Edit `index.html` line 161-165:
```javascript
this.domains = [
    'https://your-domain1.com',
    'https://your-domain2.com', 
    'https://your-domain3.com'
];
```

### 3. Access Your Redirector:
- **Main redirector**: `yourdomain.com/`
- **Live dashboard**: `yourdomain.com/live`

## ⚡ Features

### 🔄 Round-Robin Redirects:
- Cycles through 3 domains automatically
- Each user gets different domain
- Session-based tracking

### 🛡️ Anti-Bot Protection:
- User agent detection
- Behavioral analysis
- Headless browser detection
- Suspicious IP blocking

### 📊 Live Analytics:
- Real-time visitor tracking
- Per-domain redirect counts
- Bot detection statistics
- Online user monitoring

### 🔒 Anti-Indexing:
- Search engine blocking
- Meta tag protection
- robots.txt rules

## ⚙️ Configuration

### Timing Settings:
- **Countdown**: 2 seconds
- **Base delay**: 2 seconds  
- **Random delay**: 1-2.5 seconds
- **Total time**: 3-4.5 seconds

### Name Parameter Support:
- Pass `?name=value` in URL
- Automatically forwarded to target domains
- Example: `yoursite.com/?name=John` → `target.com/?name=John`

## 📈 Analytics Dashboard

Access at `/live` to see:
- Total visitors
- Today's visitors  
- Online users
- Bot blocks
- Per-domain redirects
- Recent visitor list

## 🔧 Customization

### Change Domains:
Edit the `domains` array in `index.html`

### Adjust Timing:
Modify `addRandomDelay()` function for different speeds

### Add More Protection:
Extend the anti-bot detection in `index.html`

## 📱 Mobile Optimized

- Responsive design
- Touch-friendly interface
- Mobile browser detection
- Fast loading on all devices

## 🚀 Ready to Deploy!

Your redirector is production-ready for Cloudflare Pages deployment.
