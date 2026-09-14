import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useFinance } from '../context/FinanceContext.jsx'

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useFinance()
  const location = useLocation()

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}
