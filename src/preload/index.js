import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  getProducts: () => ipcRenderer.invoke('get-products'),
  addProduct: (product) => ipcRenderer.invoke('add-product', product),
  updateProduct: (id, product) => ipcRenderer.invoke('update-product', id, product),
  deleteProduct: (id) => ipcRenderer.invoke('delete-product', id),
  createInvoice: (invoiceData) => ipcRenderer.invoke('create-invoice', invoiceData),
  getInvoices: () => ipcRenderer.invoke('get-invoices'),
  login: (username, password) => ipcRenderer.invoke('login', username, password),
  getCustomers: () => ipcRenderer.invoke('get-customers'),
  addCustomer: (data) => ipcRenderer.invoke('add-customer', data),
  getExpenses: () => ipcRenderer.invoke('get-expenses'),
  addExpense: (data) => ipcRenderer.invoke('add-expense', data),
  backupDatabase: () => ipcRenderer.invoke('backup-database'),
  addUser: (data) => ipcRenderer.invoke('add-user', data),
  getUsers: () => ipcRenderer.invoke('get-users'),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
  cancelInvoice: (id) => ipcRenderer.invoke('cancel-invoice', id),
  deleteCustomer: (id) => ipcRenderer.invoke('delete-customer', id),
  deleteExpense: (id) => ipcRenderer.invoke('delete-expense', id)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
