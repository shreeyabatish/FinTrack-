import React, { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useFinance } from '../context/FinanceContext.jsx'
import '../styles/Login.css'

export default function Login() {
  const { isLoggedIn, login } = useFinance()
  const [name, setName] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />
  }

  function handleSubmit(e) {
    e.preventDefault()
    login(name.trim() || 'Guest')
    const from = location.state?.from?.pathname || '/dashboard'
    navigate(from, { replace: true })
  }

  return (
    <div className="login-screen">
      <div className="login-box">
        <h1>FinStack</h1>
        <p>Sign in to see your finances.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your name</label>
            <input type="text" placeholder="e.g. Priya" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <button type="submit" className="btn" style={{ width: '100%' }}>
            Log in
          </button>
        </form>
        <p className="login-hint">Demo login - no password needed.</p>
      </div>
    </div>
  )
}
