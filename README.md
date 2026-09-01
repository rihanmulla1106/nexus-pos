# Nexus POS - Inventory & Billing System

A modern, fast, and offline-first desktop application for managing inventory and generating beautiful PDF invoices. Built with **Electron**, **React**, and **SQLite**.

## ✨ Features

- **📊 Interactive Dashboard**: Real-time summaries of total sales, total catalog size, and low-stock alerts.
- **📦 Inventory Management**: Full CRUD capabilities for products. Keep track of stock quantities and pricing with automatic low-stock highlighting.
- **🧾 Point of Sale (POS) & Billing**: Split-screen checkout system. Add items to cart, adjust quantities, and instantly deduct from stock.
- **📄 PDF Invoice Generation**: One-click generation of professional PDF bills with beautifully formatted tables using `jsPDF`.
- **🎨 Modern Glassmorphism UI**: A stunning, vibrant dark-mode interface built with custom CSS and Lucide icons.
- **💾 Local First**: Uses an embedded SQLite database for zero-latency operations without needing an internet connection.

## 🛠️ Technology Stack

- **Frontend**: React.js, React Router, Vite
- **Backend / Desktop Environment**: Electron (Node.js)
- **Database**: SQLite3 (better-sqlite3)
- **PDF Generation**: jsPDF, jsPDF-AutoTable
- **Styling**: Vanilla CSS (CSS Variables, Glassmorphism)

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/inventory-billing-system.git
   cd inventory-billing-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application in development mode:
   ```bash
   npm run dev
   ```

### Building for Production
To package the application into a standalone `.exe` installer for Windows:
```bash
npm run build:win
```
The installer will be generated in the `dist` folder.

## 📸 Screenshots

*(Add screenshots of your Dashboard, Inventory, and Billing pages here!)*

## 📄 License
This project is open-source and available under the MIT License.
