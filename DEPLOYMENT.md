# 🌸 Taasa Luxury Couture - Deployment Guide

## 🚀 Live Demo Public Link (Active Right Now)

Your fullstack application is currently running live with an active Cloudflare Edge tunnel:

- **Storefront Live URL**: [https://smooth-ceremony-intervals-desert.trycloudflare.com](https://smooth-ceremony-intervals-desert.trycloudflare.com)
- **Admin Studio URL**: [https://smooth-ceremony-intervals-desert.trycloudflare.com/admin](https://smooth-ceremony-intervals-desert.trycloudflare.com/admin)
- **Kurtis Collection**: [https://smooth-ceremony-intervals-desert.trycloudflare.com/collections/kurtis](https://smooth-ceremony-intervals-desert.trycloudflare.com/collections/kurtis)
- **API Health Check**: [https://smooth-ceremony-intervals-desert.trycloudflare.com/api/health](https://smooth-ceremony-intervals-desert.trycloudflare.com/api/health)

> **Client Access**: Anyone can open this link on their phone, laptop, or tablet anywhere in the world. No login credentials or setup required.

---

## 🛠️ How to Restart the Live Demo Link Anytime

Whenever you want to restart the live demo link with a fresh tunnel:

```bash
npm run live
```

This runs `scripts/start-live.js`, boots the unified Express server on port 5000 serving both API + static frontend, and establishes a Cloudflare Quick Tunnel with a live HTTPS URL.

---

## ☁️ Permanent 24/7 Free Cloud Hosting (Render.com)

If you wish to deploy Taasa so it stays online 24/7 without needing your computer running:

### Step 1: Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/taasa-boutique.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Render (100% Free)
1. Go to [https://dashboard.render.com](https://dashboard.render.com) and click **"New +" -> "Web Service"**.
2. Select your `taasa-boutique` repository.
3. Render automatically detects `render.yaml` or you can enter:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
4. Click **"Deploy Web Service"**.

Render will deploy your full-stack Taasa app with free automated HTTPS (`https://taasa-couture.onrender.com`).
