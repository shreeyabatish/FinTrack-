import React, { useState } from 'react'
import { categories } from '../data/sampleData.js'
import '../styles/Transactions.css'

const emptyForm = {
  amount: '',
  type: 'expense',
  category: 'Food',
  date: new Date().toISOString().slice(0, 10),
  description: '',
}

export default function TransactionForm({ onSubmit, onClose }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function validate() {
    const newErrors = {}
    if (!form.amount || Number(form.amount) <= 0) {
      newErrors.amount = 'Enter an amount greater than 0'
    }
    if (!form.date) {
      newErrors.date = 'Pick a date'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    onSubmit({ ...form, amount: Number(form.amount) })
    setForm(emptyForm)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal-box" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h3>Add Transaction</h3>

        <div className="form-group">
          <label>Amount (₹)</label>
          <input type="number" name="amount" value={form.amount} onChange={handleChange} />
          {errors.amount && <div className="form-error">{errors.amount}</div>}
        </div>

        <div className="form-group">
          <label>Type</label>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div className="form-group">
          <label>Category</label>
          <select name="category" value={form.category} onChange={handleChange}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Date</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} />
          {errors.date && <div className="form-error">{errors.date}</div>}
        </div>

        <div className="form-group">
          <label>Description</label>
          <input type="text" name="description" value={form.description} onChange={handleChange} />
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn">
            Add
          </button>
        </div>
      </form>
    </div>
  )
}
