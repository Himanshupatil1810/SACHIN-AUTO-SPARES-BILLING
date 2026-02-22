import { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { getBillByNumber } from '../services/api'
import { fmt, numberToWords, formatDate } from '../services/gstUtils'
import styles from '../styles/Invoice.module.css'

// Shop constants
const SHOP = {
  name: import.meta.env.VITE_SHOP_NAME,
  address: import.meta.env.VITE_SHOP_ADDRESS,
  gstin: import.meta.env.VITE_SHOP_GSTIN,
  phone: import.meta.env.VITE_SHOP_PHONE,
  state: 'Maharashtra',
  stateCode: '27',
}

const BANK = {
  name: import.meta.env.VITE_BANK_NAME,
  accountNo: import.meta.env.VITE_BANK_ACC,
  ifsc: import.meta.env.VITE_BANK_IFSC,
  branch: 'Baramati Branch',
}

function InvoicePage() {
  const { billNumber } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [bill, setBill] = useState(location.state?.bill || null)
  const [loading, setLoading] = useState(!bill)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!bill) {
      setLoading(true)
      getBillByNumber(billNumber)
        .then((data) => setBill(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false))
    }
  }, [billNumber, bill])

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
        <p>Loading invoice...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorWrapper}>
        <p>Error: {error}</p>
        <button onClick={() => navigate('/bill/new')}>← New Bill</button>
      </div>
    )
  }

  if (!bill) return null


  return (
    <div className={styles.pageWrapper}>
      {/* Action Bar - hidden on print */}
      <div className={styles.actionBar}>
        <button onClick={() => navigate('/bill/new')} className={styles.newBillBtn}>
          ← New Bill
        </button>
        <button onClick={() => window.print()} className={styles.printBtn}>
          🖨 Print Invoice
        </button>
      </div>

      {/* A4 Invoice */}
      <div className={styles.invoice} id="invoice">
        {/* Header */}
        <table className={styles.headerTable}>
          <tbody>
            <tr>
              <td className={styles.shopInfoCell}>
                <div className={styles.shopName}>{SHOP.name}</div>
                <div className={styles.shopAddress}>{SHOP.address}</div>
                <div className={styles.shopMeta}>
                  <span><strong>GSTIN:</strong> {SHOP.gstin}</span>
                  &nbsp;&nbsp;|&nbsp;&nbsp;
                  <span><strong>Ph:</strong> {SHOP.phone}</span>
                </div>
                <div className={styles.shopMeta}>
                  <span><strong>State:</strong> {SHOP.state}</span>
                  &nbsp;&nbsp;|&nbsp;&nbsp;
                  <span><strong>State Code:</strong> {SHOP.stateCode}</span>
                </div>
              </td>
              <td className={styles.invoiceTitleCell}>
                <div className={styles.invoiceTitle}>GST TAX INVOICE</div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Bill Info Row */}
        <table className={styles.billInfoTable}>
          <tbody>
            <tr>
              <td className={styles.billInfoLeft}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Party Name:</span>
                  <span className={styles.infoValue}>{bill.customerName}</span>
                </div>
                {bill.customerGSTIN && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Party GSTIN:</span>
                    <span className={styles.infoValue}>{bill.customerGSTIN}</span>
                  </div>
                )}
                {bill.vehicleNumber && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Vehicle No.:</span>
                    <span className={styles.infoValue}>{bill.vehicleNumber}</span>
                  </div>
                )}
              </td>
              <td className={styles.billInfoRight}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Bill No.:</span>
                  <span className={styles.infoValue}>{bill.billNumber}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Date:</span>
                  <span className={styles.infoValue}>{formatDate(bill.billDate)}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Items Table */}
        <table className={styles.itemsTable}>
          <thead>
            <tr>
              <th className={styles.thSr}>Sr.</th>
              <th className={styles.thDesc}>Description of Goods</th>
              <th className={styles.thNum}>Qty</th>
              <th className={styles.thNum}>Rate</th>
              <th className={styles.thNum}>CGST %</th>
              <th className={styles.thNum}>CGST Amt</th>
              <th className={styles.thNum}>SGST %</th>
              <th className={styles.thNum}>SGST Amt</th>
              <th className={styles.thNum}>Taxable Amt</th>
            </tr>
          </thead>
          <tbody>
            {(bill.items || []).map((item, i) => (
              <tr key={i} className={styles.itemRow}>
                <td className={styles.tdSr}>{i + 1}</td>
                <td className={styles.tdDesc}>{item.description}</td>
                <td className={styles.tdNum}>{item.quantity}</td>
                <td className={styles.tdNum}>{fmt(item.rate)}</td>
                <td className={styles.tdNum}>{item.cgstRate || 9}%</td>
                <td className={styles.tdNum}>{fmt(item.cgstAmount)}</td>
                <td className={styles.tdNum}>{item.sgstRate || 9}%</td>
                <td className={styles.tdNum}>{fmt(item.sgstAmount)}</td>
                {/* <td className={styles.tdNum}>{fmt(item.taxableAmount)}</td> */}
                <td className={styles.tdNum}>{fmt(item.amountBeforeTax)}</td> {/* Changed from taxableAmount */}
              </tr>
            ))}
            {/* Fill blank rows for print look */}
            {Array.from({ length: Math.max(0, 8 - (bill.items || []).length) }).map((_, i) => (
              <tr key={`blank-${i}`} className={`${styles.itemRow} ${styles.blankRow}`}>
                <td>&nbsp;</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Section */}
        <table className={styles.totalsTable}>
          <tbody>
            <tr>
              <td className={styles.totalsLeft} rowSpan={4}>
                <div className={styles.amountWords}>
                  <strong>Amount in Words:</strong>
                  <div className={styles.wordsText}>{numberToWords(bill.totalAfterTax)}</div>
                </div>
              </td>
              <td className={styles.totalLabel}>Total Taxable Amount</td>
              <td className={styles.totalValue}>₹ {fmt(bill.totalBeforeTax)}</td>
            </tr>
            <tr>
              <td className={styles.totalLabel}>Add CGST (9%)</td>
              <td className={styles.totalValue}>₹ {fmt(bill.cgstAmount)}</td>
            </tr>
            <tr>
              <td className={styles.totalLabel}>Add SGST (9%)</td>
              <td className={styles.totalValue}>₹ {fmt(bill.sgstAmount)}</td>
            </tr>
            <tr>
              <td className={`${styles.totalLabel} ${styles.grandLabel}`}>Grand Total</td>
              <td className={`${styles.totalValue} ${styles.grandValue}`}>
                ₹ {fmt(bill.totalAfterTax)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Footer */}
        <table className={styles.footerTable}>
          <tbody>
            <tr>
              <td className={styles.footerLeft}>
                <div className={styles.footerSection}>
                  <strong>Bank Details:</strong>
                  <div>Bank: {BANK.name}</div>
                  <div>A/c No: {BANK.accountNo}</div>
                  <div>IFSC: {BANK.ifsc}</div>
                  <div>Branch: {BANK.branch}</div>
                </div>
                <div className={styles.footerSection}>
                  <em>Subject to Baramati Jurisdiction</em>
                </div>
              </td>
              <td className={styles.footerMiddle}>
                <div className={styles.signatureBox}>
                  <div className={styles.signatureLine}></div>
                  <div className={styles.signatureLabel}>Receiver's Signature</div>
                </div>
              </td>
              <td className={styles.footerRight}>
                <div className={styles.signatureBox}>
                  <div className={styles.signatureLine}></div>
                  <div className={styles.signatureLabel}>
                    For {SHOP.name}
                    <br />
                    <strong>Authorised Signatory</strong>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div className={styles.computerGenerated}>
          ** This is a Computer Generated Invoice **
        </div>
      </div>
    </div>
  )
}

export default InvoicePage
