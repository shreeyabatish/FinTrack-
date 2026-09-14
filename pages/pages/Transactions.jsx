import React, { useState } from 'react'
import { useFinance } from '../context/FinanceContext.jsx'
import TransactionList from '../components/TransactionList.jsx'
import TransactionForm from '../components/TransactionForm.jsx'
import '../styles/Transactions.css'

export default function Transactions() {
  const { transactions, addTransaction, deleteTransaction } = useFinance()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)

  const filtered = transactions.filter((t) => {
    const matchesFilter = filter === 'All' || t.type === filter.toLowerCase()
    const matchesSearch =
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
        <h1>Transactions</h1>
        <button className="btn" onClick={() => setShowForm(true)}>
          + Add Transaction
        </button>
      </div>

      <div className="tx-toolbar">
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {['All', 'Income', 'Expense'].map((f) => (
          <button
            key={f}
            className={filter === f ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <TransactionList transactions={filtered} onDelete={deleteTransaction} />

      {showForm && (
        <TransactionForm
          onClose={() => setShowForm(false)}
          onSubmit={(tx) => {
            addTransaction(tx)
            setShowForm(false)
          }}
        />
      )}
    </div>
  )
}
