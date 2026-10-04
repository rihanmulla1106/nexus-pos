import React, { useState, useEffect } from 'react'
import { Plus, Minus, Trash2, Printer, ScanBarcode } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function Billing() {
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [cart, setCart] = useState([])
  const [customerPhone, setCustomerPhone] = useState('')
  const [search, setSearch] = useState('')

  const [amountPaid, setAmountPaid] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [printFormat, setPrintFormat] = useState('A4')
  
  const [barcodeInput, setBarcodeInput] = useState('')
  
  // Settings State
  const [settings, setSettings] = useState({ store_name: 'Nexus POS', currency: '₹', tax_rate: '0' })

  useEffect(() => {
    window.api.getProducts().then(setProducts)
    window.api.getCustomers().then(setCustomers)
    window.api.getSettings().then(s => setSettings(prev => ({ ...prev, ...s })))
  }, [])

  // Barcode Scanner Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && barcodeInput.length > 2) {
        const product = products.find(p => p.sku === barcodeInput)
        if (product) addToCart(product)
        setBarcodeInput('')
      } else if (e.key.length === 1) {
        setBarcodeInput(prev => prev + e.key)
        setTimeout(() => setBarcodeInput(''), 500)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [barcodeInput, products])

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

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.product_id !== id))

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const taxRateNum = parseFloat(settings.tax_rate) || 0
  const taxAmount = subtotal * (taxRateNum / 100)
  const total = subtotal + taxAmount
  const balanceDue = Math.max(0, total - (parseFloat(amountPaid) || 0))

  const generatePDF = (invoiceData, invoiceId) => {
    const isThermal = printFormat === 'Thermal'
    const doc = isThermal ? new jsPDF({ format: [80, 297], unit: 'mm' }) : new jsPDF()
    const invoiceNum = `INV-${invoiceId.toString().padStart(4, '0')}`
    const curr = settings.currency

    doc.setFontSize(isThermal ? 16 : 22)
    doc.text(settings.store_name, isThermal ? 10 : 14, 20)
    
    doc.setFontSize(isThermal ? 10 : 12)
    doc.text(`Invoice: ${invoiceNum}`, isThermal ? 10 : 14, 32)
    doc.text(`Date: ${new Date(invoiceData.date).toLocaleString()}`, isThermal ? 10 : 14, isThermal ? 38 : 40)
    
    if (invoiceData.customer_phone) {
      const c = customers.find(c => c.phone === invoiceData.customer_phone)
      doc.text(`Customer: ${c ? c.name : invoiceData.customer_phone}`, isThermal ? 10 : 14, isThermal ? 44 : 48)
    }

    const tableRows = invoiceData.items.map(item => [item.name, item.quantity.toString(), `${curr} ${(item.price * item.quantity).toFixed(2)}`])

    autoTable(doc, {
      startY: invoiceData.customer_phone ? (isThermal ? 48 : 56) : (isThermal ? 44 : 48),
      head: [["Item", "Qty", "Total"]],
      body: tableRows,
      theme: 'grid',
      styles: { fontSize: isThermal ? 8 : 10 },
      margin: isThermal ? { left: 5, right: 5 } : undefined,
      headStyles: { fillColor: [99, 102, 241] }
    })

    const finalY = doc.lastAutoTable.finalY || 60
    doc.setFontSize(isThermal ? 10 : 12)
    
    if (taxRateNum > 0) {
      doc.text(`Subtotal: ${curr} ${subtotal.toFixed(2)}`, isThermal ? 10 : 14, finalY + 10)
      doc.text(`Tax (${taxRateNum}%): ${curr} ${taxAmount.toFixed(2)}`, isThermal ? 10 : 14, finalY + 16)
    }

    doc.setFont(undefined, 'bold')
    const totalY = taxRateNum > 0 ? finalY + 24 : finalY + 10
    doc.text(`Grand Total: ${curr} ${invoiceData.total.toFixed(2)}`, isThermal ? 10 : 14, totalY)
    doc.text(`Paid: ${curr} ${invoiceData.amount_paid.toFixed(2)} (${invoiceData.payment_method})`, isThermal ? 10 : 14, totalY + 6)
    
    if (invoiceData.balance_due > 0) {
      doc.text(`Due: ${curr} ${invoiceData.balance_due.toFixed(2)}`, isThermal ? 10 : 14, totalY + 12)
    }
    
    doc.save(`${invoiceNum}.pdf`)
  }

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Cart is empty")
    
    const paidNum = parseFloat(amountPaid) || 0
    let custName = ''
    if (customerPhone) {
      const c = customers.find(c => c.phone === customerPhone)
      if (c) custName = c.name
      else custName = customerPhone
    }

    const invoiceData = {
      customer_name: custName,
      customer_phone: customerPhone,
      date: new Date().toISOString(),
      total,
      amount_paid: paidNum,
      balance_due: Math.max(0, total - paidNum),
      payment_method: paymentMethod,
      status: paidNum >= total ? 'Paid' : (paidNum > 0 ? 'Partial' : 'Unpaid'),
      items: cart
    }

    try {
      const res = await window.api.createInvoice(invoiceData)
      if (res.success) {
        generatePDF(invoiceData, res.invoiceId)
        alert(`Invoice INV-${res.invoiceId.toString().padStart(4, '0')} generated! Points awarded!`)
        setCart([]); setCustomerPhone(''); setAmountPaid('')
        window.api.getProducts().then(setProducts)
        window.api.getCustomers().then(setCustomers)
      }
    } catch (err) {
      alert("Error generating invoice")
    }
  }

  return (
    <div className="fade-in" style={{ display: 'flex', height: '100%', gap: '24px', padding: '24px' }}>
      <div style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <input type="text" className="input-field" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
            <ScanBarcode size={20} /> <span>Scanner Ready</span>
          </div>
        </div>
        
        <div style={{ overflowY: 'auto', flex: 1, marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', alignContent: 'start' }}>
          {filteredProducts.map(p => (
            <div key={p.id} onClick={() => addToCart(p)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--surface-border)', padding: '16px', borderRadius: '12px', cursor: 'pointer' }}>
              <h4 style={{ marginBottom: '8px' }}>{p.name}</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{settings.currency}{p.price.toFixed(2)}</span>
                <span style={{ fontSize: '0.8rem', color: p.stock > 0 ? 'var(--text-muted)' : '#ef4444' }}>{p.stock > 0 ? `Stock: ${p.stock}` : 'Out of Stock'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px' }}>
        <h2 style={{ marginBottom: '24px' }}>Current Invoice</h2>
        
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label">Customer (Select or enter phone)</label>
          <input className="input-field" list="customers" placeholder="Phone number" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
          <datalist id="customers">
            {customers.map(c => <option key={c.id} value={c.phone}>{c.name} (★ {c.points})</option>)}
          </datalist>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {cart.length === 0 ? <p className="text-muted" style={{ textAlign: 'center', marginTop: '40px' }}>Cart is empty</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cart.map(item => (
                <div key={item.product_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ flex: 1 }}>
                    <h5 style={{ fontWeight: 500, fontSize: '0.95rem' }}>{item.name}</h5>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{settings.currency}{item.price.toFixed(2)} x {item.quantity}</div>
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
          {taxRateNum > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <span>Subtotal:</span>
              <span>{settings.currency}{subtotal.toFixed(2)}</span>
            </div>
          )}
          {taxRateNum > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              <span>Tax ({taxRateNum}%):</span>
              <span>{settings.currency}{taxAmount.toFixed(2)}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px' }}>
            <span>Total:</span>
            <span style={{ color: 'var(--primary)' }}>{settings.currency}{total.toFixed(2)}</span>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Payment</label>
              <select className="input-field" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                <option value="Cash">Cash</option><option value="Card">Card</option><option value="UPI">UPI</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Paid ({settings.currency})</label>
              <input type="number" className="input-field" placeholder={total.toFixed(2)} value={amountPaid} onChange={e => setAmountPaid(e.target.value)} />
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.9rem', color: balanceDue > 0 ? '#ef4444' : '#22c55e' }}>
            <span>{balanceDue > 0 ? 'Due:' : 'Change:'}</span>
            <span style={{ fontWeight: 'bold' }}>{settings.currency}{balanceDue > 0 ? balanceDue.toFixed(2) : ((parseFloat(amountPaid) || 0) - total).toFixed(2)}</span>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
             <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="radio" name="format" checked={printFormat === 'A4'} onChange={() => setPrintFormat('A4')} /> A4 PDF
             </label>
             <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="radio" name="format" checked={printFormat === 'Thermal'} onChange={() => setPrintFormat('Thermal')} /> 80mm Thermal
             </label>
          </div>
          
          <button className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1.1rem' }} onClick={handleCheckout}>
            <Printer size={20} /> Generate Bill
          </button>
        </div>
      </div>
    </div>
  )
}
