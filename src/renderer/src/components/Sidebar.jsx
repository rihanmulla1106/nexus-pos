import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, Receipt } from 'lucide-react'

export default function Sidebar() {
  return (
    <aside className="glass-panel" style={{ width: '260px', borderRadius: 0, borderRight: 'var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>Nexus POS</h2>
        <p className="text-muted" style={{ fontSize: '0.8rem' }}>Inventory & Billing</p>
      </div>

      <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <NavLink 
          to="/"
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
            borderRadius: '8px', color: isActive ? 'white' : 'var(--text-muted)',
            background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
            fontWeight: isActive ? 600 : 400,
            transition: 'all 0.2s'
          })}
        >
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        
        <NavLink 
          to="/inventory"
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
            borderRadius: '8px', color: isActive ? 'white' : 'var(--text-muted)',
            background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
            fontWeight: isActive ? 600 : 400,
            transition: 'all 0.2s'
          })}
        >
          <Package size={20} /> Inventory
        </NavLink>

        <NavLink 
          to="/billing"
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
            borderRadius: '8px', color: isActive ? 'white' : 'var(--text-muted)',
            background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
            fontWeight: isActive ? 600 : 400,
            transition: 'all 0.2s'
          })}
        >
          <Receipt size={20} /> Billing / POS
        </NavLink>
      </nav>
      
      <div style={{ padding: '24px', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        v1.0.0 &copy; 2026
      </div>
    </aside>
  )
}
