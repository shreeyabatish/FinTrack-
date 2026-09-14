import React from 'react'
import { useFinance } from '../context/FinanceContext.jsx'

export default function Profile() {
  const { userName, transactions, totals } = useFinance()

  return (
    <div>
      <h1>Profile</h1>
      <div style={{ background: 'white', padding: 20, borderRadius: 8, maxWidth: 400 }}>
        <p>
          <strong>Name:</strong> {userName}
        </p>
        <p>
          <strong>Transactions logged:</strong> {transactions.length}
        </p>
        <p>
          <strong>Current balance:</strong> ₹{totals.balance.toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  )
}
