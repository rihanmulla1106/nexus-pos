import { runQuery, getQuery } from '../config/database.js'

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
    const { customer_name, date, total, items, amount_paid, balance_due, payment_method, status } = invoiceData
    
    // Create invoice
    const invResult = await runQuery(
      'INSERT INTO invoices (customer_name, date, total, amount_paid, balance_due, payment_method, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [customer_name, date, total, amount_paid || total, balance_due || 0, payment_method || 'Cash', status || 'Paid']
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

  // --- Customers (CRM) ---
  ipcMain.handle('get-customers', async () => await getQuery('SELECT * FROM customers ORDER BY name ASC'))
  ipcMain.handle('add-customer', async (_, data) => {
    return await runQuery('INSERT INTO customers (name, phone, points) VALUES (?, ?, 0)', [data.name, data.phone])
  })

  // --- Expenses ---
  ipcMain.handle('get-expenses', async () => await getQuery('SELECT * FROM expenses ORDER BY date DESC'))
  ipcMain.handle('add-expense', async (_, data) => {
    return await runQuery('INSERT INTO expenses (description, amount, date) VALUES (?, ?, ?)', [data.description, data.amount, data.date])
  })

  // --- Database Backup ---
  ipcMain.handle('backup-database', async () => {
    const { dialog, app } = require('electron')
    const fs = require('fs')
    const path = require('path')
    
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Backup Database',
      defaultPath: 'nexus_pos_backup.db',
      filters: [{ name: 'Database File', extensions: ['db'] }]
    })
    
    if (canceled || !filePath) return { success: false, message: 'Cancelled' }
    
    try {
      const dbPath = path.join(app.getPath('userData'), 'inventory_billing.db')
      fs.copyFileSync(dbPath, filePath)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message }
    }
  })

  // --- Auth & Users ---
  ipcMain.handle('login', async (_, username, password) => {
    const users = await getQuery('SELECT * FROM users WHERE username = ?', [username])
    if (users.length > 0) {
      const user = users[0]
      const parts = user.password.split(':')
      
      // Check if it is a hashed password
      if (parts.length === 2) {
        const crypto = require('crypto')
        const [salt, key] = parts
        const keyBuffer = Buffer.from(key, 'hex')
        const derivedKey = crypto.scryptSync(password, salt, 64)
        
        if (crypto.timingSafeEqual(keyBuffer, derivedKey)) {
          return { success: true, user: { id: user.id, username: user.username, role: user.role } }
        }
      } else {
        // Fallback for older plaintext passwords (legacy support)
        if (user.password === password) {
          return { success: true, user: { id: user.id, username: user.username, role: user.role } }
        }
      }
    }
    return { success: false, message: 'Invalid username or password' }
  })

  ipcMain.handle('add-user', async (_, data) => {
    const crypto = require('crypto')
    const salt = crypto.randomBytes(16).toString('hex')
    const key = crypto.scryptSync(data.password, salt, 64).toString('hex')
    const hash = `${salt}:${key}`
    return await runQuery('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [data.username, hash, data.role])
  })

  ipcMain.handle('get-users', async () => {
    const users = await getQuery('SELECT id, username, role FROM users ORDER BY id ASC')
    return users
  })

  // --- Settings ---
  ipcMain.handle('get-settings', async () => {
    const rows = await getQuery('SELECT * FROM settings')
    const settings = {}
    rows.forEach(r => settings[r.key] = r.value)
    return settings
  })
  
  ipcMain.handle('save-settings', async (_, settings) => {
    for (const [key, value] of Object.entries(settings)) {
      await runQuery('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value', [key, String(value)])
    }
    return { success: true }
  })

  // --- Refunds & Deletions ---
  ipcMain.handle('cancel-invoice', async (_, invoiceId) => {
    const items = await getQuery('SELECT product_id, quantity FROM invoice_items WHERE invoice_id = ?', [invoiceId])
    for (const item of items) {
      await runQuery('UPDATE products SET stock = stock + ? WHERE id = ?', [item.quantity, item.product_id])
    }
    return await runQuery('UPDATE invoices SET status = ? WHERE id = ?', ['Refunded', invoiceId])
  })

  ipcMain.handle('delete-customer', async (_, id) => await runQuery('DELETE FROM customers WHERE id = ?', [id]))
  ipcMain.handle('delete-expense', async (_, id) => await runQuery('DELETE FROM expenses WHERE id = ?', [id]))
}
