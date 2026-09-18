# 🎂 Caketering — Artisan Pastries & Custom Cakes E-Commerce Platform

<div align="center">

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript_ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Font Awesome](https://img.shields.io/badge/Font_Awesome-528DD7?style=for-the-badge&logo=font-awesome&logoColor=white)](https://fontawesome.com/)
[![Status](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

<p align="center">
  <strong>A modern, responsive e-commerce web platform for artisan bakeries, custom cake commissioning, and pastry order management.</strong>
</p>

[Explore Features](#-features) • [Getting Started](#-getting-started) • [Admin Portal](#-admin-portal--management) • [Project Structure](#-project-structure) • [Tech Stack](#-tech-stack)

</div>

---

## 📖 Overview

**Caketering** is a full-featured, responsive e-commerce web application crafted for bakery and pastry businesses. It delivers an intuitive, aesthetically rich customer shopping experience alongside a comprehensive administrative dashboard for managing orders, products, custom commissions, user accounts, and customer inquiries.

Built with **Tailwind CSS**, **Vanilla JavaScript (ES6+)**, and **HTML5**, Caketering leverages **LocalStorage** for full client-side state persistence and includes **live cross-tab synchronization** to keep admin and customer views updated in real time.

---

## ✨ Features

### 🛍️ Customer Experience
- **🍰 Interactive Product Catalog**:
  - Filter by category (*Cakes, Cupcakes, Pastries, Cookies*).
  - Search products with real-time text matching.
  - Informative product badges (*Best Seller, Popular, Fresh, Seasonal, Local Favorite*).
  - Detailed product view modals with allergen warnings, ingredient breakdowns, and customer reviews.
- **🎨 Custom Cake Commissioning**:
  - Request custom cakes by specifying occasion (*Birthday, Wedding, Anniversary, etc.*), size/tiers, flavors, and frosting.
  - Image reference upload with instant preview.
  - Live quote and order approval status tracking.
- **🛒 Cart & Express Checkout**:
  - Slide-out interactive cart drawer with real-time subtotal and quantity controls.
  - Discount promo code support.
  - Localized delivery date, time slot, and delivery address selection.
  - Multiple payment methods (*GCash, Cash on Delivery, Credit/Debit Card, Bank Transfer*).
- **🚚 Live Order Tracking**:
  - Look up orders by tracking code (`#ORD-XXXXXX`).
  - Visual stage milestones (*Pending → Confirmed → Baking → Out for Delivery → Delivered*).
- **💖 Wishlist & User Profile**:
  - Add favorite treats to a persistent wishlist.
  - User authentication (*Sign In, Register, Forgot Password, Demo OTP Verification, Remember Me*).
  - User profile portal with order history and active custom cake requests.
- **💬 Inquiry & Feedback**:
  - Built-in contact and message submission system.

---

### 👑 Admin Portal & Management
The built-in administration suite can be accessed by authorized admin accounts:

- **📊 Dashboard Analytics**:
  - Real-time revenue metrics, total orders, registered user counts, and pending custom cake requests.
- **📦 Order Management**:
  - Filter orders by status (*All, Pending, Confirmed, Baking, Out for Delivery, Delivered, Cancelled*).
  - View full itemized order details, delivery addresses, and payment statuses.
  - Print customer receipts and invoices directly from the dashboard.
  - One-click order status transitions.
- **🎂 Custom Cake Request Workflow**:
  - Review submitted custom cake requests with customer references.
  - Approve or decline requests and update production status.
- **🏷️ Product Catalog Manager**:
  - Add new products with image URLs, pricing, categories, ingredients, and allergen info.
  - Edit pricing, stock availability, and descriptions.
  - Delete or archive discontinued items.
- **👥 User Account Management**:
  - View registered customer profiles, join dates, and order activity.
- **✉️ Message / Inquiry Inbox**:
  - View and resolve customer contact inquiries.
- **🖼️ Asset & Media Manager**:
  - Manage showcase banners and gallery assets.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework & Markup** | HTML5 Semantic Elements |
| **Styling & Design System** | [Tailwind CSS](https://tailwindcss.com/) (CDN), Custom CSS3 animations, Glassmorphism, Micro-interactions |
| **Typography & Icons** | [Google Fonts](https://fonts.google.com/) (*Playfair Display & Poppins*), [Font Awesome 6](https://fontawesome.com/) |
| **Programming Language** | Vanilla JavaScript (ES6+ Modular Scripting) |
| **State & Persistence** | Browser `localStorage` API + `window.addEventListener('storage')` for live multi-tab synchronization |
| **Tooling & Environment** | VS Code, Live Server, Git / GitHub |

---

## 📁 Project Structure

```plaintext
Final-Caketering/
├── Caketering/
│   ├── images/              # Media and brand assets
│   ├── js/
│   │   └── caketeringjs.js  # Core application logic, state management, & admin portal
│   ├── styles/
│   │   └── caketering.css   # Custom animations, transitions, and component styles
│   ├── caketering.html      # Main application page
│   └── index.html           # Subfolder entry point
├── images/                  # Profile & root image assets
├── .vscode/
│   └── launch.json          # Debugging and launch configurations
├── index.html               # Main root landing page & entry point
└── README.md                # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
You only need a modern web browser (e.g., Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari). No complex build steps or Node.js runtime required!

### Quick Start
1. **Clone the repository**:
   ```bash
   git clone https://github.com/DeniDeveloper/Final-Caketering.git
   ```
2. **Navigate into the project folder**:
   ```bash
   cd Final-Caketering
   ```
3. **Open the application**:
   - Double-click `index.html` to open it in your default web browser, **or**
   - Use the **VS Code Live Server** extension for the best experience (recommended):
     - Right-click `index.html` → select **"Open with Live Server"**.

---

## 🔐 Roles & User Access

The platform supports role-based access control for both customers and administrators:

- **Customer Access**: Create a customer account directly via the **Register** modal to browse the menu, add items to your cart, commission custom cakes, and track active orders.
- **Administrator Access**: Administrative privileges allow managing product listings, approving custom cake quotations, updating order fulfillment stages, and viewing revenue analytics.

> [!TIP]
> You can open the customer storefront in one browser tab and the admin dashboard in another tab to observe **live cross-tab synchronization** when orders are placed or status updates occur!

---

## 🎯 Key Design Highlights

- **✨ Mobile-First & Fully Responsive**: Tailored layout supporting desktop, tablet, and mobile screen sizes.
- **🎨 Modern Aesthetic**: Warm bakery-inspired color palette, soft gradients, glassmorphic navigation bar, and delicate micro-animations.
- **⚡ Zero External Dependencies**: Runs entirely in-browser without requiring backend server setup for prototyping or demonstrations.
- **🛡️ Clean Code Architecture**: Structured separation of concern across markup, stylesheets, and modular state-driven JavaScript.

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use it for learning, prototyping, or customization.
