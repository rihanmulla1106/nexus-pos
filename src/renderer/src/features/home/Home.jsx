import React from 'react'
import { Package, Users, Receipt, TrendingUp } from 'lucide-react'

export default function Home({ user }) {
  return (
    <div className="fade-in" style={{ padding: '24px' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>Welcome back, {user?.username}! 👋</h1>
        <p className="text-muted" style={{ marginTop: '8px' }}>Here's what's happening at Nexus POS today.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(99,102,241,0.2)', color: 'var(--primary)', padding: '16px', borderRadius: '50%' }}>
            <Receipt size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Billing</h3>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>Create new invoices</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e', padding: '16px', borderRadius: '50%' }}>
            <Package size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Inventory</h3>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>Manage your products</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(234,179,8,0.2)', color: '#eab308', padding: '16px', borderRadius: '50%' }}>
            <Users size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Customers</h3>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>View client details</p>
          </div>
        </div>
      </div>
    </div>
  )
}
