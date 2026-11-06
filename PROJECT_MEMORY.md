# 🌸 TAASHA — MASTER PROJECT MEMORY & ARCHITECTURE BIBLE

> **Permanent Memory File**: This document preserves the full context, architecture, design standards, database schemas, API routes, and operational workflows of **Taasha**. If context is ever lost due to a session reset or login issue, read this file first to instantly restore 100% project awareness.

---

## 1. 👑 Executive Summary & Brand Identity

- **Brand Name**: Taasha (`Taasha Royal Atelier` / `Taasha.`)
- **Core Concept**: Hyper-aesthetic, viral luxury female Indian couture & handloom e-commerce platform blending authentic craftsmanship with modern Gen-Z / Millennial viral aesthetics.
- **Brand Pillars**:
  - **Aesthetics**: Indian Heritage Royalty, Coquette Luxe, Ethereal Pastel Poetry, Romantic Opulence, Modern Draped Sirens.
  - **Color Palette**:
    - Baby Blush (`#ffe5ec`) & Ballet Rose (`#ff8fab`)
    - Buttercup Cream (`#fef7db`) & Soft Lilac (`#f3e8ff`)
    - Velvet Crimson Noir (`#880e4f` / `#1c141a`)
    - Antique Champagne Gold (`#d4a373` / `#e0c068`)
  - **Craftsmanship**: 100% pure certified Katan silk, heritage pit-loom Banarasi weaving, 350+ hour handcrafted zardozi embroidery, pure Chanderi silk, real glass mirror-work, and whisper-light tissue organza.
  - **UX/UI Standards**: Glassmorphic frosted cards, smooth micro-animations, interactive gamification, Playfair Display & serif typography, single-page frictionless checkout, and instant mobile responsiveness.

---

## 2. ⚡ System Architecture & Technology Stack

The project is structured as a clean decoupled fullstack application:

```
Taasha/
├── CMS/                  # React 19 Frontend SPA (Vite 8, React Router v7)
├── SERVER/               # Node.js + Express 4 REST API & Prisma ORM 6
├── DEPLOYMENT.md         # Complete free hosting deployment guide (Vercel/Render)
├── prompt_pack.md        # AI prompt bible for creative assets & feature designs
└── PROJECT_MEMORY.md     # (This file) Permanent context memory
```

### Tech Stack Details:
- **Frontend (`CMS`)**:
  - **Runtime**: React 19 (`^19.2.8`), React DOM 19
  - **Build Tool**: Vite 8 (`^8.2.0`)
  - **Routing**: React Router DOM 7 (`^7.18.2`)
  - **Icons**: Lucide React (`^1.31.0`)
  - **Styling**: Vanilla modular CSS with glassmorphism, responsive grid/flex layouts, CSS variables, and keyframe animations.
  - **State**: React Context (`CartContext.jsx`, `AuthContext.jsx`) with persistent `localStorage`.
- **Backend (`SERVER`)**:
  - **Runtime**: Node.js (ES Modules, `"type": "module"`)
  - **Framework**: Express 4 (`^4.21.2`), CORS, Morgan logging, Dotenv
  - **ORM**: Prisma ORM 6 (`@prisma/client: ^6.4.1`)
  - **Database Dual-Mode**:
    - **Local**: SQLite (`SERVER/prisma/dev.db`, `file:./dev.db`)
    - **Production**: PostgreSQL (Neon.tech or Supabase) with zero-code automatic provider switching handled by `scripts/prepare-db.js`.
  - **Static Serving**: Express is pre-configured to detect `CMS/dist` and serve static assets seamlessly for all-in-one deployment.

---

## 3. 🗄️ Database Schema & Prisma Models

