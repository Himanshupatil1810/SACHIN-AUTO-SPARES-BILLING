// GST is 18% inclusive in price (9% CGST + 9% SGST)
const GST_RATE = 18
const CGST_RATE = 9
const SGST_RATE = 9

/**
 * Given a rate (inclusive of GST), compute the taxable amount
 * Taxable = Rate / (1 + GST_RATE/100)
 */
export function computeTaxableAmount(rate, quantity) {
  const totalAmount = parseFloat(rate) * parseFloat(quantity)
  const taxable = totalAmount / (1 + GST_RATE / 100)
  return taxable
}

export function computeCGST(taxableAmount) {
  return (taxableAmount * CGST_RATE) / 100
}

export function computeSGST(taxableAmount) {
  return (taxableAmount * SGST_RATE) / 100
}

export function computeItemTotals(rate, quantity) {
  const taxable = computeTaxableAmount(rate, quantity)
  const cgst = computeCGST(taxable)
  const sgst = computeSGST(taxable)
  const total = taxable + cgst + sgst
  return {
    taxableAmount: taxable,
    cgstAmount: cgst,
    sgstAmount: sgst,
    totalAmount: total,
    cgstRate: CGST_RATE,
    sgstRate: SGST_RATE,
  }
}

export function fmt(num) {
  return parseFloat(num || 0).toFixed(2)
}

// Convert number to Indian words
export function numberToWords(num) {
  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen',
  ]
  const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety',
  ]

  function convertHundreds(n) {
    let result = ''
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' Hundred '
      n %= 100
    }
    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + ' '
      n %= 10
    }
    if (n > 0) {
      result += ones[n] + ' '
    }
    return result
  }

  if (num === 0) return 'Zero Rupees Only'

  const rupees = Math.floor(num)
  const paise = Math.round((num - rupees) * 100)

  let result = ''

  if (rupees >= 10000000) {
    result += convertHundreds(Math.floor(rupees / 10000000)) + 'Crore '
  }
  if (rupees >= 100000) {
    result += convertHundreds(Math.floor((rupees % 10000000) / 100000)) + 'Lakh '
  }
  if (rupees >= 1000) {
    result += convertHundreds(Math.floor((rupees % 100000) / 1000)) + 'Thousand '
  }
  if (rupees >= 100) {
    result += convertHundreds(Math.floor((rupees % 1000) / 100)) + 'Hundred '
  }
  result += convertHundreds(rupees % 100)

  result = result.trim() + ' Rupees'

  if (paise > 0) {
    result += ' and ' + convertHundreds(paise).trim() + ' Paise'
  }

  return result + ' Only'
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

export function todayISO() {
  return new Date().toISOString().split('T')[0]
}
