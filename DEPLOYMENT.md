# 🌸 Taasha Luxury E-Commerce — Free Server Deployment Guide

Everything in this project has been pre-configured so that you can run it **locally** with zero friction and deploy it to **free live hosting** whenever you are ready.

---

## ⚡ Architecture & Dual Mode Compatibility

| Environment | Frontend (`CMS`) | Backend (`SERVER`) | Database |
| :--- | :--- | :--- | :--- |
| **Local (Current)** | `http://localhost:5173` | `http://localhost:5000` | SQLite (`SERVER/prisma/dev.db`) |
| **Live Free Hosting** | Vercel or Netlify (Free) | Render or Railway (Free) | Free Neon or Supabase PostgreSQL |

> [!TIP]
> **Automatic Database Adapter:**  
> The backend includes [`prepare-db.js`](file:///d:/TIRTH/Tirth%20New/PROJECTS/My%20pros/Taasha/SERVER/scripts/prepare-db.js). When `DATABASE_URL` starts with `postgresql://` on your live host, it automatically adapts Prisma to PostgreSQL! When running locally with `file:./dev.db`, it uses SQLite. You do **not** need to manually edit code.

---

## 🚀 Option 1: Split Free Deployment (Recommended)
This is the modern e-commerce standard. The storefront gets blazing fast global edge caching, and the backend handles dynamic API calls.

### Step 1: Create a Free Cloud Database (Takes 60 seconds)
1. Go to [Neon.tech](https://neon.tech) or [Supabase.com](https://supabase.com) and create a free account.
2. Create a new project (e.g. `taasha-db`).
3. Copy the **Connection String** (`DATABASE_URL`). It looks like:
   ```
   postgresql://username:password@ep-cool-flower-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### Step 2: Deploy the Backend on Render (100% Free)
1. Push your project to GitHub or GitLab.
2. Sign in to [Render.com](https://render.com) and click **New + ➔ Web Service**.
3. Select your repository.
4. Fill in the settings:
   - **Name**: `taasha-backend` (or your chosen name)
   - **Root Directory**: `SERVER`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `DATABASE_URL` = *(Paste your Neon/Supabase connection string from Step 1)*
   - `NODE_ENV` = `production`
   - `CLIENT_URL` = `https://your-frontend.vercel.app` *(or `*` during initial testing)*
6. Click **Create Web Service**.
7. Once deployed, run the one-time seed command from the Render Shell tab:
   ```bash
   npm run seed:force
   ```
   *(This instantly populates all 8 luxury products, variants, promos, and UGC feeds in your live database!)*
8. Copy your live backend URL (e.g. `https://taasha-backend.onrender.com`).

---

### Step 3: Deploy Frontend on Vercel or Netlify (100% Free)

#### Deploying on Vercel:
1. Sign in to [Vercel.com](https://vercel.com) and click **Add New... ➔ Project**.
2. Select your repository.
3. Configure the project:
   - **Root Directory**: Click Edit and select `CMS`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://taasha-backend.onrender.com/api` *(Your Render backend URL with `/api`)*
5. Click **Deploy**.
   - Client-side routing is already pre-configured via [`CMS/vercel.json`](file:///d:/TIRTH/Tirth%20New/PROJECTS/My%20pros/Taasha/CMS/vercel.json) and [`CMS/public/_redirects`](file:///d:/TIRTH/Tirth%20New/PROJECTS/My%20pros/Taasha/CMS/public/_redirects), so `/admin`, `/products/1`, and other subpages won't 404 on refresh!

---

## 📦 Option 2: All-in-One Fullstack Deployment (Single URL)
If you prefer having **one single free service on Render** that serves both the frontend web app and the REST API backend:

1. In your repository on Render:
   - **Root Directory**: Leave blank (root of repo)
   - **Build Command**:
     ```bash
     npm run install:all && npm run build
     ```
   - **Start Command**:
     ```bash
     npm start
     ```
   - **Environment Variables**:
     - `DATABASE_URL` = *(Your Neon or Supabase PostgreSQL connection string)*
     - `NODE_ENV` = `production`
2. Express in [`SERVER/src/index.js`](file:///d:/TIRTH/Tirth%20New/PROJECTS/My%20pros/Taasha/SERVER/src/index.js) is already pre-wired to detect `CMS/dist` and serve all static pages automatically while handling `/api/*` routes!

---

## 🛠️ Verification Checklist for Live Deployment

- [ ] Backend health check responds: `https://your-backend.onrender.com/api/health` ➔ `{"status": "healthy"}`
- [ ] Catalog drops load on storefront: `https://your-frontend.vercel.app/collections/all`
- [ ] Admin Studio loads: `https://your-frontend.vercel.app/admin` (credentials: `admin@taasha.com` / `admin123`)
- [ ] Cart drawer promo codes work: Test with `MUSE20` for 20% off.
- [ ] Customer review submission works on any PDP.
