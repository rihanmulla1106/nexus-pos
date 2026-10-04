import '@testing-library/jest-dom'

// Mock the Electron IPC bridge globally for all tests
window.api = {
  getSettings: () => Promise.resolve({ store_name: 'Nexus Test Store', currency: '$', tax_rate: '0' }),
  getProducts: () => Promise.resolve([{ id: 1, name: 'Test Product', price: 10, stock: 100 }]),
  getCustomers: () => Promise.resolve([]),
  getInvoices: () => Promise.resolve([])
}
