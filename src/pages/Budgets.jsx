
import { useState } from "react";
import BudgetCard from "../components/BudgetCard";
import { useFinance } from "../context/FinanceContext.jsx";
import "../styles/Budgets.css";
import "../styles/Modal.css";

function Budgets() {
  const {
    budgets,
    transactions,
    addBudget,
    updateBudget,
    deleteBudget,
  } = useFinance();

  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const safeBudgets = Array.isArray(budgets) ? budgets : [];
  const safeTransactions = Array.isArray(transactions)
    ? transactions
    : [];

  // Calculate spending for a particular budget category.
  const getCategorySpent = (budgetCategory) => {
    return safeTransactions
      .filter(
        (transaction) =>
          String(transaction.type).toLowerCase() === "expense" &&
          String(transaction.category || "").trim().toLowerCase() ===
            String(budgetCategory || "").trim().toLowerCase()
      )
      .reduce(
        (sum, transaction) => sum + Number(transaction.amount || 0),
        0
      );
  };

  const getBudgetId = (budget) => budget?._id || budget?.id;

  const totalBudget = safeBudgets.reduce(
    (sum, budget) => sum + Number(budget.amount || 0),
    0
  );

  // Total expenses across all categories, including categories
  // that do not have a budget.
  const totalSpent = safeTransactions
    .filter(
      (transaction) =>
        String(transaction.type).toLowerCase() === "expense"
    )
    .reduce(
      (sum, transaction) => sum + Number(transaction.amount || 0),
      0
    );

  const remaining = totalBudget - totalSpent;

  const usedPercentage =
    totalBudget > 0
      ? Math.round((totalSpent / totalBudget) * 100)
      : 0;

  const openAddModal = () => {
    setCategory("");
    setAmount("");
    setEditId(null);
    setError("");
    setShowModal(true);
  };

  const openEditModal = (budget) => {
    const id = getBudgetId(budget);

    if (!id) {
      setError("Budget ID is missing. Please refresh the page.");
      return;
    }

    setCategory(budget.category || "");
    setAmount(String(budget.amount ?? ""));
    setEditId(id);
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setCategory("");
    setAmount("");
    setEditId(null);
    setError("");
  };

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    setError("");

    const cleanCategory = category.trim();
    const numericAmount = Number(amount);

    if (!cleanCategory) {
      setError("Please enter a category.");
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid budget amount.");
      return;
    }

    const duplicate = safeBudgets.find((budget) => {
      const sameCategory =
        String(budget.category || "").trim().toLowerCase() ===
        cleanCategory.toLowerCase();

      const sameBudget =
        String(getBudgetId(budget)) === String(editId);

      return sameCategory && !sameBudget;
    });

    if (duplicate) {
      setError("This category already exists.");
      return;
    }

    setSaving(true);

    try {
      if (editId) {
        await updateBudget({
          id: editId,
          category: cleanCategory,
          amount: numericAmount,
        });
      } else {
        await addBudget({
          category: cleanCategory,
          amount: numericAmount,
        });
      }

      setShowModal(false);
      setCategory("");
      setAmount("");
      setEditId(null);
      setError("");
    } catch (err) {
      console.error("Error saving budget:", err);
      setError(err.message || "Could not save the budget.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBudget = async (budget) => {
    const id = getBudgetId(budget);

    if (!id) {
      alert("Budget ID is missing. Please refresh the page.");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete the ${budget.category} budget?`
      )
    ) {
      return;
    }

    setDeletingId(id);

    try {
      await deleteBudget(id);
    } catch (err) {
      console.error("Error deleting budget:", err);
      alert(err.message || "Could not delete the budget.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString("en-IN");

  return (
    <div className="budgets-page">
      {/* HEADER */}
      <div className="budgets-header">
        <div>
          <p className="page-label">FINANCIAL PLANNING</p>
          <h1>Monthly Budgets</h1>
          <p className="budgets-subtitle">
            Keep your spending under control across every category.
          </p>
        </div>

        <button className="add-budget-btn" onClick={openAddModal}>
          + Add Budget
        </button>
      </div>

      {/* SUMMARY */}
      <div className="budget-summary">
        <div className="summary-card">
          <span>Total Budget</span>
          <strong>₹{formatCurrency(totalBudget)}</strong>
          <small>This month</small>
        </div>

        <div className="summary-card">
          <span>Total Spent</span>
          <strong>₹{formatCurrency(totalSpent)}</strong>
          <small>{usedPercentage}% of total budgets</small>
        </div>

        <div className="summary-card">
          <span>Remaining</span>
          <strong className={remaining < 0 ? "negative-value" : ""}>
            ₹{formatCurrency(Math.abs(remaining))}
          </strong>
          <small>
            {remaining >= 0 ? "Available in budgets" : "Over budget"}
          </small>
        </div>
      </div>

      {/* BUDGET OVERVIEW */}
      <div className="budgets-section-header">
        <div>
          <h2>Budget Overview</h2>
          <p>Your spending by category</p>
        </div>

        <span>{safeBudgets.length} categories</span>
      </div>

      {/* BUDGET CARDS */}
      {safeBudgets.length === 0 ? (
        <div className="empty-budget-state">
          <div className="empty-budget-icon">💰</div>
          <h3>No budgets yet</h3>
          <p>
            Create your first monthly budget to start tracking your spending.
          </p>

          <button className="add-budget-btn" onClick={openAddModal}>
            + Create Budget
          </button>
        </div>
      ) : (
        <div className="budgets-container">
          {safeBudgets.map((budget) => {
            const id = getBudgetId(budget);
            const spent = getCategorySpent(budget.category);
            const limit = Number(budget.amount || 0);
            const categoryRemaining = limit - spent;

            return (
              <div className="budget-wrapper" key={id}>
                <div className="budget-actions-row">
                  <button
                    className="budget-edit-btn"
                    onClick={() => openEditModal(budget)}
                    disabled={saving || deletingId === id}
                  >
                    Edit
                  </button>

                  <button
                    className="budget-delete-btn"
                    onClick={() => handleDeleteBudget(budget)}
                    disabled={deletingId === id}
                  >
                    {deletingId === id ? "Deleting..." : "Delete"}
                  </button>
                </div>

                <BudgetCard
                  category={budget.category}
                  spent={spent}
                  budget={limit}
                />

                <div className="budget-spending-details">
                  <p>
                    <strong>Spent:</strong> ₹{formatCurrency(spent)}
                  </p>

                  <p>
                    <strong>Remaining:</strong>{" "}
                    <span
                      className={
                        categoryRemaining < 0 ? "negative-value" : ""
                      }
                    >
                      ₹{formatCurrency(Math.abs(categoryRemaining))}
                    </span>
                  </p>

                  {categoryRemaining < 0 && (
                    <p className="negative-value">
                      You are ₹{formatCurrency(Math.abs(categoryRemaining))}{" "}
                      over this budget.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TIP */}
      <div className="budget-tip">
        💡 Tip: Stay within your budgets to meet your financial goals!
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="page-label">BUDGET PLANNER</p>
                <h2>{editId ? "Edit Budget" : "Add Budget"}</h2>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveBudget}>
              <label>Category</label>
              <input
                type="text"
                placeholder="e.g. Food"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={saving}
                required
              />

              <label>Monthly Budget</label>
              <div className="amount-input">
                <span>₹</span>
                <input
                  type="number"
                  placeholder="3000"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={saving}
                  required
                />
              </div>

              {error && (
                <p className="budget-error">{error}</p>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editId
                      ? "Update Budget"
                      : "Save Budget"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Budgets;
