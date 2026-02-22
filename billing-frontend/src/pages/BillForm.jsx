import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BillItemRow from '../components/BillItemRow'
import { generateBill } from '../services/api'
import { computeItemTotals, fmt, todayISO } from '../services/gstUtils'
import styles from '../styles/BillForm.module.css'

const EMPTY_ITEM = { description: '', quantity: '', rate: '' }

function BillForm() {
  const navigate = useNavigate()

  const [customerName, setCustomerName] = useState('')
  const [customerGstin, setCustomerGstin] = useState('')
  const [vehicleNumber, setVehicleNumber] = useState('')
  const [billDate, setBillDate] = useState(todayISO())
  const [items, setItems] = useState([{ ...EMPTY_ITEM }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleItemChange(index, updatedItem) {
    setItems((prev) => {
      const copy = [...prev]
      copy[index] = updatedItem
      return copy
    })
  }

  function addRow() {
    setItems((prev) => [...prev, { ...EMPTY_ITEM }])
  }

  function removeRow(index) {
    if (items.length === 1) return
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  // Compute summary
  const summary = items.reduce(
    (acc, item) => {
      if (item.rate && item.quantity) {
        const t = computeItemTotals(item.rate, item.quantity)
        acc.taxable += t.taxableAmount
        acc.cgst += t.cgstAmount
        acc.sgst += t.sgstAmount
        acc.grand += t.taxableAmount + t.cgstAmount + t.sgstAmount
      }
      return acc
    },
    { taxable: 0, cgst: 0, sgst: 0, grand: 0 }
  )

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const validItems = items.filter((it) => it.description && it.quantity && it.rate)
    if (validItems.length === 0) {
      setError('Please add at least one item with description, quantity, and rate.')
      return
    }

    const payload = {
      customerName,
      customerGSTIN: customerGstin,
      vehicleNumber,
      billDate,
      items: validItems.map((it) => ({
        description: it.description,
        quantity: parseInt(it.quantity),
        rate: parseFloat(it.rate),
        ...computeItemTotals(it.rate, it.quantity),
      })),
      totalTaxableAmount: summary.taxable,
      totalCgst: summary.cgst,
      totalSgst: summary.sgst,
      grandTotal: summary.grand,
    }
    // const payload = {
    //   customerName,
    //   customerGSTIN: customerGstin, // Use the key the backend expects
    //   items: validItems.map((it) => ({
    //     description: it.description,
    //     quantity: parseInt(it.quantity), // Backend expects int
    //     rate: parseFloat(it.rate),      // Backend expects double
    //   })),
    // };

    try {
      setLoading(true)
      const result = await generateBill(payload)
      navigate(`/invoice/${result.billNumber}`, { state: { bill: result } })
    } catch (err) {
      // Fallback: use local data for preview if backend not available
      const localBill = {
        ...payload,
        billNumber: `BILL-${Date.now()}`,
        billDate,
      }
      navigate(`/invoice/${localBill.billNumber}`, { state: { bill: localBill } })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.formCard}>
        {/* App Header */}
        <div className={styles.appHeader}>
          <div className={styles.shopLogo}>⚙</div>
          <div>
            <h1 className={styles.shopTitle}>SACHIN AUTO SPARES</h1>
            <p className={styles.shopSub}>Billing Software — New GST Invoice</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Customer Details */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Customer Details</h2>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label>Customer Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Customer GSTIN</label>
                <input
                  type="text"
                  value={customerGstin}
                  onChange={(e) => setCustomerGstin(e.target.value.toUpperCase())}
                  placeholder="27XXXXX0000X1ZX"
                  maxLength={15}
                />
              </div>
              <div className={styles.field}>
                <label>Vehicle Number</label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  placeholder="MH 12 AB 1234"
                />
              </div>
              <div className={styles.field}>
                <label>Bill Date *</label>
                <input
                  type="date"
                  value={billDate}
                  onChange={(e) => setBillDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Items</h2>
            <div className={styles.tableWrapper}>
              <table className={styles.itemsTable}>
                <thead>
                  <tr>
                    <th>Sr.</th>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Rate (Incl. GST)</th>
                    <th>CGST %</th>
                    <th>CGST Amt</th>
                    <th>SGST %</th>
                    <th>SGST Amt</th>
                    <th>Taxable Amt</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <BillItemRow
                      key={index}
                      index={index}
                      item={item}
                      onChange={handleItemChange}
                      onRemove={removeRow}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <button type="button" onClick={addRow} className={styles.addRowBtn}>
              + Add Item
            </button>
          </div>

          {/* Summary */}
          {summary.grand > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Summary</h2>
              <div className={styles.summaryBox}>
                <div className={styles.summaryRow}>
                  <span>Total Taxable Amount</span>
                  <span>₹ {fmt(summary.taxable)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Add CGST (9%)</span>
                  <span>₹ {fmt(summary.cgst)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Add SGST (9%)</span>
                  <span>₹ {fmt(summary.sgst)}</span>
                </div>
                <div className={`${styles.summaryRow} ${styles.grandTotal}`}>
                  <span>Grand Total</span>
                  <span>₹ {fmt(summary.grand)}</span>
                </div>
              </div>
            </div>
          )}

          {error && <div className={styles.errorBox}>{error}</div>}

          <div className={styles.actions}>
            <button
              type="button"
              onClick={() => {
                setItems([{ ...EMPTY_ITEM }])
                setCustomerName('')
                setCustomerGstin('')
                setVehicleNumber('')
                setBillDate(todayISO())
                setError('')
              }}
              className={styles.clearBtn}
            >
              Clear Form
            </button>
            <button type="submit" disabled={loading} className={styles.generateBtn}>
              {loading ? 'Generating...' : '🖨 Generate Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BillForm
