import React, { useContext, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useFinance } from "../context/FinanceContext";


import "../styles/Dashboard.css";
import "../styles/Navbar.css";
import "../styles/Sidebar.css";

function Dashboard() {
  const {
    user,
    rewards,
    fetchRewards,
    transactions,
    fetchTransactions,
    totals,
    spentByCategory,
  } = useFinance();

  useEffect(() => {
    if (user) {
      fetchRewards(user.email);
      fetchTransactions();
    }
  }, [user]);

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN AREA */}
      <div className="main-area">
        {/* NAVBAR */}
        <Navbar />

        {/* DASHBOARD */}
        <main className="dashboard-main">
          {/* HEADER */}
          <section className="dashboard-welcome">
            <div>
              <p className="dashboard-eyebrow">FINANCIAL OVERVIEW</p>
              <h1>Good evening 👋</h1>
              <p className="dashboard-description">
                Here's what's happening with your money today.
              </p>
            </div>

            <div className="dashboard-date">{new Date().toLocaleDateString()}</div>
          </section>

          {/* BALANCE */}
          <section className="balance-section">
            <div>
              <p>AVAILABLE BALANCE</p>
              <h2>₹{totals.balance}</h2>
              <span>Current balance after your expenses</span>
            </div>
            <div className="balance-symbol">₹</div>
          </section>

          {/* SUMMARY */}
          <section className="summary-grid">
            <div className="summary-card">
              <div className="summary-top">
                <span>Total Income</span>
                <div className="summary-icon income-icon">↗</div>
              </div>
              <h3>₹{totals.income}</h3>
              <p>Money received</p>
            </div>

            <div className="summary-card">
              <div className="summary-top">
                <span>Total Expenses</span>
                <div className="summary-icon expense-icon">↘</div>
              </div>
              <h3>₹{totals.expense}</h3>
              <p>Money spent</p>
            </div>

            <div className="summary-card">
              <div className="summary-top">
                <span>Savings</span>
                <div className="summary-icon saving-icon">%</div>
              </div>
              <h3>
                {totals.income > 0
                  ? Math.round((totals.balance / totals.income) * 100)
                  : 0}
                %
              </h3>
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
                <button>View all</button>
              </div>

              {transactions.slice(-4).map((t) => (
                <div className="transaction" key={t.id}>
                  <div
                    className={`transaction-circle ${
                      t.type === "income" ? "income-circle" : "expense-circle"
                    }`}
                  >
                    {t.type === "income" ? "↗" : "↘"}
                  </div>
                  <div className="transaction-info">
                    <strong>{t.title || t.category}</strong>
                    <span>{t.category}</span>
                  </div>
                  <div className="transaction-date">
                    {new Date(t.date).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <strong
                    className={
                      t.type === "income"
                        ? "transaction-income"
                        : "transaction-expense"
                    }
                  >
                    {t.type === "income" ? "+" : "-"}₹{t.amount}
                  </strong>
                </div>
              ))}
            </div>

            {/* SPENDING */}
            <div className="dashboard-card-large">
              <div className="section-heading">
                <div>
                  <span>SPENDING</span>
                  <h2>Where Your Money Goes</h2>
                </div>
              </div>

              {Object.entries(spentByCategory).map(([category, amount]) => {
                const percentage =
                  totals.expense > 0
                    ? Math.round((amount / totals.expense) * 100)
                    : 0;
                return (
                  <div className="spending-item" key={category}>
                    <div className="spending-heading">
                      <span>{category}</span>
                      <strong>₹{amount}</strong>
                    </div>
                    <div className="progress">
                      <div
                        className="progress-fill"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <small>{percentage}% of expenses</small>
                  </div>
                );
              })}
            </div>
          </section>

          {/* BOTTOM INSIGHT */}
          <section className="dashboard-insight">
            <div className="insight-symbol">✦</div>
            <div>
              <span>FINANCIAL INSIGHT</span>
              <h2>You're doing well with your savings</h2>
              <p>
                You have ₹{totals.balance} remaining after your current expenses.
                Keep maintaining this balance.
              </p>
            </div>
            <div className="insight-value">
              <span>NET SAVINGS</span>
              <strong>₹{totals.balance}</strong>
            </div>
          </section>

          {/* REWARDS */}
          {user && (
            <section className="dashboard-rewards">
              <h2>Gamification Rewards</h2>
              <p><strong>Points:</strong> {rewards.points}</p>
              <p><strong>XP:</strong> {rewards.xp}</p>
              <p><strong>Level:</strong> {rewards.level}</p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
