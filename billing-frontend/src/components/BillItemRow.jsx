import { computeItemTotals, fmt } from '../services/gstUtils'
import styles from '../styles/BillForm.module.css'

function BillItemRow({ index, item, onChange, onRemove }) {
  const totals = item.rate && item.quantity ? computeItemTotals(item.rate, item.quantity) : null

  function handleChange(e) {
    const { name, value } = e.target
    onChange(index, { ...item, [name]: value })
  }

  return (
    <tr className={styles.itemRow}>
      <td className={styles.srNo}>{index + 1}</td>
      <td>
        <input
          type="text"
          name="description"
          value={item.description}
          onChange={handleChange}
          placeholder="Part description"
          className={styles.inputFull}
          required
        />
      </td>
      <td>
        <input
          type="number"
          name="quantity"
          value={item.quantity}
          onChange={handleChange}
          placeholder="0"
          min="1"
          step="1"
          className={styles.inputSmall}
          required
        />
      </td>
      <td>
        <input
          type="number"
          name="rate"
          value={item.rate}
          onChange={handleChange}
          placeholder="0.00"
          min="0"
          step="0.01"
          className={styles.inputSmall}
          required
        />
      </td>
      <td className={styles.computed}>9%</td>
      <td className={styles.computed}>{totals ? fmt(totals.cgstAmount) : '—'}</td>
      <td className={styles.computed}>9%</td>
      <td className={styles.computed}>{totals ? fmt(totals.sgstAmount) : '—'}</td>
      <td className={styles.computed}>{totals ? fmt(totals.taxableAmount) : '—'}</td>
      <td>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className={styles.removeBtn}
          title="Remove row"
        >
          ✕
        </button>
      </td>
    </tr>
  )
}

export default BillItemRow
