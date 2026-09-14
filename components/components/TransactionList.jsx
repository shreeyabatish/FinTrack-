import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/Transactions.css'

export default function TransactionList({ transactions, onDelete }) {
  if (transactions.length === 0) {
    return <p style={{ padding: 20 }}>No transactions found.</p>
  }

  return (
    <div className="panel">
      {transactions.map((t) => (
        <div className="tx-list-row" key={t.id}>
          <Link to={`/transactions/${t.id}`} className="tx-info">
            <div>{t.category}</div>
            <div className="tx-desc">
              {t.date} {t.description && '- ' + t.description}
            </div>
          </Link>
          <div className="tx-actions">
            <span className={t.type === 'expense' ? 'type-badge expense' : 'type-badge'}>{t.type}</span>
            <span className={t.type === 'income' ? 'amount-income' : 'amount-expense'}>
              {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
            </span>
            <button className="delete-btn" onClick={() => onDelete(t.id)}>
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
