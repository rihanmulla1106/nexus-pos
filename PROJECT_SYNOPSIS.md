# PROJECT SYNOPSIS

## 1. PROJECT TITLE
**NEXUS POS: An Offline-First Desktop Point of Sale and Intelligent Inventory Management System**

---

## 2. ABSTRACT / INTRODUCTION
Modern retail environments often rely heavily on cloud-based Point of Sale (POS) software that requires recurring monthly subscriptions, continuous high-speed internet connectivity, and third-party data hosting. For independent retailers, small-to-medium enterprises (SMEs), and local businesses, cloud dependency presents severe vulnerabilities, including operational downtime during network outages, recurring software costs, and third-party data privacy risks.

**Nexus POS** is an offline-first, enterprise-grade desktop POS and inventory management application designed to address these pain points. Built using an Electron, React, and SQLite architecture, Nexus POS provides zero-latency transaction processing, dynamic stock tracking, cryptographic authentication, customer loyalty rewards, split-payment handling, daily expense tracking, and dual-format document generation (standard A4 and 80mm thermal receipts). The system ensures complete data privacy and uninterrupted store operations regardless of internet connectivity.

---

## 3. PROBLEM STATEMENT
Traditional retail management systems suffer from several key limitations:
1. **Cloud Downtime & Network Fragility**: Internet interruptions freeze transaction workflows, causing customer queues and lost revenue.
2. **Prohibitive Recurring Costs**: Subscription-based models (such as Shopify POS or Square) impose recurring monthly platform fees and per-transaction cuts.
3. **Data Sovereignty Concerns**: Sensitive sales, customer data, and financial performance metrics are stored on external vendor servers.
4. **Complexity & Cluttered Interfaces**: Enterprise ERPs are frequently over-engineered, requiring specialized training for frontline retail cashiers.

Nexus POS solves these problems by providing a high-performance, self-contained desktop system with zero external network reliance, intuitive ergonomics, and comprehensive business management features.

---

## 4. OBJECTIVES
The core objectives of the Nexus POS system are:
- **Zero-Downtime Offline Processing**: Deliver rapid transactional capability using a local embedded database (SQLite).
- **Comprehensive Stock & Catalog Management**: Automate real-time stock deductions upon billing, low-stock threshold alerts, and automated restock workflows during invoice refunds.
- **Robust Role-Based Access Control (RBAC)**: Enforce distinct privileges between Administrator and Cashier/Staff accounts to safeguard operational finances and administrative settings.
- **Cryptographic Security**: Secure user credentials against physical data-theft using salt-based cryptographic key derivation (`scrypt`).
- **Flexible Billing & Document Generation**: Support multiple payment methods (Cash, Card, UPI), partial payments with outstanding balance tracking, barcode scanner input, and customizable document output (A4 PDF & 80mm POS Thermal Receipt).
- **Business Intelligence**: Provide immediate financial visibility through visual revenue charts, net profit calculations (Revenue vs. Operational Expenses), and customer loyalty metrics.
- **Reliability & Automated Testing**: Ensure code quality, component stability, and maintainability via automated unit and integration tests.

---

## 5. SYSTEM ARCHITECTURE & TECHNICAL STACK

### Architectural Pattern: Electron Multi-Process Architecture
The application is structured into decoupled layers communicating through an Inter-Process Communication (IPC) bridge:
- **Main Process (Node.js)**: Handles system-level operations, native file dialogs, database queries, and cryptographic security routines.
- **Renderer Process (React.js)**: Manages UI rendering, reactive state management, and user interaction.
- **Preload Bridge**: Employs Electron `contextBridge` to expose strictly typed, sandboxed API endpoints (`window.api`), preventing arbitrary script execution.

### Technical Stack:
| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Desktop Runtime** | Electron (v39.x) | Cross-platform desktop packaging with native OS integrations. |
| **Frontend Framework** | React 19 / Vite 7 | High-performance component-based UI with fast HMR. |
| **Client Routing** | React Router DOM (v7) | Single Page Application (SPA) navigation. |
| **Embedded Database** | SQLite3 (better-sqlite3 / sqlite3) | ACID-compliant, zero-configuration local embedded storage. |
| **Document Generation** | jsPDF + jsPDF-AutoTable | Client-side dynamic PDF compilation for A4 and Thermal paper. |
| **Cryptography** | Node.js `crypto` module | Native `scrypt` hashing with randomized 16-byte salts. |
| **Testing Suite** | Vitest + React Testing Library + JSDOM | Fast, automated unit and component integration testing. |
| **UI Design System** | Custom CSS / Glassmorphism / Lucide Icons | Responsive, modern dark-themed interface with accessibility. |

