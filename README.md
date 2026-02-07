# Swen Tech Solutions - Portfolio Website

Official website for SWEN TECH SOLUTIONS showcasing our services, portfolio, and expertise in digital transformation.

## 🚀 Quick Start

1. Open `index.html` in your browser to view locally
2. All pages are static HTML/CSS/JavaScript - no build process needed
3. For deployment, see [deployment_guide.md](deployment_guide.md)

## 📁 Project Structure

```
PORTFOLIO/
├── index.html              # Homepage
├── about.html              # About us & team
├── services.html           # Our services
├── portfolio.html          # Case studies
├── contact.html            # Contact form
├── blog.html               # Blog articles
├── estimator.html          # AI project estimator
├── dashboard.html          # Admin dashboard
├── playground.html         # Code playground
├── tools.html              # Developer tools
├── styles.css              # Main stylesheet
├── script.js               # Main JavaScript
├── emailjs-config.js       # Email configuration
└── manifest.json           # PWA manifest
```

## ✨ Features

- 🎨 Modern gradient design with glassmorphism effects
- 🌓 Dark/Light mode toggle
- 📱 Fully responsive (mobile, tablet, desktop)
- 🤖 AI-powered chatbot assistant
- 📧 Contact form with EmailJS integration
- 💼 Portfolio showcase with case studies
- 📊 Interactive project cost estimator
- 🛠️ Developer tools section
- 📝 Blog with category filtering
- ⚡ Progressive Web App (PWA) ready
- 🔒 SEO optimized

## 🔧 Configuration Required

### 1. EmailJS Setup

Edit `emailjs-config.js`:

```javascript
const EMAILJS_CONFIG = {
    publicKey: 'YOUR_PUBLIC_KEY',
    serviceID: 'YOUR_SERVICE_ID',
    templateID: 'YOUR_TEMPLATE_ID'
};
```

### 2. Google Analytics

Replace `G-XXXXXXXXXX` in all HTML files with your tracking ID.

### 3. Social Media Links

Update footer links in all HTML files with your actual social profiles.

## 🌐 Deployment

**Recommended: Netlify (Free)**

1. Push to GitHub
2. Import to Netlify
3. Deploy (automatic)

See full deployment guide in [deployment_guide.md](deployment_guide.md)

## 📦 Technologies Used

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Icons:** Font Awesome 6.5.1
- **Email:** EmailJS
- **Analytics:** Google Analytics
- **PWA:** Service Worker for offline support

## 🎯 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Recent Fixes

### v2.1 (January 2026)

- ✅ Fixed theme toggle bug (dark/light mode now works correctly)
- ✅ Corrected footer branding consistency across all pages
- ✅ Improved localStorage theme persistence

## 📞 Contact

**SWEN TECH SOLUTIONS**

- Email: <swentechdigitalsolutions@gmail.com>
- Website: [Coming Soon]

## 📄 License

© 2026 SWEN TECH SOLUTIONS. All Rights Reserved.

---

**Ready to deploy?** Start with the [Deployment Guide](deployment_guide.md)!
