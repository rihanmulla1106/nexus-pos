# Nexus POS - Data Flow Diagrams (DFD) & Entity Relationship Diagram (ERD)

This document provides formal architectural models (**DFD Level 0, Level 1, Level 2** and **ERD with Data Dictionary**) for academic reports, system design specifications, and professor reviews.

---

## 1. ENTITY RELATIONSHIP DIAGRAM (ERD)

The relational schema is normalized and stored locally in SQLite (`inventory_billing.db`).

```mermaid
erDiagram
    CUSTOMERS ||--o{ INVOICES : "places / identified_by"
    INVOICES ||--|{ INVOICE_ITEMS : "contains"
    PRODUCTS ||--o{ INVOICE_ITEMS : "included_in"
    
    USERS {
        int id PK "Auto Increment"
        string username "Unique account name"
        string password "Salted scrypt hash (salt:derivedKey)"
        string role "Admin or Staff"
    }

    PRODUCTS {
        int id PK "Auto Increment"
        string name "Product label"
        string sku "Unique barcode / SKU"
        real price "Unit selling price"
        int stock "Available inventory count"
    }

    CUSTOMERS {
        int id PK "Auto Increment"
        string name "Customer name"
        string phone "Unique phone number"
        int points "Accrued loyalty points"
    }

    INVOICES {
        int id PK "Auto Increment"
        string customer_name "Customer reference"
        string customer_phone "Customer phone FK"
        string date "ISO-8601 transaction timestamp"
        real total "Grand total including tax"
        real amount_paid "Amount tendered by customer"
        real balance_due "Unpaid balance / Credit"
        string payment_method "Cash / Card / UPI"
        string status "Paid / Partial / Refunded"
    }

    INVOICE_ITEMS {
        int id PK "Auto Increment"
        int invoice_id FK "References INVOICES(id)"
        int product_id FK "References PRODUCTS(id)"
        int quantity "Units sold"
        real price "Unit price at time of sale"
    }

    EXPENSES {
        int id PK "Auto Increment"
        string description "Expense description"
        real amount "Amount spent"
        string date "ISO-8601 expense timestamp"
    }

    SETTINGS {
        string key PK "Configuration key (store_name, tax_rate, currency)"
        string value "Configuration value"
    }
```

### Relational Cardinalities:
- **`CUSTOMERS` to `INVOICES`** ($1 : N$): A registered customer can have zero or many invoices.
- **`INVOICES` to `INVOICE_ITEMS`** ($1 : N$): An invoice must have one or more line items.
- **`PRODUCTS` to `INVOICE_ITEMS`** ($1 : N$): A product can appear as a line item across multiple invoices.
- **`EXPENSES` & `SETTINGS`**: Standalone operational entities.

---

## 2. DATA DICTIONARY

| Table | Attribute | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| **`users`** | `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique user identifier |
| | `username` | TEXT | UNIQUE, NOT NULL | Account login username |
| | `password` | TEXT | NOT NULL | Salted scrypt cryptographic hash (`<salt>:<hash>`) |
| | `role` | TEXT | NOT NULL | RBAC permission level (`admin`, `staff`) |
| **`products`**| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique product identifier |
| | `name` | TEXT | NOT NULL | Name/Description of product |
| | `sku` | TEXT | UNIQUE | Barcode number / unique SKU |
| | `price` | REAL | NOT NULL | Selling price per item |
| | `stock` | INTEGER | NOT NULL, DEFAULT 0 | Available stock on hand |
| **`invoices`**| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Invoice number (e.g., INV-0001) |
| | `customer_name` | TEXT | NULLABLE | Associated customer name |
| | `customer_phone`| TEXT | NULLABLE | Associated customer phone |
| | `date` | TEXT | NOT NULL | Timestamp of transaction |
| | `total` | REAL | NOT NULL | Final invoice total (Subtotal + Tax) |
| | `amount_paid` | REAL | NOT NULL | Actual money tendered by customer |
| | `balance_due` | REAL | NOT NULL, DEFAULT 0 | Outstanding balance |
| | `payment_method`| TEXT | NOT NULL | Payment instrument (`Cash`, `Card`, `UPI`) |
| | `status` | TEXT | NOT NULL | Invoice status (`Paid`, `Partial`, `Refunded`) |
| **`invoice_items`** | `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Item transaction record ID |
| | `invoice_id` | INTEGER | FOREIGN KEY (`invoices.id`) | Linked parent invoice |
| | `product_id` | INTEGER | FOREIGN KEY (`products.id`) | Linked product |
| | `quantity` | INTEGER | NOT NULL | Number of units purchased |
| | `price` | REAL | NOT NULL | Snapshot unit price at sale time |
| **`customers`**| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique customer identifier |
| | `name` | TEXT | NOT NULL | Full name of customer |
| | `phone` | TEXT | UNIQUE, NOT NULL | Primary contact phone number |
| | `points` | INTEGER | NOT NULL, DEFAULT 0 | Accrued loyalty reward points |
| **`expenses`** | `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Expense entry ID |
| | `description`| TEXT | NOT NULL | Description of cost |
| | `amount` | REAL | NOT NULL | Financial expenditure value |
| | `date` | TEXT | NOT NULL | Timestamp of expense |
| **`settings`** | `key` | TEXT | PRIMARY KEY | Configuration key |
| | `value` | TEXT | NOT NULL | System value string |

---

## 3. DFD LEVEL 0: CONTEXT DIAGRAM

The Context Diagram defines the system boundary, external entities, and high-level data flows.

```mermaid
flowchart TD
    subgraph ExternalEntities [External Entities]
        Admin["Administrator"]
        Staff["Staff / Cashier"]
        Customer["Customer"]
    end

    System["0.0<br/>Nexus POS System"]

    %% Admin flows
    Admin -->|"Credentials, Product Info, Staff Setup, Store Settings, Expense Records"| System
    System -->|"Analytics Reports, Low-Stock Warnings, Backup DB File"| Admin

    %% Staff flows
    Staff -->|"Credentials, Barcode Scans, Cart Items, Tendered Payment"| System
    System -->|"Receipts (A4 / Thermal), Change Due, Stock Availability"| Staff

    %% Customer flows
    Customer -->|"Contact Phone, Tendered Payment"| System
    System -->|"Itemized Invoice Receipt, Loyalty Points Balance"| Customer