Located in [`SERVER/prisma/schema.prisma`](file:///d:/TIRTH/Tirth%20New/PROJECTS/My%20pros/Taasha/SERVER/prisma/schema.prisma):

1. **`Product`**:
   - Fields: `id`, `slug`, `title`, `vendor`, `category`, `aesthetic`, `description`, `fabric`, `care`, `basePrice`, `salePrice`, `stockQuantity`, `ratingsAvg`, `reviewsCount`, `badge`, `isNew`, `isFeatured`, `image`, `hoverImage`, `createdAt`, `updatedAt`
   - Relations: `variants` (1:N ProductVariant), `reviews` (1:N Review), `ugcPosts` (1:N UGCPost)
2. **`ProductVariant`**:
   - Fields: `id`, `productId`, `colorName`, `colorHex`, `size`, `sku`, `inventory`, `image`
   - Unique index: `[productId, colorName, size]`
3. **`Order`**:
   - Fields: `id`, `orderNumber`, `customerName`, `customerEmail`, `customerPhone`, `shippingAddress` (JSON string), `items` (JSON string), `subtotal`, `discount`, `shippingFee`, `total`, `status` (`PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`), `paymentMethod`, `promoCode`, `giftPackaging`, `notes`, `createdAt`, `updatedAt`
4. **`Review`**:
   - Fields: `id`, `productId`, `authorName`, `authorEmail`, `rating`, `title`, `body`, `verifiedBuyer`, `createdAt`
5. **`PromoCode`**:
   - Fields: `id`, `code` (unique), `discountType` (`PERCENTAGE` or `FIXED`), `value`, `minOrder`, `active`, `usageCount`, `expiryDate`, `createdAt`
6. **`UGCPost`**:
   - Fields: `id`, `creator`, `creatorName`, `avatar`, `location`, `verified`, `caption`, `likes`, `aspectClass`, `image`, `isReel`, `reelDuration`, `category`, `badge`, `status` (`APPROVED` or `PENDING`), `productId`, `createdAt`
7. **`NewsletterSubscriber`**:
   - Fields: `id`, `email` (unique), `source`, `discountCodeSent`, `createdAt`
8. **`AdminUser`**:
   - Fields: `id`, `name`, `email` (unique), `role` (`SUPERADMIN`), `createdAt`

---

## 4. 🌐 REST API Endpoints Reference

All routes are mounted under `/api` in [`SERVER/src/index.js`](file:///d:/TIRTH/Tirth%20New/PROJECTS/My%20pros/Taasha/SERVER/src/index.js):

| Resource | Method & Path | Description |
| :--- | :--- | :--- |
| **System** | `GET /api/health` | Health check + database connectivity verification |
| **Products** | `GET /api/products` | Filter by `category`, `aesthetic`, `size`, `color`, `minPrice`, `maxPrice`, `search`, `sort`, `badge` |
| | `GET /api/products/:id` | Single product details with variants and reviews |
| | `POST /api/products` | Create product with variants (Admin) |
| | `PUT /api/products/:id` | Update product details (Admin) |
| | `DELETE /api/products/:id` | Delete product (Admin) |
| **Orders** | `GET /api/orders` | List orders with status filter & search (Admin) |
| | `GET /api/orders/:id` | Get single order by ID or order number |
| | `POST /api/orders` | Create customer order |
| | `PATCH /api/orders/:id/status` | Update fulfillment status (Admin) |
| | `DELETE /api/orders/:id` | Delete order (Admin) |
| **Cart & Checkout**| `POST /api/cart/validate` | Validate promo code against database, calculate discount |
| | `POST /api/cart/create-intent` | Prepare order calculations / payment intent |
| **Promo Codes** | `GET /api/promos` | List promo codes (Admin) |
| | `POST /api/promos` | Create promo code (Admin) |
| | `PATCH /api/promos/:id/toggle` | Enable/disable promo code (Admin) |
| | `DELETE /api/promos/:id` | Delete promo code (Admin) |
| **UGC Feed** | `GET /api/ugc` | Get approved community style posts & reels |
| | `GET /api/ugc/all` | Get all UGC posts including pending (Admin) |
| | `POST /api/ugc` | Community submit new style look / photo / reel |
| | `POST /api/ugc/:id/like` | Like or unlike a UGC post |
| | `PATCH /api/ugc/:id/status` | Approve or reject UGC post (Admin) |
| | `DELETE /api/ugc/:id` | Delete UGC post (Admin) |
| **Reviews** | `GET /api/reviews/:productId`| Get product customer reviews |
| | `POST /api/reviews` | Submit product review & auto-recompute `ratingsAvg` |
| **Newsletter** | `POST /api/newsletter/subscribe`| Newsletter signup + welcome promo code delivery |
| | `GET /api/newsletter` | List subscribers (Admin) |
| **Admin Stats** | `GET /api/admin/stats` | Real-time KPIs: Revenue, AOV, order statuses, low-stock alerts |
| **Payment Gateway** | `POST /api/payment/create-intent` | Initiates dual-mode payment intent (Live Stripe or High-Fidelity Gateway Engine) with promo code calculation |
| | `POST /api/payment/verify-payment` | Verifies gateway authorization, marks order as PAID, returns auth code |
| | `POST /api/payment/create-upi-qr` | Generates authentic NPCI UPI intent URL (`upi://pay?pa=...`), INR conversion, and QR payload |

---

## 5. 💻 Frontend Architecture & UI Features

All client-side code is under [`CMS/src`](file:///d:/TIRTH/Tirth%20New/PROJECTS/My%20pros/Taasha/CMS/src):

### A. Routes & Layouts ([`App.jsx`](file:///d:/TIRTH/Tirth%20New/PROJECTS/My%20pros/Taasha/CMS/src/App.jsx))
- `/` ➔ [`Home.jsx`](file:///d:/TIRTH/Tirth%20New/PROJECTS/My%20pros/Taasha/CMS/src/pages/Home.jsx): Hero video slider, royal category showcase, viral bestsellers, USP trust badges, couture testimonials.
- `/collections/:category` & `/shop` ➔ [`Collection.jsx`](file:///d:/TIRTH/Tirth%20New/PROJECTS/My%20pros/Taasha/CMS/src/pages/Collection.jsx): Dynamic collection catalog with multi-facet filters (aesthetic, size, price, color) and layout toggles.
- `/products/:id` ➔ [`ProductDetail.jsx`](file:///d:/TIRTH/Tirth%20New/PROJECTS/My%20pros/Taasha/CMS/src/pages/ProductDetail.jsx): Multi-image viewer, swatch selector, blouse tailoring size selector, accordions for craftsmanship/care, live customer reviews, and recommended pairings.
- `/feed` ➔ [`ShopTheFeed.jsx`](file:///d:/TIRTH/Tirth%20New/PROJECTS/My%20pros/Taasha/CMS/src/pages/ShopTheFeed.jsx): Instagram/TikTok style masonry feed with quick-shop modal, creator profiles, reel previews, and UGC look upload modal.
- `/checkout` ➔ [`Checkout.jsx`](file:///d:/TIRTH/Tirth%20New/PROJECTS/My%20pros/Taasha/CMS/src/pages/Checkout.jsx): Frictionless single-page checkout with live promo code validation, gift packaging toggle, animated credit card preview, instant UPI QR code, Net Banking bank selector, and multi-step payment gateway authorization.
- `/orders/:orderNumber` & `/track-order` ➔ [`OrderTracking.jsx`](file:///d:/TIRTH/Tirth%20New/PROJECTS/My%20pros/Taasha/CMS/src/pages/OrderTracking.jsx): Real-time visual milestone tracking (Atelier Prep -> Zari Inspection -> Dispatched -> Delivered), customer details, payment authenticity guarantee, and 1-click printable luxury invoice.
- `/admin/*` ➔ [`AdminDashboard.jsx`](file:///d:/TIRTH/Tirth%20New/PROJECTS/My%20pros/Taasha/CMS/src/pages/AdminDashboard.jsx): Full management studio protected by [`AdminRoute.jsx`](file:///d:/TIRTH/Tirth%20New/PROJECTS/My%20pros/Taasha/CMS/src/components/AdminRoute.jsx).

### B. Interactive Components
1. **`Header.jsx`**: Animated announcement ticker bar, brand logo, mega-menus for Sarees/Lehengas/Suits, instant quick search popup, wishlist counter, and cart trigger.
2. **`CartDrawer.jsx`**: Glassmorphic slide-out drawer, dynamic free shipping calculation bar ($75 threshold), live discount application, line item controls.
3. **`AestheticStylistModal.jsx`**: Interactive 3-step AI Trousseau Matchmaker quiz that recommends curated 3-piece capsules with a single "Add Complete Capsule (Save 15%)" button.
4. **`FitEstimatorDrawer.jsx`**: Interactive height/weight sliders with fit preference selectors ("Structured Sculpt", "True to Silhouette", "Relaxed Flowy") calculating precise blouse/garment sizing.
5. **`SecretDropWheel.jsx`**: Gamified spinning roulette wheel modal offering discount prizes (`RANI20`, `SHAADI25`, etc.) with instant auto-application to cart.
6. **`LoginModal.jsx`**: Aesthetic modal supporting 1-click Demo Admin login or customer registration.

---

## 6. 📦 Current Seeded Data & Credentials

### Initial Catalog (8 Royal Couture Pieces):
1. **Gulabi Noor Pure Katan Banarasi Silk Saree** (`$210.00` / was `$245.00`) — Handwoven Banarasi silk
2. **Mastani Crimson Zardozi Bridal Lehenga** (`$580.00` / was `$650.00`) — 350+ hours zardozi embroidery
3. **Noor-E-Chanderi Ivory Silk Anarkali Suit** (`$148.00` / was `$175.00`) — 48-kali handwoven Chanderi
4. **Tara Sheer Organza Tissue Saree** (`$139.00` / was `$165.00`) — Ombre organza with gotta cutwork
5. **Sitara Rani Pink Real Mirror-Work Sharara Set** (`$165.00` / was `$195.00`) — Real glass mirrors on georgette
6. **Apsara Burgundy Pre-Draped Satin Silk Cocktail Saree** (`$185.00` / was `$220.00`) — 60-second liquid satin drape
7. **Meera Sunshine Haldi Chanderi Kurta Set** (`$92.00` / was `$110.00`) — Haldi ceremony turmeric Chanderi
8. **Zoon Emerald Green Kashmiri Tilla Velvet Suit** (`$198.00` / was `$240.00`) — Grade 9000 micro-velvet & Tilla

### Active Promo Codes:
- `RANI20`: 20% off (min order $50)
- `SHAADI25`: 25% off (min order $150)
- `NOOR15`: 15% off (no min order)
- `UTSAV50`: $50 off (min order $200)
- `MUSE20`: 20% off (no min order)

### Admin Credentials & Access:
- **URL**: `http://localhost:5173/admin`
- **Email**: `admin@taasha.com`
- **Password**: Any password (or click "Login as Admin Demo" in [`LoginModal.jsx`](file:///d:/TIRTH/Tirth%20New/PROJECTS/My%20pros/Taasha/CMS/src/components/LoginModal.jsx))
- **Demo Customer**: `muse@taasha.com`

---

## 7. 🛠️ Development & Environment Commands (Windows Execution Guide)

> [!IMPORTANT]
> **Windows PowerShell Execution Policy Notice:**
> On Windows PowerShell, running `npm` or `npx` directly may trigger script execution policy blocks (`npm.ps1 cannot be loaded`). Always use **`npm.cmd`** or **`npx.cmd`** for CLI commands.

### Running Backend:
```powershell
cd SERVER
npm.cmd run dev       # Starts Express API on http://localhost:5000 with nodemon/watch
```

### Running Frontend:
```powershell
cd CMS
npm.cmd run dev       # Starts Vite dev server on http://localhost:5173
```

### Testing Frontend Build:
```powershell
cd CMS
npm.cmd run build     # Compiles Vite production bundle into CMS/dist
```

### Database Seeding & Reset:
```powershell
cd SERVER
npm.cmd run seed:force   # Resets SQLite and seeds all products, promos, orders & UGC
```

---

## 8. 🚀 Deployment Reference (Vercel & Render)

- **Frontend on Vercel**:
  - Root Directory: `CMS`
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Env Var: `VITE_API_URL = https://your-backend.onrender.com/api`
  - SPA Redirects: Handled by `CMS/vercel.json` and `CMS/public/_redirects`.
- **Backend on Render**:
  - Root Directory: `SERVER`
  - Build Command: `npm install && npm run build`
  - Start Command: `npm start`
  - Env Vars: `DATABASE_URL` (PostgreSQL string), `NODE_ENV=production`, `CLIENT_URL=https://your-frontend.vercel.app`
  - Database adapter: `SERVER/scripts/prepare-db.js` runs automatically on `postinstall`/`build` to change `provider = "sqlite"` to `"postgresql"`.

---

## 9. 📋 Roadmap & Completed Milestones

- [x] **Live Payment Gateway**: Full dual-mode gateway integration in [`paymentRoutes.js`](file:///d:/TIRTH/Tirth%20New/PROJECTS/My%20pros/Taasha/SERVER/src/routes/paymentRoutes.js) (Live Stripe API + High-Fidelity Gateway Engine fallback), NPCI UPI QR code generator, Net Banking selector, and COD.
- [x] **Customer Order Tracking & Digital Invoice**: Dedicated route at `/orders/:orderNumber` and `/track-order` in [`OrderTracking.jsx`](file:///d:/TIRTH/Tirth%20New/PROJECTS/My%20pros/Taasha/CMS/src/pages/OrderTracking.jsx) with 5 visual handcrafting milestones and 1-click printable atelier invoice.
- [x] **Live Dynamic Rendering Across 100% of Storefront**: Every page (`Home.jsx`, `Collection.jsx`, `ProductDetail.jsx`, `ShopTheFeed.jsx`, `CartDrawer.jsx`, `Header.jsx`, `AdminDashboard.jsx`, and `OrderTracking.jsx`) fetches live data directly from the backend Express/Prisma API.
- [x] **Live Header Product Search**: Debounced database search query in [`Header.jsx`](file:///d:/TIRTH/Tirth%20New/PROJECTS/My%20pros/Taasha/CMS/src/components/Header.jsx) with real-time product matching.
- [ ] **Real Blouse Customization Configurator**: Visual neckline, sleeve style, and back cut selector on `ProductDetail.jsx`.
- [ ] **Email Integration**: Automated transactional email dispatch via SendGrid or Resend on order placement (`orderRoutes.js`).
- [ ] **Image Upload to Cloud**: Replace local/placeholder image URLs with Cloudinary / AWS S3 upload in `ShopTheFeed.jsx` and `AdminDashboard.jsx`.

---

## 10. 🧪 Automated Test Suite & Audit History

### Integration Test Runner:
Located at [`SERVER/test-api.js`](file:///d:/TIRTH/Tirth%20New/PROJECTS/My%20pros/Taasha/SERVER/test-api.js). Runs an in-memory integration test suite across all 17 REST API endpoints against the real Express router, controllers, middleware, and Prisma SQLite database:
```powershell
cd SERVER
node test-api.js     # 17 Passed, 0 Failed
```

### Verified & Resolved Inconsistencies:
1. **Payment Gateway Integration**: Added `/api/payment/create-intent`, `/api/payment/verify-payment`, and `/api/payment/create-upi-qr`. Supported live Stripe keys (`STRIPE_SECRET_KEY`) with automatic fallback to high-fidelity simulated intents (`pi_tsh_...`).
2. **Order Payment Metadata**: Updated `Order` Prisma schema and routes to store `paymentStatus` and `paymentId` directly in database records.
3. **Interactive Checkout Suite**: Upgraded `Checkout.jsx` with real-time animated credit card visual preview, automatic card number/expiry/CVC formatting, 1-click test card auto-fill, dynamic NPCI UPI QR code with countdown timer, Indian bank selector grid, and 3-stage gateway authorization modal.
4. **Order Tracking & Printable Receipt**: Created `OrderTracking.jsx` and `OrderTracking.css` with 5 handcrafting milestones, payment verification details, and `@media print` clean invoice styling.
5. **Debounced Live Header Search**: Implemented debounced live search in `Header.jsx` querying backend products directly.
6. **Promo Code Discount Type Bug**: Fixed promo code deduction for `FIXED` amount codes (such as `UTSAV50` for $50 off).
7. **Cart & Wishlist State Persistence**: Persisted cart (`taasha_cart_v1`) and wishlist (`taasha_wishlist_v1`) in `localStorage`.
8. **Admin Studio Category & Aesthetic Synchronization**: Updated `AdminDashboard.jsx` Add/Edit Product dropdowns with authentic Indian couture categories and aesthetics.
9. **Zero-Warning Linter & Clean Production Build**: `oxlint` reports **0 errors, 0 warnings** across all 22 files; Vite builds client in ~3 seconds with zero issues.
10. **Admin Dashboard Table Thumbnail Dimensions Fix**: Resolved an issue where product catalog and UGC images in `AdminDashboard.jsx` were rendering unconstrained at full image resolution. Enforced strict constraints (`.product-thumb`, `.table-thumb`: `52px` × `64px`, `object-fit: cover`, `border-radius: 8px`) in both CSS and component inline styles.
11. **Comprehensive Indian Rupee (INR / ₹) Currency Overhaul**:
    - Converted all store pricing, orders, promos, shipping thresholds, and UI components from USD (`$`) to Indian Rupees (`₹` / `INR`).
    - Created `CMS/src/utils/currency.js` featuring `formatINR` using the standard Indian numbering system (`en-IN`, e.g. `₹18,500`, `₹49,999`).
    - Seeded database with authentic Indian couture pricing: Banarasi Silk Saree `₹18,500` (MRP `₹21,999`), Mastani Bridal Lehenga `₹49,999` (MRP `₹56,000`), Chanderi Anarkali `₹12,499`, Organza Tissue Saree `₹11,999`, etc.
    - Updated free shipping threshold to `₹4,999` (Standard express shipping fee: `₹299`).
    - Updated promo codes: `RANI20` (20% off, min order `₹4,000`), `SHAADI25` (25% off, min order `₹12,000`), `UTSAV50` (`₹4,000` off, min order `₹15,000`).
    - Updated every frontend component (`ProductCard`, `CartDrawer`, `Home`, `Collection`, `ProductDetail`, `ShopTheFeed`, `Checkout`, `OrderTracking`, `AdminDashboard`, `Header`, `AestheticStylistModal`) to display native Indian Rupees (`₹`).
    - Verified all 17 integration tests in `SERVER/test-api.js` pass with 100% success; `oxlint` confirmed 0 errors and 0 warnings.
12. **Collection Catalog Empty State Resolution (`/collections/new`)**:
    - Resolved issue where `/collections/new` rendered "No styles match your filters".
    - Root causes:
      1. When prices were converted to INR (`₹7,999`–`₹49,999`), the price filter slider state in the browser was defaulting to the legacy USD ceiling of `700` (or `200` when clicking the quick filter pill), causing `item.price > selectedMaxPrice` to filter out every piece.
      2. No explicit handler existed for `category === 'new'`, causing category matching ambiguity.
      3. Strict string equality on variant size (e.g. `'Free Size'` vs `'Free Size (Saree + Blouse)'`) and color names (e.g. `'Pink'` vs `'Gulabi Rani Pink'`) blocked matches.
    - Solution:
      - Added fallback ceiling `effectiveMaxPrice` (auto-defaults to `100,000` if state is `< 5000`).
      - Added explicit handling for `/collections/new` and `/collections/new-drops` matching `isNew !== false`.
      - Added flexible prefix/substring matching for both sizing and color palettes.
      - Added automatic filter reset upon category route change `[category]`.
      - Quick filter pills now highlight and filter by silhouette cleanly.



