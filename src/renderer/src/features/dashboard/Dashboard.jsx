import React, { useState, useEffect } from 'react'
import { TrendingUp, Package, Users, AlertTriangle } from 'lucide-react'

export default function Dashboard() {
  const [invoices, setInvoices] = useState([])
  const [products, setProducts] = useState([])
  const [settings, setSettings] = useState({ currency: '₹' })
  
  useEffect(() => {
    window.api.getInvoices().then(setInvoices)
    window.api.getProducts().then(setProducts)
    window.api.getSettings().then(s => setSettings(prev => ({ ...prev, ...s })))
  }, [])

  // Filter out refunded invoices from totals
  const validInvoices = invoices.filter(inv => inv.status !== 'Refunded')
  const totalRevenue = validInvoices.reduce((sum, inv) => sum + inv.total, 0)
  const totalDue = validInvoices.reduce((sum, inv) => sum + (inv.balance_due || 0), 0)
  const curr = settings.currency

  const lowStockProducts = products.filter(p => p.stock <= 5)

  return (
    <div className="fade-in" style={{ padding: '24px' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <TrendingUp size={32} /> Analytics Dashboard
        </h1>
        <p className="text-muted">Business performance at a glance.</p>
      </header>

      {lowStockProducts.length > 0 && (
        <div style={{ background: 'rgba(234, 179, 8, 0.1)', border: '1px solid #eab308', padding: '16px', borderRadius: '12px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px', color: '#eab308' }}>
          <AlertTriangle size={24} />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Low Stock Alert</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>You have {lowStockProducts.length} product(s) running low on inventory (Stock &le; 5).</p>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div className="text-muted" style={{ marginBottom: '8px', fontSize: '0.9rem' }}>Gross Revenue</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary)' }}>{curr}{totalRevenue.toFixed(2)}</div>
        </div>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div className="text-muted" style={{ marginBottom: '8px', fontSize: '0.9rem' }}>Pending Dues</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#ef4444' }}>{curr}{totalDue.toFixed(2)}</div>
        </div>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div className="text-muted" style={{ marginBottom: '8px', fontSize: '0.9rem' }}>Total Sales (Count)</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#22c55e' }}>{validInvoices.length}</div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ marginBottom: '24px' }}>Recent Revenue Timeline</h3>
        <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '16px', padding: '16px 0', borderBottom: '1px solid var(--surface-border)' }}>
          {[60, 80, 40, 90, 70, 100, 50].map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h}%`, background: 'var(--primary)', borderRadius: '4px 4px 0 0', opacity: 0.8, transition: 'all 0.3s' }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
        </div>
      </div>
    </div>
  )
}
