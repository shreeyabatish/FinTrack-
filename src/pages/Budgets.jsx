import { useState } from "react";
import BudgetCard from "../components/BudgetCard";
import { useFinance } from "../context/FinanceContext.jsx";
import "../styles/Budgets.css";
import "../styles/Modal.css";

function Budgets() {
  const { budgets, addBudget, updateBudget, deleteBudget } = useFinance();

  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const safeBudgetData = Array.isArray(budgets) ? budgets : [];

  const totalBudget = safeBudgetData.reduce((sum, b) => sum + Number(b.amount || 0), 0);
  const totalSpent = safeBudgetData.reduce((sum, b) => sum + Number(b.spent || 0), 0);
  const remaining = totalBudget - totalSpent;
  const usedPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const handleSaveBudget = (e) => {
    e.preventDefault();
    const cleanCategory = category.trim();
    const numericAmount = Number(amount);

    if (!cleanCategory) {
      setError("Please enter a category.");
      return;
    }
    if (!numericAmount || numericAmount <= 0) {
      setError("Please enter a valid budget amount.");
      return;
    }
    const duplicate = safeBudgetData.find(
      (b) => b.category.toLowerCase() === cleanCategory.toLowerCase() && b.id !== editId
    );
    if (duplicate) {
      setError("This category already exists.");
      return;
    }

    if (editId) {
      updateBudget(editId, { category: cleanCategory, amount: numericAmount });
    } else {
      addBudget({ category: cleanCategory, amount: numericAmount });
    }

    setCategory("");
    setAmount("");
    setError("");
    setEditId(null);
    setShowModal(false);
  };

  const openEditModal = (budget) => {
    setCategory(budget.category);
    setAmount(budget.amount);
    setEditId(budget.id);
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCategory("");
    setAmount("");
    setError("");
    setEditId(null);
  };

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
        <button className="add-budget-btn" onClick={() => setShowModal(true)}>
          + Add Budget
        </button>
      </div>

      {/* SUMMARY */}
      <div className="budget-summary">
        <div className="summary-card">
          <span>Total Budget</span>
          <strong>₹{totalBudget.toLocaleString("en-IN")}</strong>
          <small>This month</small>
        </div>
        <div className="summary-card">
          <span>Total Spent</span>
          <strong>₹{totalSpent.toLocaleString("en-IN")}</strong>
          <small>{usedPercentage}% used</small>
        </div>
        <div className="summary-card">
          <span>Remaining</span>
          <strong className={remaining < 0 ? "negative-value" : ""}>
            ₹{Math.abs(remaining).toLocaleString("en-IN")}
          </strong>
          <small>{remaining >= 0 ? "Available to spend" : "Over budget"}</small>
        </div>
      </div>

      {/* OVERVIEW */}
      <div className="budgets-section-header">
        <div>
          <h2>Budget Overview</h2>
          <p>Your spending by category</p>
        </div>
        <span>{safeBudgetData.length} categories</span>
      </div>

      {/* CARDS */}
      {safeBudgetData.length === 0 ? (
        <div className="empty-budget-state">
          <div className="empty-budget-icon">💰</div>
          <h3>No budgets yet</h3>
          <p>Create your first monthly budget to start tracking your spending.</p>
          <button className="add-budget-btn" onClick={() => setShowModal(true)}>
            + Create Budget
          </button>
        </div>
      ) : (
        <div className="budgets-container">
          {safeBudgetData.map((budget) => (
            <div className="budget-wrapper" key={budget.id}>
              <div className="budget-actions-row">
                <button className="budget-edit-btn" onClick={() => openEditModal(budget)}>
                  Edit
                </button>
                <button className="budget-delete-btn" onClick={() => deleteBudget(budget.id)}>
                  Delete
                </button>
              </div>
              <BudgetCard
                category={budget.category}
                spent={Number(budget.spent || 0)}
                budget={Number(budget.amount || 0)}
              />
            </div>
          ))}
        </div>
      )}

      {/* MOTIVATIONAL TIP */}
      <div className="budget-tip">
        💡 Tip: Stay within your budgets to meet your financial goals!
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="page-label">BUDGET PLANNER</p>
                <h2>{editId ? "Edit Budget" : "Add Budget"}</h2>
              </div>
              <button type="button" className="modal-close" onClick={closeModal}>
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
              />

              <label>Monthly Budget</label>
              <div className="amount-input">
                <span>₹</span>
                <input
                  type="number"
                  placeholder="5000"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              {error && <p className="budget-error">{error}</p>}

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {editId ? "Update Budget" : "Save Budget"}
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
