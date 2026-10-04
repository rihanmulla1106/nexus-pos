import React, { useState } from 'react'
import { Lock } from 'lucide-react'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await window.api.login(username, password)
      if (res.success) {
        onLogin(res.user)
      } else {
        setError(res.message || 'Login failed')
      }
    } catch (err) {
      console.error(err)
      setError('An error occurred during login.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', width: '100vw', background: 'var(--bg-color)'
    }}>
      <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '16px', borderRadius: '50%', color: 'var(--primary)', marginBottom: '24px' }}>
          <Lock size={32} />
        </div>
        
        <h2 style={{ marginBottom: '8px', fontSize: '1.5rem', fontWeight: 700 }}>Welcome Back</h2>
        <p className="text-muted" style={{ marginBottom: '32px', fontSize: '0.9rem' }}>Sign in to Nexus POS</p>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '12px', borderRadius: '8px', width: '100%', marginBottom: '24px', fontSize: '0.9rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              required 
              type="text" 
              className="input-field" 
              placeholder="Enter your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '32px' }}>
            <label className="form-label">Password</label>
            <input 
              required 
              type="password" 
              className="input-field" 
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-muted" style={{ marginTop: '24px', fontSize: '0.8rem' }}>
          Default Admin: <strong>admin</strong> / <strong>admin123</strong>
        </p>

      </div>
    </div>
  )
}
