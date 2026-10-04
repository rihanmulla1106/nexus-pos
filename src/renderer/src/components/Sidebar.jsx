import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, Receipt, LogOut, Users, TrendingDown } from 'lucide-react'

export default function Sidebar({ user, onLogout }) {
  return (
    <aside className="glass-panel" style={{ width: '260px', borderRadius: 0, borderRight: 'var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>Nexus POS</h2>
        <p className="text-muted" style={{ fontSize: '0.8rem' }}>Inventory & Billing</p>
      </div>

      <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
        <NavLink to="/" style={({ isActive }) => ({
          display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
          borderRadius: '8px', color: isActive ? 'white' : 'var(--text-muted)',
          background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
          fontWeight: isActive ? 600 : 400, transition: 'all 0.2s'
        })}>
          <LayoutDashboard size={20} /> Home
        </NavLink>

        <NavLink to="/billing" style={({ isActive }) => ({
          display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
          borderRadius: '8px', color: isActive ? 'white' : 'var(--text-muted)',
          background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
          fontWeight: isActive ? 600 : 400, transition: 'all 0.2s'
        })}>
          <Receipt size={20} /> Point of Sale
        </NavLink>

        <NavLink to="/inventory" style={({ isActive }) => ({
          display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
          borderRadius: '8px', color: isActive ? 'white' : 'var(--text-muted)',
          background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
          fontWeight: isActive ? 600 : 400, transition: 'all 0.2s'
        })}>
          <Package size={20} /> Inventory
        </NavLink>
        
        <NavLink to="/customers" style={({ isActive }) => ({
          display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
          borderRadius: '8px', color: isActive ? 'white' : 'var(--text-muted)',
          background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
          fontWeight: isActive ? 600 : 400, transition: 'all 0.2s'
        })}>
          <Users size={20} /> Customers
        </NavLink>

        <NavLink to="/history" style={({ isActive }) => ({
          display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
          borderRadius: '8px', color: isActive ? 'white' : 'var(--text-muted)',
          background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
          fontWeight: isActive ? 600 : 400, transition: 'all 0.2s'
        })}>
          <Receipt size={20} /> Invoice History
        </NavLink>

        <NavLink to="/expenses" style={({ isActive }) => ({
          display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
          borderRadius: '8px', color: isActive ? 'white' : 'var(--text-muted)',
          background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
          fontWeight: isActive ? 600 : 400, transition: 'all 0.2s'
        })}>
          <TrendingDown size={20} /> Expenses
        </NavLink>

        <NavLink to="/dashboard" style={({ isActive }) => ({
          display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
          borderRadius: '8px', color: isActive ? 'white' : 'var(--text-muted)',
          background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
          fontWeight: isActive ? 600 : 400, transition: 'all 0.2s'
        })}>
          <LayoutDashboard size={20} /> Analytics
        </NavLink>

        {user?.role === 'admin' && (
          <NavLink to="/users" style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
            borderRadius: '8px', color: isActive ? 'white' : 'var(--text-muted)',
            background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
            fontWeight: isActive ? 600 : 400, transition: 'all 0.2s'
          })}>
            <LayoutDashboard size={20} /> User Management
          </NavLink>
        )}

        <NavLink to="/settings" style={({ isActive }) => ({
          display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
          borderRadius: '8px', color: isActive ? 'white' : 'var(--text-muted)',
          background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
          fontWeight: isActive ? 600 : 400, transition: 'all 0.2s'
        })}>
          <Package size={20} /> Settings
        </NavLink>
        
        <NavLink to="/about" style={({ isActive }) => ({
          display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
          borderRadius: '8px', color: isActive ? 'white' : 'var(--text-muted)',
          background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
          fontWeight: isActive ? 600 : 400, transition: 'all 0.2s'
        })}>
          <Package size={20} /> About
        </NavLink>
      </nav>
      
      <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'white' }}>{user?.username}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role}</div>
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="btn" 
          style={{ width: '100%', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)' }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  )
}
