import sqlite3 from 'sqlite3'
import { join } from 'path'
import { app } from 'electron'

const sqlite3Verbose = sqlite3.verbose()
const dbPath = join(app.getPath('userData'), 'inventory_billing.db')

const db = new sqlite3Verbose.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message)
  } else {
    console.log('Connected to the SQLite database at', dbPath)
    initDb()
  }
})

function initDb() {
  db.serialize(() => {
    // Products Table
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      sku TEXT UNIQUE,
      price REAL NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      description TEXT
    )`)

    // Invoices Table
    db.run(`CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT,
      date TEXT NOT NULL,
      total REAL NOT NULL,
      amount_paid REAL DEFAULT 0,
      balance_due REAL DEFAULT 0,
      payment_method TEXT DEFAULT 'Cash',
      status TEXT DEFAULT 'Paid'
    )`)
    
    // Quick SQLite migrations for existing DBs
    db.run(`ALTER TABLE invoices ADD COLUMN amount_paid REAL DEFAULT 0`, () => {})
    db.run(`ALTER TABLE invoices ADD COLUMN balance_due REAL DEFAULT 0`, () => {})
    db.run(`ALTER TABLE invoices ADD COLUMN payment_method TEXT DEFAULT 'Cash'`, () => {})
    db.run(`ALTER TABLE invoices ADD COLUMN status TEXT DEFAULT 'Paid'`, () => {})

    // Invoice Items Table
    db.run(`CREATE TABLE IF NOT EXISTS invoice_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY(invoice_id) REFERENCES invoices(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
    )`)

    // Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL
    )`)

    // Customers Table (CRM)
    db.run(`CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT UNIQUE,
      points INTEGER DEFAULT 0
    )`)

    // Expenses Table
    db.run(`CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL
    )`)

    // Seed default admin if no users exist
    db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
      if (!err && row.count === 0) {
        const crypto = require('crypto')
        const salt = crypto.randomBytes(16).toString('hex')
        const key = crypto.scryptSync('admin123', salt, 64).toString('hex')
        const hash = `${salt}:${key}`
        db.run(`INSERT INTO users (username, password, role) VALUES ('admin', ?, 'admin')`, [hash])
      }
    })

    // Settings Table
    db.run(`CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )`)
    
    // Seed default settings
    db.get('SELECT COUNT(*) as count FROM settings', (err, row) => {
      if (!err && row.count === 0) {
        db.run(`INSERT INTO settings (key, value) VALUES ('store_name', 'Nexus POS')`)
        db.run(`INSERT INTO settings (key, value) VALUES ('currency', '₹')`)
        db.run(`INSERT INTO settings (key, value) VALUES ('tax_rate', '0')`)
      }
    })
  })
}

export const runQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err)
      else resolve({ id: this.lastID, changes: this.changes })
    })
  })
}

export const getQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}

export default db
