import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFinance } from "../context/FinanceContext.jsx";
import "../styles/Transactions.css";
import "../styles/Modal.css";

function Transactions() {
  const { transactions, addTransaction, deleteTransaction, user } = useFinance();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    amount: "",
    type: "expense",
    date: "",
  });

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.title?.toLowerCase().includes(search.toLowerCase()) ||
      transaction.category?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "all" || transaction.type === filter;

    return matchesSearch && matchesFilter;
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.amount || !formData.date) {
      alert("Please fill all fields.");
      return;
    }

    addTransaction({
      ...formData,
      email: user?.email || "", // include user email for rewards
      amount: Number(formData.amount),
    });

    setFormData({
      title: "",
      category: "",
      amount: "",
      type: "expense",
      date: "",
    });

    setShowModal(false);
  }

  function handleDelete(id) {
    if (window.confirm("Delete this transaction?")) {
      deleteTransaction(id);
    }
  }

  return (
    <div className="transactions-page">
      {/* Header */}
      <div className="transactions-header">
        <div>
          <p className="page-label">FINANCIAL ACTIVITY</p>
          <h1>Transactions</h1>
          <p className="page-subtitle">
            Manage and track all your income and expenses.
          </p>
        </div>

        <button
          className="add-transaction-btn"
          onClick={() => setShowModal(true)}
        >
          + Add Transaction
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Transaction</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Groceries"
              />

              <label>Category</label>
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Food"
              />

              <label>Amount</label>
              <div className="amount-input">
                <span>₹</span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>

              <label>Type</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>

              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="transaction-toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-buttons">
          <button
            className={filter === "all" ? "active-filter" : ""}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={filter === "income" ? "active-filter" : ""}
            onClick={() => setFilter("income")}
          >
            Income
          </button>
          <button
            className={filter === "expense" ? "active-filter" : ""}
            onClick={() => setFilter("expense")}
          >
            Expenses
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="transactions-card">
        <div className="transactions-card-header">
          <div>
            <h2>Recent Transactions</h2>
            <span>{filteredTransactions.length} transactions</span>
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="empty-transactions">
            <div className="empty-icon">↔</div>
            <h3>No transactions found</h3>
            <p>Try changing your search or add a new transaction.</p>
          </div>
        ) : (
          <div className="transaction-list">
            {filteredTransactions
              .slice()
              .reverse()
              .map((transaction) => (
                <div className="transaction-row" key={transaction.id}>
                  <div className="transaction-icon">
                    {transaction.type === "income" ? "↗" : "↘"}
                  </div>

                  <div className="transaction-main">
                    <Link
                      to={`/transactions/${transaction.id}`}
                      className="transaction-title"
                    >
                      {transaction.title}
                    </Link>
                    <span className="transaction-category">
                      {transaction.category}
                    </span>
                  </div>

                  <div className="transaction-date">{transaction.date}</div>

                  <div
                    className={`transaction-amount ${
                      transaction.type === "income"
                        ? "income-amount"
                        : "expense-amount"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}₹
                    {Number(transaction.amount).toLocaleString("en-IN")}
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(transaction.id)}
                  >
                    ✖
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Transactions;
