
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFinance } from "../context/FinanceContext.jsx";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const {
    user,
    rewards,
    fetchRewards,
    transactions,
    fetchTransactions,
    budgets,
    fetchBudgets,
    spentByCategory,
  } = useFinance();

  // Ensure data is always treated as arrays.
  const safeTransactions = Array.isArray(transactions)
    ? transactions
    : [];

  const safeBudgets = Array.isArray(budgets)
    ? budgets
    : [];

  // Calculate total budget.
  const totalBudget = safeBudgets.reduce(
    (sum, budget) => sum + Number(budget.amount || 0),
    0
  );

  // Calculate income from transactions.
  const totalIncome = safeTransactions
    .filter(
      (transaction) =>
        String(transaction.type).toLowerCase() === "income"
    )
    .reduce(
      (sum, transaction) =>
        sum + Number(transaction.amount || 0),
      0
    );

  // Calculate expenses from transactions.
  const totalExpenses = safeTransactions
    .filter(
      (transaction) =>
        String(transaction.type).toLowerCase() === "expense"
    )
    .reduce(
      (sum, transaction) =>
        sum + Number(transaction.amount || 0),
      0
    );

  // Requested formula:
  // Available Balance = Budget - Expenses + Income
  const availableBalance =totalIncome-
    totalExpenses  ;

  // Savings percentage based on the calculated balance.
  const savingsPercentage =
    totalIncome > 0
      ? Math.round((availableBalance / totalIncome) * 100)
      : 0;

  // Fetch the latest information when the logged-in user changes.
  useEffect(() => {
    if (user) {
      fetchRewards();
      fetchTransactions();

      if (typeof fetchBudgets === "function") {
        fetchBudgets();
      }
    }
  }, [user, fetchRewards, fetchTransactions, fetchBudgets]);

  // Format currency consistently.
  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

  // Use MongoDB _id when the API does not provide id.
  const getTransactionId = (transaction) =>
    transaction._id || transaction.id;

  // Calculate category spending percentages.
  const categorySpending =
    spentByCategory && typeof spentByCategory === "object"
      ? Object.entries(spentByCategory)
      : [];

  return (
    <main className="dashboard-main">
      {/* HEADER */}
      <section className="dashboard-welcome">
        <div>
          <p className="dashboard-eyebrow">
            FINANCIAL OVERVIEW
          </p>

          <h1>Good evening 👋</h1>

          <p className="dashboard-description">
            Here's what's happening with your money today.
          </p>
        </div>

        <div className="dashboard-date">
          {new Date().toLocaleDateString("en-IN")}
        </div>
      </section>

      {/* AVAILABLE BALANCE */}
      <section className="balance-section">
        <div>
          <p>AVAILABLE BALANCE</p>

          <h2>
            ₹{formatCurrency(availableBalance)}
          </h2>

          <span>
            Budget remaining after expenses, plus income
          </span>
        </div>

        <div className="balance-symbol">₹</div>
      </section>

      {/* SUMMARY CARDS */}
      <section className="summary-grid">
        {/* INCOME */}
        <div className="summary-card">
          <div className="summary-top">
            <span>Total Income</span>
            <div className="summary-icon income-icon">
              ↗
            </div>
          </div>

          <h3>₹{formatCurrency(totalIncome)}</h3>

          <p>Money received</p>
        </div>

        {/* EXPENSES */}
        <div className="summary-card">
          <div className="summary-top">
            <span>Total Expenses</span>
            <div className="summary-icon expense-icon">
              ↘
            </div>
          </div>

          <h3>₹{formatCurrency(totalExpenses)}</h3>

          <p>Money spent</p>
        </div>

        {/* SAVINGS */}
        <div className="summary-card">
          <div className="summary-top">
            <span>Savings</span>
            <div className="summary-icon saving-icon">
              %
            </div>
          </div>

          <h3>{savingsPercentage}%</h3>

          <p>Of your total income</p>
        </div>
      </section>

      {/* LOWER CONTENT */}
      <section className="dashboard-grid">
        {/* RECENT TRANSACTIONS */}
        <div className="dashboard-card-large">
          <div className="section-heading">
            <div>
              <span>ACTIVITY</span>
              <h2>Recent Transactions</h2>
            </div>

            <button onClick={() => navigate("/transactions")}>
              View all
            </button>
          </div>

          {safeTransactions.length === 0 ? (
            <p>No transactions yet. Add a transaction to get started.</p>
          ) : (
            safeTransactions.slice(-4).reverse().map((transaction) => (
              <div
                className="transaction"
                key={getTransactionId(transaction)}
              >
                <div
                  className={`transaction-circle ${
                    String(transaction.type).toLowerCase() === "income"
                      ? "income-circle"
                      : "expense-circle"
                  }`}
                >
                  {String(transaction.type).toLowerCase() === "income"
                    ? "↗"
                    : "↘"}
                </div>

                <div className="transaction-info">
                  <strong>
                    {transaction.title || transaction.category}
                  </strong>

                  <span>{transaction.category}</span>
                </div>

                <div className="transaction-date">
                  {transaction.date || transaction.createdAt
                    ? new Date(
                        transaction.date || transaction.createdAt
                      ).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}
                </div>

                <strong
                  className={
                    String(transaction.type).toLowerCase() === "income"
                      ? "transaction-income"
                      : "transaction-expense"
                  }
                >
                  {String(transaction.type).toLowerCase() === "income"
                    ? "+"
                    : "-"}
                  ₹{formatCurrency(transaction.amount)}
                </strong>
              </div>
            ))
          )}
        </div>

        {/* SPENDING BY CATEGORY */}
        <div className="dashboard-card-large">
          <div className="section-heading">
            <div>
              <span>SPENDING</span>
              <h2>Where Your Money Goes</h2>
            </div>
          </div>

          {categorySpending.length === 0 ? (
            <p>No spending recorded yet.</p>
          ) : (
            categorySpending.map(([category, amount]) => {
              const percentage =
                totalExpenses > 0
                  ? Math.round(
                      (Number(amount || 0) / totalExpenses) * 100
                    )
                  : 0;

              return (
                <div className="spending-item" key={category}>
                  <div className="spending-heading">
                    <span>{category}</span>
                    <strong>
                      ₹{formatCurrency(amount)}
                    </strong>
                  </div>

                  <div className="progress">
                    <div
                      className="progress-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <small>{percentage}% of expenses</small>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* FINANCIAL INSIGHT */}
      <section className="dashboard-insight">
        <div className="insight-symbol">✦</div>

        <div>
          <span>FINANCIAL INSIGHT</span>

          <h2>
            {availableBalance >= 0
              ? "Keep working toward your financial goals"
              : "Your expenses have exceeded your budget and income"}
          </h2>

          <p>
            Your calculated available balance is ₹
            {formatCurrency(availableBalance)}.
            Keep tracking your income and expenses.
          </p>
        </div>

        <div className="insight-value">
          <span>AVAILABLE BALANCE</span>
          <strong>₹{formatCurrency(availableBalance)}</strong>
        </div>
      </section>

      {/* REWARDS */}
      {user && (
        <section className="dashboard-rewards">
          <h2>Gamification Rewards</h2>

          <p>
            <strong>Points:</strong> {rewards?.points ?? 0}
          </p>

          <p>
            <strong>XP:</strong> {rewards?.xp ?? 0}
          </p>

          <p>
            <strong>Level:</strong> {rewards?.level ?? 1}
          </p>
        </section>
      )}
    </main>
  );
}

export default Dashboard;
