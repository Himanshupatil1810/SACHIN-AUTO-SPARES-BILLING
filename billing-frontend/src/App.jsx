import { Routes, Route, Navigate } from 'react-router-dom'
import BillForm from './pages/BillForm'
import InvoicePage from './pages/InvoicePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/bill/new" replace />} />
      <Route path="/bill/new" element={<BillForm />} />
      <Route path="/invoice/:billNumber" element={<InvoicePage />} />
    </Routes>
  )
}

export default App
