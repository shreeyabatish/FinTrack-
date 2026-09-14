import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import "../styles/Dashboard.css";
import "../styles/Navbar.css";
import "../styles/Sidebar.css";

function Dashboard() {
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
                            <p className="dashboard-eyebrow">
                                FINANCIAL OVERVIEW
                            </p>

                            <h1>Good evening 👋</h1>

                            <p className="dashboard-description">
                                Here's what's happening with your money today.
                            </p>
                        </div>

                        <div className="dashboard-date">
                            September 2026
                        </div>
                    </section>

                    {/* BALANCE */}
                    <section className="balance-section">
                        <div>
                            <p>AVAILABLE BALANCE</p>
                            <h2>₹24,850</h2>
                            <span>Current balance after your expenses</span>
                        </div>

                        <div className="balance-symbol">
                            ₹
                        </div>
                    </section>

                    {/* SUMMARY */}
                    <section className="summary-grid">

                        <div className="summary-card">
                            <div className="summary-top">
                                <span>Total Income</span>
                                <div className="summary-icon income-icon">
                                    ↗
                                </div>
                            </div>

                            <h3>₹45,000</h3>

                            <p>Money received</p>
                        </div>

                        <div className="summary-card">
                            <div className="summary-top">
                                <span>Total Expenses</span>
                                <div className="summary-icon expense-icon">
                                    ↘
                                </div>
                            </div>

                            <h3>₹20,150</h3>

                            <p>Money spent</p>
                        </div>

                        <div className="summary-card">
                            <div className="summary-top">
                                <span>Savings</span>
                                <div className="summary-icon saving-icon">
                                    %
                                </div>
                            </div>

                            <h3>55%</h3>

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

                            <div className="transaction">

                                <div className="transaction-circle income-circle">
                                    ↗
                                </div>

                                <div className="transaction-info">
                                    <strong>Salary</strong>
                                    <span>Income</span>
                                </div>

                                <div className="transaction-date">
                                    Sep 12
                                </div>

                                <strong className="transaction-income">
                                    +₹30,000
                                </strong>

                            </div>

                            <div className="transaction">

                                <div className="transaction-circle expense-circle">
                                    ↘
                                </div>

                                <div className="transaction-info">
                                    <strong>Groceries</strong>
                                    <span>Food</span>
                                </div>

                                <div className="transaction-date">
                                    Sep 11
                                </div>

                                <strong className="transaction-expense">
                                    -₹2,450
                                </strong>

                            </div>

                            <div className="transaction">

                                <div className="transaction-circle expense-circle">
                                    ↘
                                </div>

                                <div className="transaction-info">
                                    <strong>Electricity Bill</strong>
                                    <span>Utilities</span>
                                </div>

                                <div className="transaction-date">
                                    Sep 09
                                </div>

                                <strong className="transaction-expense">
                                    -₹1,850
                                </strong>

                            </div>

                            <div className="transaction">

                                <div className="transaction-circle expense-circle">
                                    ↘
                                </div>

                                <div className="transaction-info">
                                    <strong>Shopping</strong>
                                    <span>Personal</span>
                                </div>

                                <div className="transaction-date">
                                    Sep 07
                                </div>

                                <strong className="transaction-expense">
                                    -₹3,200
                                </strong>

                            </div>

                        </div>

                        {/* SPENDING */}
                        <div className="dashboard-card-large">

                            <div className="section-heading">
                                <div>
                                    <span>SPENDING</span>
                                    <h2>Where Your Money Goes</h2>
                                </div>
                            </div>

                            <div className="spending-item">
                                <div className="spending-heading">
                                    <span>Food</span>
                                    <strong>₹6,200</strong>
                                </div>

                                <div className="progress">
                                    <div
                                        className="progress-fill"
                                        style={{ width: "70%" }}
                                    ></div>
                                </div>

                                <small>31% of expenses</small>
                            </div>

                            <div className="spending-item">
                                <div className="spending-heading">
                                    <span>Shopping</span>
                                    <strong>₹5,100</strong>
                                </div>

                                <div className="progress">
                                    <div
                                        className="progress-fill"
                                        style={{ width: "55%" }}
                                    ></div>
                                </div>

                                <small>25% of expenses</small>
                            </div>

                            <div className="spending-item">
                                <div className="spending-heading">
                                    <span>Utilities</span>
                                    <strong>₹4,250</strong>
                                </div>

                                <div className="progress">
                                    <div
                                        className="progress-fill"
                                        style={{ width: "45%" }}
                                    ></div>
                                </div>

                                <small>21% of expenses</small>
                            </div>

                            <div className="spending-item">
                                <div className="spending-heading">
                                    <span>Transport</span>
                                    <strong>₹2,800</strong>
                                </div>

                                <div className="progress">
                                    <div
                                        className="progress-fill"
                                        style={{ width: "30%" }}
                                    ></div>
                                </div>

                                <small>14% of expenses</small>
                            </div>

                        </div>

                    </section>

                    {/* BOTTOM INSIGHT */}
                    <section className="dashboard-insight">

                        <div className="insight-symbol">
                            ✦
                        </div>

                        <div>
                            <span>FINANCIAL INSIGHT</span>

                            <h2>
                                You're doing well with your savings
                            </h2>

                            <p>
                                You have ₹24,850 remaining after your current
                                expenses. Keep maintaining this balance.
                            </p>
                        </div>

                        <div className="insight-value">
                            <span>NET SAVINGS</span>
                            <strong>₹24,850</strong>
                        </div>

                    </section>

                </main>
            </div>
        </div>
    );
}

export default Dashboard;