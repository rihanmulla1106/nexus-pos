import React, { useState, useEffect } from 'react'
import { Plus, Minus, Trash2, Printer } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function Billing() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [customerName, setCustomerName] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    window.api.getProducts().then(setProducts)
  }, [])

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase()))

  const addToCart = (product) => {
    if (product.stock <= 0) return alert('Out of stock!')
    
    setCart(prev => {
      const existing = prev.find(item => item.product_id === product.id)
      if (existing) {
        if (existing.quantity >= product.stock) return prev
        return prev.map(item => item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { product_id: product.id, name: product.name, price: product.price, quantity: 1, stock: product.stock }]
    })
  }

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.product_id === id) {
        const newQ = item.quantity + delta
        if (newQ < 1 || newQ > item.stock) return item
        return { ...item, quantity: newQ }
      }
      return item
    }))
  }

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.product_id !== id))
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const generatePDF = (invoiceData, invoiceId) => {
    const doc = new jsPDF()
    const invoiceNum = `INV-${invoiceId.toString().padStart(4, '0')}`

    // Header
    doc.setFontSize(22)
    doc.text('Nexus POS', 14, 20)
    
    doc.setFontSize(12)
    doc.text(`Invoice Number: ${invoiceNum}`, 14, 32)
    doc.text(`Date: ${new Date(invoiceData.date).toLocaleString()}`, 14, 40)
    if (invoiceData.customer_name) {
      doc.text(`Customer Name: ${invoiceData.customer_name}`, 14, 48)
    }

    // Table
    const tableColumn = ["Item", "Price", "Quantity", "Subtotal"]
    const tableRows = []

    invoiceData.items.forEach(item => {
      const rowData = [
        item.name,
        `Rs ${item.price.toFixed(2)}`,
        item.quantity.toString(),
        `Rs ${(item.price * item.quantity).toFixed(2)}`
      ]
      tableRows.push(rowData)
    })

    autoTable(doc, {
      startY: invoiceData.customer_name ? 56 : 48,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241] } // var(--primary) indigo-500
    })

    // Total
    const finalY = doc.lastAutoTable.finalY || 60
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text(`Total Amount: Rs ${invoiceData.total.toFixed(2)}`, 14, finalY + 15)
    
    // Save
    doc.save(`${invoiceNum}.pdf`)
  }

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Cart is empty")

    const invoiceData = {
      customer_name: customerName,
      date: new Date().toISOString(),
      total,
      items: cart
    }

    try {
      const res = await window.api.createInvoice(invoiceData)
      if (res.success) {
        // Generate PDF
        generatePDF(invoiceData, res.invoiceId)
        
        alert(`Invoice INV-${res.invoiceId.toString().padStart(4, '0')} generated successfully!`)
        setCart([])
        setCustomerName('')
        window.api.getProducts().then(setProducts) // reload stock
      }
    } catch (err) {
      console.error(err)
      alert("Error generating invoice")
    }
  }

  return (
    <div style={{ display: 'flex', gap: '24px', height: '100%' }}>
      {/* Product Selection List */}
      <div className="glass-panel" style={{ flex: 2, display: 'flex', flexDirection: 'column', padding: '24px' }}>
        <h2 style={{ marginBottom: '16px' }}>Select Products</h2>
        <div className="form-group">
          <input 
            type="text" 
            className="input-field" 
            placeholder="Search by name or SKU..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        
        <div style={{ overflowY: 'auto', flex: 1, marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', alignContent: 'start' }}>
          {filteredProducts.map(p => (
            <div key={p.id} onClick={() => addToCart(p)} style={{ 
                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--surface-border)', 
                padding: '16px', borderRadius: '12px', cursor: 'pointer', transition: 'var(--transition)'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            >
              <h4 style={{ marginBottom: '8px' }}>{p.name}</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>₹{p.price.toFixed(2)}</span>
                <span style={{ fontSize: '0.8rem', color: p.stock > 0 ? 'var(--text-muted)' : '#ef4444' }}>
                  {p.stock > 0 ? `Stock: ${p.stock}` : 'Out of Stock'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart / Invoice Panel */}
      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px' }}>
        <h2 style={{ marginBottom: '24px' }}>Current Invoice</h2>
        
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label">Customer Name (Optional)</label>
          <input className="input-field" type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {cart.length === 0 ? (
            <p className="text-muted" style={{ textAlign: 'center', marginTop: '40px' }}>Cart is empty</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cart.map(item => (
                <div key={item.product_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ flex: 1 }}>
                    <h5 style={{ fontWeight: 500, fontSize: '0.95rem' }}>{item.name}</h5>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>₹{item.price.toFixed(2)} x {item.quantity}</div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '8px' }}>
                      <button onClick={() => updateQuantity(item.product_id, -1)} style={{ padding: '4px' }}><Minus size={14} /></button>
                      <span style={{ width: '20px', textAlign: 'center', fontSize: '0.9rem' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product_id, 1)} style={{ padding: '4px' }}><Plus size={14} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.product_id)} style={{ color: '#ef4444' }}><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--surface-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '24px' }}>
            <span>Total:</span>
            <span style={{ color: 'var(--primary)' }}>₹{total.toFixed(2)}</span>
          </div>
          
          <button className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1.1rem' }} onClick={handleCheckout}>
            <Printer size={20} /> Generate Bill
          </button>
        </div>
      </div>
    </div>
  )
}
