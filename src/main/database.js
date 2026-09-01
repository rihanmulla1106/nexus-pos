import sqlite3 from 'sqlite3'
import { join } from 'path'
import { app } from 'electron'

// Use verbose mode for easier debugging
const sqlite3Verbose = sqlite3.verbose()

// Path to the SQLite database file
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
      total REAL NOT NULL
    )`)

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
  })
}

// Wrapper for async queries
const runQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err)
      else resolve({ id: this.lastID, changes: this.changes })
    })
  })
}

const getQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}

export function setupIpc(ipcMain) {
  // --- Products ---
  ipcMain.handle('get-products', async () => {
    return await getQuery('SELECT * FROM products ORDER BY name ASC')
  })
  
  ipcMain.handle('add-product', async (_, product) => {
    const { name, sku, price, stock, description } = product
    const finalSku = sku === '' ? null : sku
    return await runQuery(
      'INSERT INTO products (name, sku, price, stock, description) VALUES (?, ?, ?, ?, ?)',
      [name, finalSku, price, stock, description]
    )
  })

  ipcMain.handle('update-product', async (_, id, product) => {
    const { name, sku, price, stock, description } = product
    const finalSku = sku === '' ? null : sku
    return await runQuery(
      'UPDATE products SET name=?, sku=?, price=?, stock=?, description=? WHERE id=?',
      [name, finalSku, price, stock, description, id]
    )
  })

  ipcMain.handle('delete-product', async (_, id) => {
    return await runQuery('DELETE FROM products WHERE id=?', [id])
  })

  // --- Invoices ---
  ipcMain.handle('create-invoice', async (_, invoiceData) => {
    const { customer_name, date, total, items } = invoiceData
    
    // Create invoice
    const invResult = await runQuery(
      'INSERT INTO invoices (customer_name, date, total) VALUES (?, ?, ?)',
      [customer_name, date, total]
    )
    const invoiceId = invResult.id

    // Create items and reduce stock
    for (const item of items) {
      await runQuery(
        'INSERT INTO invoice_items (invoice_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [invoiceId, item.product_id, item.quantity, item.price]
      )
      // Decrease stock
      await runQuery(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      )
    }
    return { success: true, invoiceId }
  })

  ipcMain.handle('get-invoices', async () => {
    return await getQuery('SELECT * FROM invoices ORDER BY id DESC')
  })
}

export default db

