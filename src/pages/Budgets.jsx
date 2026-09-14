import { useState } from "react";
import BudgetCard from "../components/BudgetCard";
import { useFinance } from "../context/FinanceContext.jsx";
import "../styles/Budgets.css";

function Budgets() {
    const {
        budgetData,
        addBudget,
        deleteBudget
    } = useFinance();

    const [showModal, setShowModal] = useState(false);
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");

    const safeBudgetData = Array.isArray(budgetData)
        ? budgetData
        : [];

    const totalBudget = safeBudgetData.reduce(
        (sum, budget) => {
            return sum + Number(budget.amount || 0);
        },
        0
    );

    const totalSpent = safeBudgetData.reduce(
        (sum, budget) => {
            return sum + Number(budget.spent || 0);
        },
        0
    );

    const remaining = totalBudget - totalSpent;

    const usedPercentage =
        totalBudget > 0
            ? Math.round((totalSpent / totalBudget) * 100)
            : 0;

    const handleAddBudget = (e) => {
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

        addBudget({
            category: cleanCategory,
            amount: numericAmount
        });

        setCategory("");
        setAmount("");
        setError("");
        setShowModal(false);
    };

    const closeModal = () => {
        setShowModal(false);
        setCategory("");
        setAmount("");
        setError("");
    };

    return (
        <div className="budgets-page">

            {/* PAGE HEADER */}

            <div className="budgets-header">

                <div>
                    <p className="page-label">
                        FINANCIAL PLANNING
                    </p>

                    <h1>
                        Monthly Budgets
                    </h1>

                    <p className="budgets-subtitle">
                        Keep your spending under control across every category.
                    </p>
                </div>

                <button
                    className="add-budget-btn"
                    onClick={() => {
                        setError("");
                        setShowModal(true);
                    }}
                >
                    + Add Budget
                </button>

            </div>


            {/* SUMMARY CARDS */}

            <div className="budget-summary">

                <div className="summary-card">

                    <span>
                        Total Budget
                    </span>

                    <strong>
                        ₹{totalBudget.toLocaleString("en-IN")}
                    </strong>

                    <small>
                        This month
                    </small>

                </div>


                <div className="summary-card">

                    <span>
                        Total Spent
                    </span>

                    <strong>
                        ₹{totalSpent.toLocaleString("en-IN")}
                    </strong>

                    <small>
                        {usedPercentage}% used
                    </small>

                </div>


                <div className="summary-card">

                    <span>
                        Remaining
                    </span>

                    <strong
                        className={
                            remaining < 0
                                ? "negative-value"
                                : ""
                        }
                    >
                        ₹{Math.abs(remaining).toLocaleString("en-IN")}
                    </strong>

                    <small>
                        {remaining >= 0
                            ? "Available to spend"
                            : "Over budget"}
                    </small>

                </div>

            </div>


            {/* OVERVIEW HEADER */}

            <div className="budgets-section-header">

                <div>

                    <h2>
                        Budget Overview
                    </h2>

                    <p>
                        Your spending by category
                    </p>

                </div>

                <span>
                    {safeBudgetData.length} categories
                </span>

            </div>


            {/* BUDGET CARDS */}

            {safeBudgetData.length === 0 ? (

                <div className="empty-budget-state">

                    <div className="empty-budget-icon">
                        💰
                    </div>

                    <h3>
                        No budgets yet
                    </h3>

                    <p>
                        Create your first monthly budget to start tracking your spending.
                    </p>

                    <button
                        className="add-budget-btn"
                        onClick={() => setShowModal(true)}
                    >
                        + Create Budget
                    </button>

                </div>

            ) : (

                <div className="budgets-container">

                    {safeBudgetData.map((budget) => (

                        <div
                            className="budget-wrapper"
                            key={budget.id}
                        >

                            <div className="budget-delete-row">

                                <button
                                    className="budget-delete-btn"
                                    onClick={() =>
                                        deleteBudget(budget.id)
                                    }
                                >
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


            {/* ADD BUDGET MODAL */}

            {showModal && (

                <div
                    className="budget-modal-overlay"
                    onClick={closeModal}
                >

                    <div
                        className="budget-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <div>

                                <p className="page-label">
                                    BUDGET PLANNER
                                </p>

                                <h2>
                                    Add Budget
                                </h2>

                            </div>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={closeModal}
                            >
                                ×
                            </button>

                        </div>


                        <form onSubmit={handleAddBudget}>

                            <label>
                                Category
                            </label>

                            <input
                                type="text"
                                placeholder="e.g. Food"
                                value={category}
                                onChange={(e) =>
                                    setCategory(e.target.value)
                                }
                            />


                            <label>
                                Monthly Budget
                            </label>

                            <div className="amount-input">

                                <span>
                                    ₹
                                </span>

                                <input
                                    type="number"
                                    placeholder="5000"
                                    min="1"
                                    value={amount}
                                    onChange={(e) =>
                                        setAmount(e.target.value)
                                    }
                                />

                            </div>


                            {error && (

                                <p className="budget-error">
                                    {error}
                                </p>

                            )}


                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-budget-btn"
                                >
                                    Save Budget
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