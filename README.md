# Arbuda Accessories (Kevix)

A customer-friendly, premium modern Indian e-commerce platform specializing in high-quality mobile accessories, chargers, cables, earbuds, neckbands, smartwatches, power banks, and other electronic gadgets.

This project is built using a modern multi-app architecture featuring a Next.js storefront, a React-based administration panel, and a robust Express backend.

---

## 🚀 Key Features

* **Dynamic Hero Carousel & Banners:** Fully controlled from the Admin Panel to display active campaigns, offers, and advertisements.
* **Interactive Dynamic Navigation:** Multi-level header menu that syncs instantly with the active categories in the database.
* **Intelligent Product Filter Sidebar:** Automatically derives unique, relevant brands dynamically from the products currently available in the active category.
* **Modern Product Showcase:** Detailed product descriptions, pricing, live inventory status, active discounts, and seamless, type-safe checkout experience.
* **Admin Management Panel:** Allows staff to upload products, manage active banners, edit categories, handle user orders, update statuses, and monitor real-time sales.
* **State & Cart Persistence:** Utilizing lightweight, modern state management (Zustand) and robust client-side caching (SWR) for high-speed navigation.

---

## 📁 Project Architecture

The codebase is organized as a monorepo containing three core sub-applications:

```
├── storefront/             # Customer-facing Next.js e-commerce website
├── admin/                  # Business-facing React dashboard for operations
└── backend/                # Shared Node.js Express REST API server
```

---

## 🛠️ Local Development & Setup

### Prerequisites
* **Node.js:** v18.x or above
* **npm:** v9.x or above
* **MongoDB:** Local or MongoDB Atlas URI

### 1. Set Up the Backend
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the `.env` file (refer to `.env.example` if present, or create one):
   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:271017/kevix
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the backend in development mode:
   ```bash
   npm run dev
   ```

### 2. Set Up the Admin Panel
1. Navigate to the `admin/` directory:
   ```bash
   cd ../admin
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the environment (in `.env`):
   ```env
   VITE_API_URL=http://localhost:5001/api/v1
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

### 3. Set Up the Storefront (Customer Site)
1. Navigate to the `storefront/` directory:
   ```bash
   cd ../storefront
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (in `.env.local` or `.env`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *The storefront will be available locally at `http://localhost:3002` (or your configured port).*

---

## 🔒 Security Notice

Please ensure that no sensitive credentials, AWS keys, database URIs, or local `.env` files are tracked in version control. A comprehensive `.gitignore` is provided at the root level to prevent accidental commits of environment configurations.
