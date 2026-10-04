import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'

export default function Inventory() {
  const [products, setProducts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ name: '', sku: '', price: '', stock: '', description: '' })
  const [editingId, setEditingId] = useState(null)

  const loadProducts = async () => {
    const data = await window.api.getProducts()
    setProducts(data)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    const product = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10)
    }

    if (editingId) {
      await window.api.updateProduct(editingId, product)
    } else {
      await window.api.addProduct(product)
    }
    
    setShowModal(false)
    setFormData({ name: '', sku: '', price: '', stock: '', description: '' })
    setEditingId(null)
    loadProducts()
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await window.api.deleteProduct(id)
      loadProducts()
    }
  }

  const openEdit = (product) => {
    setFormData(product)
    setEditingId(product.id)
    setShowModal(true)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Inventory Management</h1>
        <button className="btn btn-primary" onClick={() => {
          setEditingId(null)
          setFormData({ name: '', sku: '', price: '', stock: '', description: '' })
          setShowModal(true)
        }}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Stock</th>
              <th>Price</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.sku || 'N/A'}</td>
                <td style={{ fontWeight: 500 }}>{p.name}</td>
                <td>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '100px', 
                    fontSize: '0.8rem',
                    background: p.stock < 5 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: p.stock < 5 ? '#fca5a5' : '#6ee7b7'
                  }}>
                    {p.stock} in stock
                  </span>
                </td>
                <td>₹{p.price.toFixed(2)}</td>
                <td style={{ textAlign: 'right' }}>
                  <button onClick={() => openEdit(p)} style={{ padding: '8px', color: '#94a3b8' }}><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(p.id)} style={{ padding: '8px', color: '#ef4444' }}><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '32px' }} className="text-muted">
                  No products found. Click "Add Product" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div className="glass-panel" style={{ width: '400px', padding: '32px' }}>
            <h2 style={{ marginBottom: '24px' }}>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input required className="input-field" type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">SKU (Optional)</label>
                <input className="input-field" type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input required className="input-field" type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Qty</label>
                  <input required className="input-field" type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