---

## 6. KEY FUNCTIONAL MODULES

### 1. Authentication & Role-Based Access Control (RBAC)
- Multi-tier user hierarchy: **Administrator** and **Staff/Cashier**.
- Cryptographic password protection: Passwords are salted and hashed with `scrypt` (output format `salt:derivedKey`).
- Route-level and component-level protection: Administrative controls (User Management, Financial Settings, Database Backups) are inaccessible to standard staff accounts.

### 2. Point of Sale (POS) & Checkout Terminal
- Split-screen layout displaying product catalogs alongside an active digital cart.
- Hardware barcode scanner integration via global rapid-keystroke event listeners with auto-submit on carriage return.
- Multiple payment modes (Cash, Card, Digital/UPI).
- Split-payment logic allowing partial payments, automatic change computation, and balance-due recording.
- Instant automated generation of itemized receipts in standard A4 or 80mm thermal roll configurations.

### 3. Inventory & Catalog Control
- Full CRUD operations for catalog items: SKU, Product Name, Category, Price, and Stock Quantity.
- Real-time stock decrement upon checkout completion.
- Automated restock trigger on invoice cancellation/refund.
- Visual inventory health flags (Out-of-Stock and Low-Stock warnings).

### 4. Customer Relationship Management (CRM) & Loyalty Program
- Centralized customer directory with phone number indexing.
- Seamless customer association during checkout via auto-suggest datalists.
- Dynamic loyalty points calculation incremented automatically based on total invoice expenditure.

### 5. Financial Management & Expense Tracking
- Daily operational expense logging (utilities, inventory purchases, maintenance).
- Real-time financial calculations combining gross sales, outstanding balances, and operational costs.

### 6. Executive Dashboard & Analytics
- Visual timeline graphs displaying weekly revenue performance.
- KPI summary cards tracking gross sales, pending receivables, and transaction counts.
- Automated notification banner highlighting items with stock falling at or below critical safety thresholds (Stock ≤ 5).

### 7. Data Safety & Disaster Recovery
- Local single-click database backup module executing filesystem-level SQLite clones.
- Restores business continuity without cloud synchronization overhead.

---

## 7. DATABASE DESIGN & SCHEMA

The system uses a relational SQLite database schema composed of seven core tables:

1. **`users`**: `id (PK)`, `username (UNIQUE)`, `password (HASH)`, `role`
2. **`products`**: `id (PK)`, `name`, `sku (UNIQUE)`, `price`, `stock`
3. **`invoices`**: `id (PK)`, `customer_name`, `customer_phone`, `date`, `total`, `amount_paid`, `balance_due`, `payment_method`, `status`
4. **`invoice_items`**: `id (PK)`, `invoice_id (FK)`, `product_id (FK)`, `quantity`, `price`
5. **`customers`**: `id (PK)`, `name`, `phone (UNIQUE)`, `points`
6. **`expenses`**: `id (PK)`, `description`, `amount`, `date`
7. **`settings`**: `key (PK)`, `value`

---

## 8. SECURITY & RELIABILITY CONSIDERATIONS
- **Data Protection**: Zero unencrypted passwords stored on disk.
- **Physical Isolation**: Total immunity against remote network exploits, DDoS vectors, and web API sniffing.
- **Automated QA**: Comprehensive Vitest test suite verifying interface mounting, routing isolation, and Electron API mocking.

---

## 9. FUTURE SCOPE & ENHANCEMENTS
- **Multi-Terminal LAN Sync**: Adding local network SQLite sync (or optional PostgreSQL failover) for supermarkets operating multiple counters.
- **Hardware Peripherals API**: Direct ESC/POS thermal command output and automatic kickout for physical cash drawers.
- **Barcode Label Generator**: Built-in printing tool to generate printable barcode stickers for newly registered inventory items.
- **Two-Factor Offline Verification**: Admin recovery PINs or security questions for master credential reset.

---

## 10. CONCLUSION
Nexus POS demonstrates that modern desktop retail software can achieve the aesthetic appeal and speed of web applications while retaining the robustness, security, and independence of offline desktop systems. By combining Electron, React, SQLite, and cryptographic security, Nexus POS provides a cost-effective, dependable solution tailored for real-world retail operations.
