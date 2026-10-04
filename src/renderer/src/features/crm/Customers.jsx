import React, { useState, useEffect } from 'react'
import { Users, Plus, Save } from 'lucide-react'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '' })

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = () => {
    window.api.getCustomers().then(setCustomers)
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      await window.api.addCustomer(newCustomer)
      setShowModal(false)
      setNewCustomer({ name: '', phone: '' })
      loadCustomers()
    } catch (err) {
      alert("Error adding customer. Phone number might already exist.")
    }
  }

  return (
    <div className="fade-in" style={{ padding: '24px' }}>
      <header style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Users size={32} /> Customers (CRM)
          </h1>
          <p className="text-muted">Manage your client database and loyalty points.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} style={{ marginRight: '8px' }} /> Add Customer
        </button>
      </header>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '16px' }}>Name</th>
              <th style={{ padding: '16px' }}>Phone Number</th>
              <th style={{ padding: '16px' }}>Loyalty Points</th>
              <th style={{ padding: '16px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '16px', fontWeight: 'bold' }}>{c.name}</td>
                <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{c.phone}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ color: '#eab308', fontWeight: 'bold', background: 'rgba(234,179,8,0.1)', padding: '4px 12px', borderRadius: '12px' }}>
                    ★ {c.points}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <button onClick={async () => {
                    if (confirm('Delete customer?')) {
                      await window.api.deleteCustomer(c.id)
                      loadCustomers()
                    }
                  }} style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr><td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No customers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel fade-in">
            <h2 style={{ marginBottom: '24px' }}>Add Customer</h2>
            <form onSubmit={handleAdd}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Full Name</label>
                <input required type="text" className="input-field" value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} />
              </div>
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Phone Number</label>
                <input required type="text" className="input-field" value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary"><Save size={18} style={{ marginRight: '8px' }}/> Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
