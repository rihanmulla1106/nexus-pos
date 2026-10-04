import React, { useState, useEffect } from 'react'
import { TrendingDown, Plus, Save } from 'lucide-react'

export default function Expenses() {
  const [expenses, setExpenses] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newExpense, setNewExpense] = useState({ description: '', amount: '' })

  useEffect(() => {
    loadExpenses()
  }, [])

  const loadExpenses = () => {
    window.api.getExpenses().then(setExpenses)
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      await window.api.addExpense({
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        date: new Date().toISOString()
      })
      setShowModal(false)
      setNewExpense({ description: '', amount: '' })
      loadExpenses()
    } catch (err) {
      alert("Error logging expense")
    }
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="fade-in" style={{ padding: '24px' }}>
      <header style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <TrendingDown size={32} color="#ef4444" /> Daily Expenses
          </h1>
          <p className="text-muted">Track your operational costs to calculate net profit.</p>
        </div>
        <button className="btn btn-primary" style={{ background: '#ef4444' }} onClick={() => setShowModal(true)}>
          <Plus size={18} style={{ marginRight: '8px' }} /> Log Expense
        </button>
      </header>

      <div style={{ marginBottom: '24px', fontSize: '1.2rem', fontWeight: 'bold' }}>
        Total Logged Expenses: <span style={{ color: '#ef4444' }}>₹{totalExpenses.toFixed(2)}</span>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '16px' }}>Date</th>
              <th style={{ padding: '16px' }}>Description</th>
              <th style={{ padding: '16px' }}>Amount</th>
              <th style={{ padding: '16px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{new Date(e.date).toLocaleString()}</td>
                <td style={{ padding: '16px', fontWeight: 'bold' }}>{e.description}</td>
                <td style={{ padding: '16px', color: '#ef4444', fontWeight: 'bold' }}>₹{e.amount.toFixed(2)}</td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <button onClick={async () => {
                    if (confirm('Delete expense?')) {
                      await window.api.deleteExpense(e.id)
                      loadExpenses()
                    }
                  }} style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr><td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No expenses logged yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel fade-in">
            <h2 style={{ marginBottom: '24px' }}>Log New Expense</h2>
            <form onSubmit={handleAdd}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Description (e.g. Electricity, Supplies)</label>
                <input required type="text" className="input-field" value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} />
              </div>
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Amount (₹)</label>
                <input required type="number" className="input-field" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#ef4444' }}><Save size={18} style={{ marginRight: '8px' }}/> Log It</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
