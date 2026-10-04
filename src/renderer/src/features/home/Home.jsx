import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Store, Receipt, Package, Users, TrendingUp, TrendingDown, Clock } from 'lucide-react'

export default function Home({ user }) {
  const [greeting, setGreeting] = useState('Welcome')
  const [storeName, setStoreName] = useState('Nexus')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good Morning')
    else if (hour < 18) setGreeting('Good Afternoon')
    else setGreeting('Good Evening')

    window.api.getSettings().then(s => {
      if (s.store_name) setStoreName(s.store_name)
    })
  }, [])

  return (
    <div className="fade-in" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
        border: '1px solid rgba(168, 85, 247, 0.2)',
        borderRadius: '24px', 
        padding: '48px', 
        marginBottom: '40px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Abstract Background Shapes */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'var(--primary)', filter: 'blur(100px)', opacity: 0.3, borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-50px', left: '20%', width: '150px', height: '150px', background: '#a855f7', filter: 'blur(100px)', opacity: 0.2, borderRadius: '50%' }}></div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', padding: '24px', borderRadius: '24px', boxShadow: '0 12px 32px rgba(99, 102, 241, 0.3)' }}>
            <Store size={64} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '3rem', fontWeight: 900, margin: '0 0 8px 0', background: 'linear-gradient(to right, #fff, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {greeting}, {user.username}!
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', margin: 0 }}>
              Welcome back to <strong style={{ color: 'white' }}>{storeName}</strong>. You are logged in as {user.role}.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', fontWeight: 700 }}>Quick Actions</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        
        {/* Billing Card */}
        <Link to="/billing" style={{ textDecoration: 'none' }}>
          <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'all 0.3s', cursor: 'pointer' }}
               onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'var(--primary)' }}
               onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--glass-border)' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '20px', borderRadius: '50%', marginBottom: '16px', color: 'var(--primary)' }}>
              <Receipt size={40} />
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', color: 'white' }}>Start Billing</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Open the POS terminal for a new checkout.</p>
          </div>
        </Link>

        {/* Inventory Card */}
        <Link to="/inventory" style={{ textDecoration: 'none' }}>
          <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'all 0.3s', cursor: 'pointer' }}
               onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = '#22c55e' }}
               onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--glass-border)' }}>
            <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '20px', borderRadius: '50%', marginBottom: '16px', color: '#22c55e' }}>
              <Package size={40} />
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', color: 'white' }}>Manage Stock</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Update your inventory and add new items.</p>
          </div>
        </Link>

        {/* Dashboard Card */}
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'all 0.3s', cursor: 'pointer' }}
               onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = '#a855f7' }}
               onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--glass-border)' }}>
            <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '20px', borderRadius: '50%', marginBottom: '16px', color: '#a855f7' }}>
              <TrendingUp size={40} />
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', color: 'white' }}>Analytics</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>View today's revenue and sales reports.</p>
          </div>
        </Link>

        {/* Recent History Card */}
        <Link to="/history" style={{ textDecoration: 'none' }}>
          <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'all 0.3s', cursor: 'pointer' }}
               onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = '#eab308' }}
               onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--glass-border)' }}>
            <div style={{ background: 'rgba(234, 179, 8, 0.1)', padding: '20px', borderRadius: '50%', marginBottom: '16px', color: '#eab308' }}>
              <Clock size={40} />
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', color: 'white' }}>Invoice History</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Reprint past receipts and process refunds.</p>
          </div>
        </Link>

      </div>
    </div>
  )
}
