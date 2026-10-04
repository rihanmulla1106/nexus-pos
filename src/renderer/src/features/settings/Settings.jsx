import React, { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Save, Database } from 'lucide-react'

export default function Settings() {
  const [storeName, setStoreName] = useState('Nexus POS')
  const [currency, setCurrency] = useState('₹')
  const [taxRate, setTaxRate] = useState(0)

  useEffect(() => {
    window.api.getSettings().then(settings => {
      if (settings.store_name) setStoreName(settings.store_name)
      if (settings.currency) setCurrency(settings.currency)
      if (settings.tax_rate) setTaxRate(parseFloat(settings.tax_rate))
    })
  }, [])

  const handleSave = async () => {
    const settings = {
      store_name: storeName,
      currency: currency,
      tax_rate: taxRate
    }
    const res = await window.api.saveSettings(settings)
    if (res.success) alert("Settings saved successfully! These will now apply to all new invoices.")
  }

  const handleBackup = async () => {
    try {
      const res = await window.api.backupDatabase()
      if (res.success) alert("Database backup successful!")
      else if (res.message !== 'Cancelled') alert("Error: " + res.message)
    } catch(e) {
      console.error(e)
    }
  }

  return (
    <div className="fade-in" style={{ padding: '24px', maxWidth: '600px' }}>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <SettingsIcon size={32} /> System Settings
        </h1>
      </header>
      
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label className="form-label">Store Name (Shows on PDF Invoices)</label>
          <input type="text" className="input-field" value={storeName} onChange={e => setStoreName(e.target.value)} />
        </div>
        
        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label className="form-label">Currency Symbol</label>
          <input type="text" className="input-field" value={currency} onChange={e => setCurrency(e.target.value)} />
        </div>

        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label">Default Tax %</label>
          <input type="number" step="0.01" className="input-field" value={taxRate} onChange={e => setTaxRate(e.target.value)} />
        </div>

        <button className="btn btn-primary" style={{ padding: '12px 24px', width: '100%', marginBottom: '24px' }} onClick={handleSave}>
          <Save size={18} style={{ marginRight: '8px' }}/> Save Settings
        </button>
        
        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '24px 0' }}/>
        
        <h3 style={{ marginBottom: '16px' }}>Data Management</h3>
        <button className="btn" style={{ width: '100%', background: 'rgba(234,179,8,0.1)', color: '#eab308', border: '1px solid rgba(234,179,8,0.2)', padding: '12px' }} onClick={handleBackup}>
          <Database size={18} style={{ marginRight: '8px' }}/> Backup Database Locally
        </button>
      </div>
    </div>
  )
}
