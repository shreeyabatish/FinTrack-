
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFinance } from "../context/FinanceContext.jsx";
import "../styles/Transactions.css";
import "../styles/Modal.css";

function Transactions() {
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    user,
  } = useFinance();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    amount: "",
    type: "expense",
    date: "",
  });

  // Search and filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const title = transaction.title || "";
    const category = transaction.category || "";

    const matchesSearch =
      title.toLowerCase().includes(search.toLowerCase()) ||
      category.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" || transaction.type === filter;

    return matchesSearch && matchesFilter;
  });

  // Handle form input changes
  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // Add a transaction
  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.category.trim() ||
      !formData.amount ||
      !formData.date
    ) {
      alert("Please fill all fields.");
      return;
    }

    const amount = Number(formData.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Please enter an amount greater than 0.");
      return;
    }

    try {
      setSaving(true);

      await addTransaction({
        title: formData.title.trim(),
        category: formData.category.trim(),
        amount,
        type: formData.type,
        date: formData.date,
        email: user?.email || user?.accountEmail || "",
      });

      setFormData({
        title: "",
        category: "",
        amount: "",
        type: "expense",
        date: "",
      });

      setShowModal(false);
      alert("Transaction added successfully.");
    } catch (error) {
      console.error("Unable to add transaction:", error);
      alert(
        error.response?.data?.error ||
          error.message ||
          "Could not add transaction. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  // Delete a transaction
  async function handleDelete(id) {
    if (!id) {
      alert("Transaction ID is missing. Please refresh the page and try again.");
      console.error("Transaction has no id or _id.");
      return;
    }

    if (!window.confirm("Delete this transaction?")) {
      return;
    }

    try {
      await deleteTransaction(id);
      alert("Transaction deleted successfully.");
    } catch (error) {
      console.error(
        "Deleting transaction failed:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.error ||
          "Could not delete transaction. Check the browser console for details."
      );
    }
  }

  // Format transaction date
  function formatDate(transaction) {
    const dateValue = transaction.date || transaction.createdAt;

    if (!dateValue) {
      return "—";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString();
  }

  return (
    <div className="transactions-page">
      <div className="transactions-header">
        <div>
          <h1>Transactions</h1>
          <p>View and manage your income and expenses.</p>
        </div>

        <button
          type="button"
          className="add-transaction-btn"
          onClick={() => setShowModal(true)}
        >
          + Add Transaction
        </button>
      </div>

      <div className="transactions-controls">
        <input
          type="text"
          placeholder="Search by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search transactions"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter transactions"
        >
          <option value="all">All Transactions</option>
          <option value="income">Income</option>
          <option value="expense">Expenses</option>
        </select>
      </div>

      <div className="transactions-list">
        {filteredTransactions.length === 0 ? (
          <div className="no-transactions">
            <h3>No transactions found</h3>
            <p>
              {search || filter !== "all"
                ? "Try changing your search or filter."
                : "Add your first transaction to get started."}
            </p>
          </div>
        ) : (
          filteredTransactions
            .slice()
            .reverse()
            .map((transaction) => {
              // MongoDB commonly returns _id rather than id.
              const transactionId =
                transaction.id || transaction._id;

              return (
                <div
                  className="transaction-row"
                  key={transactionId}
                >
                  <div className="transaction-info">
                    <Link
                      to={
                        transactionId
                          ? `/transactions/${transactionId}`
                          : "#"
                      }
                      className="transaction-title"
                      onClick={(e) => {
                        if (!transactionId) {
                          e.preventDefault();
                        }
                      }}
                    >
                      {transaction.title || "Untitled transaction"}
                    </Link>

                    <div className="transaction-meta">
                      <span>
                        {transaction.category || "Uncategorized"}
                      </span>
                      <span>{formatDate(transaction)}</span>
                    </div>
                  </div>

                  <div className="transaction-actions">
                    <span
                      className={`transaction-amount ${
                        transaction.type === "income"
                          ? "income"
                          : "expense"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      ₹
                      {Number(transaction.amount || 0).toLocaleString(
                        "en-IN"
                      )}
                    </span>

                    <button
                      type="button"
                      className="delete-btn"
                      aria-label={`Delete ${
                        transaction.title || "transaction"
                      }`}
                      title="Delete transaction"
                      onClick={() => handleDelete(transactionId)}
                    >
                      ✖
                    </button>
                  </div>
                </div>
              );
            })
        )}
      </div>

      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget && !saving) {
              setShowModal(false);
            }
          }}
        >
          <div
            className="modal-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="transaction-modal-title"
          >
            <div className="modal-header">
              <h2 id="transaction-modal-title">
                Add Transaction
              </h2>

              <button
                type="button"
                className="modal-close"
                onClick={() => setShowModal(false)}
                disabled={saving}
                aria-label="Close modal"
              >
                ✖
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g. Groceries"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <input
                  id="category"
                  name="category"
                  type="text"
                  placeholder="e.g. Food"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="amount">Amount (₹)</label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  placeholder="Enter amount"
                  min="0.01"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Transaction Type</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Transaction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;
