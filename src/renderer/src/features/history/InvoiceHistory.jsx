import React, { useState, useEffect } from 'react'
import { History, XCircle } from 'lucide-react'

export default function InvoiceHistory() {
  const [invoices, setInvoices] = useState([])
  const [settings, setSettings] = useState({ currency: '₹' })
  
  useEffect(() => {
    loadInvoices()
    window.api.getSettings().then(s => setSettings(prev => ({ ...prev, ...s })))
  }, [])

  const loadInvoices = () => window.api.getInvoices().then(setInvoices)

  const handleCancel = async (id) => {
    if (confirm("Are you sure you want to cancel this invoice? This will refund the amount and return items to stock.")) {
      try {
        await window.api.cancelInvoice(id)
        alert("Invoice cancelled successfully!")
        loadInvoices()
      } catch (err) {
        alert("Error cancelling invoice.")
      }
    }
  }

  const curr = settings.currency

  return (
    <div className="fade-in" style={{ padding: '24px' }}>
      <header style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <History size={32} /> Invoice History
          </h1>
          <p className="text-muted" style={{ marginTop: '8px' }}>View transactions or process refunds.</p>
        </div>
      </header>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '16px' }}>ID</th>
              <th style={{ padding: '16px' }}>Date</th>
              <th style={{ padding: '16px' }}>Customer</th>
              <th style={{ padding: '16px' }}>Total</th>
              <th style={{ padding: '16px' }}>Paid / Due</th>
              <th style={{ padding: '16px' }}>Method</th>
              <th style={{ padding: '16px' }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', opacity: inv.status === 'Refunded' ? 0.6 : 1 }}>
                <td style={{ padding: '16px', fontWeight: 'bold' }}>INV-{inv.id.toString().padStart(4, '0')}</td>
                <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{new Date(inv.date).toLocaleDateString()}</td>
                <td style={{ padding: '16px' }}>{inv.customer_name || 'Walk-in'}</td>
                <td style={{ padding: '16px', fontWeight: 'bold' }}>{curr}{inv.total.toFixed(2)}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ color: '#22c55e' }}>{curr}{inv.amount_paid?.toFixed(2)}</span> / 
                  <span style={{ color: inv.balance_due > 0 ? '#ef4444' : 'var(--text-muted)' }}> {curr}{inv.balance_due?.toFixed(2)}</span>
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                    {inv.payment_method}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    color: inv.status === 'Paid' ? '#22c55e' : inv.status === 'Refunded' ? '#ef4444' : '#eab308',
                    background: inv.status === 'Paid' ? 'rgba(34,197,94,0.1)' : inv.status === 'Refunded' ? 'rgba(239,68,68,0.1)' : 'rgba(234,179,8,0.1)',
                    padding: '6px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold'
                  }}>
                    {inv.status}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  {inv.status !== 'Refunded' && (
                    <button onClick={() => handleCancel(inv.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', margin: '0 auto' }}>
                      <XCircle size={18} /> Refund
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan="8" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
