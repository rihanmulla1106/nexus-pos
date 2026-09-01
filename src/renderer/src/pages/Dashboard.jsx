import React, { useEffect, useState } from 'react'
import { Package, AlertCircle, IndianRupee, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    totalSales: 0,
    recentInvoices: []
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const products = await window.api.getProducts()
        const invoices = await window.api.getInvoices()

        const totalSales = invoices.reduce((sum, inv) => sum + inv.total, 0)
        const lowStock = products.filter(p => p.stock < 5).length

        setStats({
          totalProducts: products.length,
          lowStock,
          totalSales,
          recentInvoices: invoices.slice(0, 5) // Top 5
        })
      } catch (error) {
        console.error("Failed to load dashboard data", error)
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '50%', color: 'var(--primary)' }}>
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '4px' }}>Total Sales</p>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700 }}>₹{stats.totalSales.toFixed(2)}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '50%', color: 'var(--secondary)' }}>
            <Package size={28} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '4px' }}>Total Products</p>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700 }}>{stats.totalProducts}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '50%', color: 'var(--danger)' }}>
            <AlertCircle size={28} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '4px' }}>Low Stock Items</p>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700 }}>{stats.lowStock}</h3>
          </div>
        </div>

      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ marginBottom: '16px', fontWeight: 600 }}>Recent Sales</h3>
        {stats.recentInvoices.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Customer Name</th>
                <th>Date</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentInvoices.map(inv => (
                <tr key={inv.id}>
                  <td>INV-{inv.id.toString().padStart(4, '0')}</td>
                  <td>{inv.customer_name || 'Walk-in Customer'}</td>
                  <td>{new Date(inv.date).toLocaleString()}</td>
                  <td style={{ fontWeight: 600 }}>₹{inv.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-muted">No sales recorded yet.</p>
        )}
      </div>
    </div>
  )
}
