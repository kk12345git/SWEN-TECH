# Deployment Guide: SWEN TECH SOLUTIONS Portfolio

This guide outlines the steps to deploy your portfolio website to your custom domain: **swentechdigitalsolutions.co.in**.

## Recommended Hosting: Netlify

Netlify is the easiest platform for static sites. It provides free SSL, global CDN, and easy custom domain integration.

### Steps to Deploy on Netlify

1. **Create an Account**: Go to [Netlify.com](https://www.netlify.com/) and sign up.
2. **Upload the Site**:
    - You can drag and drop your entire `PORTFOLIO` folder into the "Sites" dashboard.
    - Alternatively, connect your GitHub repository for automatic deployments.
3. **Configure Custom Domain**:
    - Go to **Domain Settings** > **Add Custom Domain**.
    - Enter `swentechdigitalsolutions.co.in`.
4. **Update DNS**:
    - Netlify will provide you with 4 Name Server addresses (e.g., `dns1.p01.nsone.net`).
    - Log in to your domain registrar (where you bought the `.co.in` domain) and replace the current Name Servers with Netlify's.

---

## Alternative 1: GitHub Pages

If you are already using GitHub, this is a free and integrated option.

### Steps

1. **Push Code**: Ensure your code is in a public GitHub repository.
2. **Enable Pages**: Go to **Settings** > **Pages** and select the `main` branch.
3. **Custom Domain**:
    - Enter `swentechdigitalsolutions.co.in` in the Custom Domain field.
    - Add a `CNAME` file to your root directory containing `swentechdigitalsolutions.co.in`.
4. **DNS Configuration**: You will need to add `A` records and a `CNAME` record in your registrar's DNS settings pointing to GitHub's IPs.

---

## Post-Deployment Checklist

- [ ] **SSL (HTTPS)**: Ensure the "Enforce HTTPS" setting is active (Netlify does this automatically).
- [ ] **Contact Form**: Verify that your `EmailJS` configuration in `script.js` or `emailjs-config.js` is correct for the live domain.
- [ ] **Google Analytics**: Update the tracking ID in the `<head>` of your HTML files if you haven't already.
- [ ] **Mobile Preview**: Open the live link on your phone to check responsiveness one last time.

> [!TIP]
> **SEO TIP**: Submit your final sitemap to [Google Search Console](https://search.google.com/search-console/) once the site is live to speed up indexing!
