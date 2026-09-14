import React from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useFinance } from '../context/FinanceContext.jsx'

export default function TransactionDetail() {
  const { id } = useParams()
  const { transactions, deleteTransaction } = useFinance()
  const navigate = useNavigate()

  const tx = transactions.find((t) => String(t.id) === id)

  if (!tx) {
    return (
      <div>
        <p>No transaction found with id {id}.</p>
        <Link to="/transactions" className="btn btn-secondary">
          Back to transactions
        </Link>
      </div>
    )
  }

  function handleDelete() {
    deleteTransaction(tx.id)
    navigate('/transactions')
  }

  return (
    <div>
      <h1>{tx.category}</h1>
      <div style={{ background: 'white', padding: 20, borderRadius: 8, maxWidth: 400 }}>
        <p>
          <strong>Amount:</strong> {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
        </p>
        <p>
          <strong>Type:</strong> {tx.type}
        </p>
        <p>
          <strong>Date:</strong> {tx.date}
        </p>
        <p>
          <strong>Description:</strong> {tx.description || '-'}
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 15 }}>
          <Link to="/transactions" className="btn btn-secondary">
            Back
          </Link>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
