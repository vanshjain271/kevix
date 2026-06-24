# Kevix - Premium B2B & B2C E-Commerce Platform

![Kevix Banner](https://images.unsplash.com/photo-1601784551446-20c9e07cd56e?q=80&w=2000&auto=format&fit=crop)

**Kevix (Arbuda Accessories)** is a high-performance, full-stack multi-vendor-capable e-commerce platform built specifically for the Indian electronics and accessories market. It acts as both a B2C retail storefront and a B2B bulk-order ecosystem (handling "Lots", Minimum Order Quantities, and specific Phone Models).

The system features an extremely fast, SEO-optimized **Next.js Storefront**, a comprehensive **React/Vite Admin Dashboard**, and a scalable, highly secure **Node.js/Express Backend** with MongoDB.

---

## 🏗️ Architecture & Technology Stack

The project follows a Monorepo structure, cleanly separating concerns into three independent scalable services:

### 1. Storefront (`/storefront`)
The customer-facing application built for speed, SEO, and user experience.
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Vanilla CSS Modules
- **State Management:** Zustand (Persisted for Cart & Auth)
- **Data Fetching:** Axios + SWR for client-side caching
- **Key Features:** Server-Side Rendering (SSR) for product SEO, Dynamic Categories, Bulk/Lot Pricing Logic, Image Zoom, Mobile-Responsive Drawers.

### 2. Admin Dashboard (`/admin`)
The business operations control center.
- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **Key Features:** Real-time Dashboard Analytics, Drag-and-Drop Image Uploads (AWS S3 Integration), Advanced Product/Lot Management, Dynamic Navigation/Category Control, Order Processing Pipeline, Exportable Reports.

### 3. Backend API (`/backend`)
The central nervous system driving data persistence, authentication, and external integrations.
- **Environment:** Node.js + Express.js
- **Database:** MongoDB (via Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens) + Bcrypt
- **Security:** Helmet, CORS, Express Rate Limit
- **Integrations:** MSG91 (OTP, WhatsApp, SMS Routing), AWS S3 (Media Storage)
- **Architecture:** Controller-Service-Route Pattern (Clean Code)

---

## 🚀 Core Features Overview

### 🛍️ E-Commerce Engine
*   **Variant & Model Handling:** Unique system allowing products to be mapped to hundreds of specific phone models with shared inventory logic.
*   **B2B "Lot" Pricing:** Supports wholesale buying with Full, Half, and Mini lots.
*   **Advanced Filtering:** Dynamic sidebar that filters by Categories, Brands, Pricing, and Ratings instantly.
*   **Dynamic Cart & Wishlist:** Real-time synchronized cart across sessions using Zustand persistence.

### 🛡️ Unified Authentication (Native OTP)
*   Fully decoupled from Google/Firebase.
*   Employs a custom, ultra-fast **MSG91** backed SMS OTP infrastructure.
*   "Dev Mode" fallback for local testing without incurring SMS charges.
*   Complete automated profile creation upon verified mobile numbers.

### 📊 Administrative Control
*   **Banner Engine:** Upload, edit, and instantly deploy Hero Banners and Promotional grids to the Storefront.
*   **Order Lifecycle:** Track orders from `Pending` → `Confirmed` → `Packed` → `Shipped` → `Delivered`.
*   **Automated Communication:** Dispatch automated WhatsApp and SMS updates to customers instantly when order statuses change.
*   **Bulk Queries:** Integrated CRM to manage B2B inquiries directly from the dashboard.

---

## 💻 Local Development Setup

### Prerequisites
*   Node.js (v18.x or above)
*   MongoDB (v6.x or above running locally or Atlas URI)
*   AWS S3 Bucket Credentials (for image uploads)
*   MSG91 Credentials (for SMS/OTP testing)

### Step 1: Clone & Configure
Clone the repository to your local machine:
```bash
git clone https://github.com/vanshjain271/kevix.git
cd kevix
```

### Step 2: Bootstrapping the Backend
The backend powers the entire system. Start here.
```bash
cd backend
npm install
```
Create a `.env` file in the `/backend` root directory:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/kevix
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# AWS S3 Configuration
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=your_bucket_name

# MSG91 Messaging
SMS_PROVIDER=msg91
MSG91_AUTH_KEY=your_msg91_key
MSG91_OTP_TEMPLATE_ID=your_otp_template
MSG91_SENDER_ID=KEVIXA
```
Start the backend server:
```bash
npm run dev
```

### Step 3: Bootstrapping the Storefront
```bash
cd ../storefront
npm install
```
Create a `.env.local` file in the `/storefront` root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
```
Start the development environment:
```bash
npm run dev
```
*Access the Storefront at: `http://localhost:3002`*

### Step 4: Bootstrapping the Admin Panel
```bash
cd ../admin
npm install
```
Create a `.env` file in the `/admin` root directory:
```env
VITE_API_URL=http://localhost:5001/api/v1
```
Start the admin dashboard:
```bash
npm run dev
```
*Access the Admin Panel at: `http://localhost:3001`*

---

## 🛡️ Security Posture

Kevix utilizes industry-standard security measures:
1.  **NoSQL Injection Prevention:** Mongoose strict typing and schema validation prevents malicious query injections.
2.  **Rate Limiting:** IP-based request throttling (`express-rate-limit`) actively blocks brute-force login attempts and DDoS spikes.
3.  **Cross-Origin Isolation:** Strict CORS origin whitelisting ensures the API only responds to authorized Kevix clients.
4.  **XSS & Sniffing Protection:** Helmet.js sanitizes and standardizes all incoming/outgoing HTTP headers.

---

## 📝 License
© 2026 Arbuda Accessories (Kevix). All Rights Reserved. Proprietary and confidential. Unauthorized copying of these files via any medium is strictly prohibited.
