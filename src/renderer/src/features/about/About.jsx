import React from 'react'
import { Info } from 'lucide-react'

export default function About() {
  return (
    <div className="fade-in" style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ background: 'rgba(99,102,241,0.2)', color: 'var(--primary)', padding: '20px', borderRadius: '50%', display: 'inline-block', marginBottom: '24px' }}>
          <Info size={48} />
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>Nexus POS</h1>
        <p style={{ color: 'var(--primary)', fontWeight: 600, marginTop: '8px' }}>Version 1.0.0</p>
        
        <p className="text-muted" style={{ marginTop: '24px', lineHeight: 1.6 }}>
          A modern, offline-first Inventory and Billing Desktop Application. 
          Built with Electron, React, and SQLite to provide lightning-fast, secure, and reliable operations for your business.
        </p>

        <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>&copy; 2026 Nexus POS. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
