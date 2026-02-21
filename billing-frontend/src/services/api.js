const BASE_URL = '/api'

/**
 * Generate a new GST bill
 * @param {Object} billData - The bill payload
 * @returns {Promise<Object>} - Generated bill with billNumber
 */
export async function generateBill(billData) {
  const response = await fetch(`${BASE_URL}/bills/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(billData),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Server error' }))
    throw new Error(error.message || `HTTP error ${response.status}`)
  }

  return response.json()
}

/**
 * Fetch a bill by bill number
 * @param {string} billNumber
 * @returns {Promise<Object>}
 */
export async function getBillByNumber(billNumber) {
  const response = await fetch(`${BASE_URL}/bills/${billNumber}`)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Server error' }))
    throw new Error(error.message || `HTTP error ${response.status}`)
  }

  return response.json()
}

/**
 * Fetch all bills (list view)
 * @returns {Promise<Array>}
 */
export async function getAllBills() {
  const response = await fetch(`${BASE_URL}/bills`)

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`)
  }

  return response.json()
}