```

---

## 4. DFD LEVEL 1: DETAILED PROCESS DECOMPOSITION

Level 1 breaks the system into sub-processes and shows their interactions with internal SQLite Data Stores.

```mermaid
flowchart TD
    %% External Entities
    E1["Administrator"]
    E2["Staff / Cashier"]
    E3["Customer"]

    %% Data Stores
    D1[("D1: users")]
    D2[("D2: products")]
    D3[("D3: invoices & invoice_items")]
    D4[("D4: customers")]
    D5[("D5: expenses")]
    D6[("D6: settings")]

    %% Processes
    P1["1.0<br/>Authentication & RBAC"]
    P2["2.0<br/>Inventory & Catalog Management"]
    P3["3.0<br/>POS & Checkout Terminal"]
    P4["4.0<br/>CRM & Loyalty Points Calculation"]
    P5["5.0<br/>Expense Tracking & Financials"]
    P6["6.0<br/>Reporting & Analytics"]
    P7["7.0<br/>Store Configuration & Database Backup"]

    %% 1.0 Auth
    E1 -->|"Admin Login (username, password)"| P1
    E2 -->|"Staff Login (username, password)"| P1
    P1 <-->|"Verify scrypt Hash / Retrieve Role"| D1
    P1 -->|"Access Granted / Session"| E1
    P1 -->|"Access Granted / Session"| E2

    %% 2.0 Inventory
    E1 -->|"Add / Update / Delete Product"| P2
    P2 <-->|"Write / Read Inventory"| D2
    P2 -->|"Stock Status"| E1

    %% 3.0 POS & Billing
    E2 -->|"Scan Barcode / Select Items"| P3
    P3 <-->|"Lookup Price & Check Stock"| D2
    P3 -->|"Deduct Stock on Sale / Restock on Refund"| D2
    P3 -->|"Save Invoice & Line Items"| D3
    P3 <-->|"Fetch Tax Rate & Currency"| D6
    P3 -->|"Generate A4 / Thermal PDF Receipt"| E2
    E2 -->|"Deliver Printed Bill"| E3

    %% 4.0 CRM & Loyalty
    E3 -->|"Provide Phone Number"| P3
    P3 -->|"Trigger Points Update"| P4
    E1 -->|"Manage Customers"| P4
    P4 <-->|"Add Customer / Increment Points"| D4

    %% 5.0 Expenses
    E1 -->|"Log Operational Expense"| P5
    P5 -->|"Record Expense Entry"| D5

    %% 6.0 Reporting & Analytics
    P6 <-->|"Fetch Invoices & Revenue"| D3
    P6 <-->|"Fetch Stock for Low-Stock Alerts"| D2
    P6 <-->|"Fetch Operating Expenses"| D5
    P6 -->|"Net Profit, Revenue Graph, Alerts"| E1

    %% 7.0 Settings & Backup
    E1 -->|"Update Tax / Store Name"| P7
    P7 -->|"Persist Settings"| D6
    E1 -->|"Trigger Local Backup"| P7
    P7 -->|"Export SQLite .db Snapshot"| E1
```

---

## 5. DFD LEVEL 2: POS CHECKOUT & INVOICING SUB-PROCESS

A granular breakdown of Process 3.0 (Point of Sale & Billing).

```mermaid
flowchart TD
    Cashier["Cashier / Barcode Scanner"]
    D2[("D2: products")]
    D3[("D3: invoices")]
    D4[("D4: customers")]
    D6[("D6: settings")]

    P31["3.1<br/>Input Product SKU / Barcode"]
    P32["3.2<br/>Stock & Price Verification"]
    P33["3.3<br/>Calculate Subtotal, Tax & Total"]
    P34["3.4<br/>Process Payment & Split Dues"]
    P35["3.5<br/>Deduct Stock & Persist Invoice"]
    P36["3.6<br/>Credit Loyalty Points"]
    P37["3.7<br/>Render PDF Receipt (A4 / 80mm)"]

    Cashier -->|"Scan Barcode / Select Item"| P31
    P31 -->|"SKU Query"| P32
    P32 <-->|"Check Stock > 0 & Get Price"| D2
    P32 -->|"Item Validated"| P33
    P33 <-->|"Apply Tax Rate"| D6
    P33 -->|"Total Amount"| P34
    Cashier -->|"Tendered Cash / Card / UPI"| P34
    P34 -->|"Finalized Transaction"| P35
    P35 -->|"Decrement Stock by Qty"| D2
    P35 -->|"Insert Invoice & Items"| D3
    P35 -->|"Customer Phone"| P36
    P36 -->|"Increment Points (+1 per $ spent)"| D4
    P35 -->|"Trigger Document Generator"| P37
    P37 -->|"Printable Invoice PDF"| Cashier
```
