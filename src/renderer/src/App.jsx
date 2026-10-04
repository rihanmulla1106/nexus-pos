import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './features/dashboard/Dashboard'
import Inventory from './features/inventory/Inventory'
import Billing from './features/billing/Billing'
import Login from './features/auth/Login'
import Home from './features/home/Home'
import About from './features/about/About'
import InvoiceHistory from './features/history/InvoiceHistory'

import Settings from './features/settings/Settings'
import UserManagement from './features/users/UserManagement'
import Customers from './features/crm/Customers'
import Expenses from './features/expenses/Expenses'

function App() {
  const [user, setUser] = useState(null)

  if (!user) {
    return <Login onLogin={setUser} />
  }

  return (
    <Routes>
      <Route path="/" element={<Layout user={user} onLogout={() => setUser(null)} />}>
        <Route index element={<Home user={user} />} />
        <Route path="billing" element={<Billing />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="customers" element={<Customers />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="history" element={<InvoiceHistory />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UserManagement currentUser={user} />} />
        <Route path="settings" element={<Settings />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
