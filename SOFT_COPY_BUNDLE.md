# NEXUS POS - SOFT COPY SUBMISSION BUNDLE

This document outlines the complete digital delivery package (**Soft Copy**) for submission to your college department, evaluation committee, or professor.

---

## 1. SOFT COPY DIRECTORY STRUCTURE (FOR CD / USB / ZIP)

Organize your submission folder or flash drive using this standard academic directory structure:

```text
📁 Nexus_POS_Final_Submission/
│
├── 📁 01_Executable_Installer/
│   ├── app-1.0.0-setup.exe          <-- (Windows 1-click standalone installer, 105MB)
│   └── Installation_Guide.txt       <-- (Instructions to run and test without coding tools)
│
├── 📁 02_Source_Code/
│   ├── package.json
│   ├── electron.vite.config.mjs
│   ├── vitest.config.mjs
│   └── src/                         <-- (Full React frontend & Electron main process source)
│
├── 📁 03_Documentation/
│   ├── Project_Report.pdf           <-- (Print/Save from PROJECT_REPORT_PRINTABLE.html)
│   ├── Project_Synopsis.pdf         <-- (Exported from PROJECT_SYNOPSIS.md)
│   ├── DFD_and_ERD_Diagrams.pdf     <-- (Architectural diagrams and data dictionary)
│   └── README.md                    <-- (Project portfolio documentation)
│
├── 📁 04_Database_Backup/
│   └── inventory_billing.db         <-- (SQLite sample database with seeded admin & catalog)
│
└── 📁 05_Test_Reports/
    └── automated_test_results.txt   <-- (Vitest execution log verifying 100% test pass)
```

---

## 2. OFFICIAL DIGITAL LINKS (SOFT COPY REPOSITORIES)

| Asset | Link / Location |
| :--- | :--- |
| **GitHub Source Code Repository** | [https://github.com/rihanmulla1106/nexus-pos](https://github.com/rihanmulla1106/nexus-pos) |
| **Compiled Windows Installer (.exe)** | Located locally at: `D:\inventory billing sys\app\dist\app-1.0.0-setup.exe` |
| **Public GitHub Releases** | [https://github.com/rihanmulla1106/nexus-pos/releases](https://github.com/rihanmulla1106/nexus-pos/releases) |

---

## 3. DEFAULT LOGIN CREDENTIALS FOR EXAMINER / EVALUATOR

Provide this in your submission note so the professor can immediately evaluate the system:

- **Admin Account**:
  - **Username**: `admin`
  - **Password**: `admin123`
  - *(Access to full system: POS, Catalog, User Management, Expenses, Backups, and Settings)*

- **Staff Account**:
  - Can be created directly under **User Management** (e.g. `cashier1` / `staff123`).
  - *(Restricted POS access; administrative routes are blocked)*

---

## 4. HOW TO EXECUTE FROM SOFT COPY

### Method A: Running the Standalone Executable (No setup needed)
1. Double-click `01_Executable_Installer/app-1.0.0-setup.exe`.
2. Follow the standard Windows wizard.
3. Launch "Nexus POS" directly from the Desktop icon.

### Method B: Running from Source Code
1. Open terminal inside `02_Source_Code/`.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the Electron developer environment.
4. Run `npm run test` to execute the automated Vitest test suite.
