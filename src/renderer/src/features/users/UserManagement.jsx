import React, { useState, useEffect } from 'react'
import { Users, UserPlus, Trash2, ShieldAlert } from 'lucide-react'

export default function UserManagement({ currentUser }) {
  const [users, setUsers] = useState([])
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'staff' })

  useEffect(() => {
    if (currentUser?.role === 'admin') loadUsers()
  }, [currentUser])

  const loadUsers = () => {
    window.api.getUsers().then(setUsers)
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newUser.username || !newUser.password) return
    
    try {
      await window.api.addUser(newUser)
      setNewUser({ username: '', password: '', role: 'staff' })
      loadUsers()
      alert('User added successfully! (Password is securely hashed)')
    } catch (err) {
      alert("Error adding user. Username might already exist.")
    }
  }

  if (currentUser?.role !== 'admin') {
    return (
      <div className="fade-in" style={{ padding: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <ShieldAlert size={64} color="#ef4444" style={{ marginBottom: '24px' }} />
        <h2 style={{ color: '#ef4444', fontSize: '2.5rem', marginBottom: '8px' }}>Access Denied</h2>
        <p className="text-muted" style={{ fontSize: '1.2rem' }}>Only administrators can view or modify system users.</p>
      </div>
    )
  }

  return (
    <div className="fade-in" style={{ padding: '24px' }}>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Users size={32} /> User Management
        </h1>
        <p className="text-muted">Securely manage staff accounts. Passwords are cryptographically hashed.</p>
      </header>
      
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>Add New User</h3>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '12px' }}>
          <input type="text" placeholder="Username" required className="input-field" style={{ flex: 1 }} value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} />
          <input type="password" placeholder="Password" required className="input-field" style={{ flex: 1 }} value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
          <select className="input-field" style={{ flex: 1 }} value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="btn btn-primary"><UserPlus size={18} /> Add</button>
        </form>
      </div>
      
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '16px' }}>ID</th>
              <th style={{ padding: '16px' }}>Username</th>
              <th style={{ padding: '16px' }}>Role</th>
              <th style={{ padding: '16px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '16px' }}>{u.id}</td>
                <td style={{ padding: '16px', fontWeight: 'bold' }}>{u.username}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'capitalize',
                    background: u.role === 'admin' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                    color: u.role === 'admin' ? '#ef4444' : 'var(--primary)'
                  }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '16px', color: '#22c55e' }}>Active (Encrypted)</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
