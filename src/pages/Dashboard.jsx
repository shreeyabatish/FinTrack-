import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import BalanceCard from "../components/BalanceCard";
import IncomeCard from "../components/IncomeCard";
import ExpenseCard from "../components/ExpenseCard";

import "../styles/Dashboard.css";
import "../styles/Navbar.css";
import "../styles/Sidebar.css";
import "../styles/Cards.css";


function Dashboard() {
    return (
        <div className="dashboard-layout">

            <Sidebar />

            <div className="main-area">

                <Navbar />

                <main className="dashboard-content">

                    <div className="welcome-section">

                        <div>
                            <p className="welcome-label">
                                FINANCIAL OVERVIEW
                            </p>

                            <h1>Good evening 👋</h1>

                            <p className="welcome-text">
                                Here's what's happening with your money today.
                            </p>
                        </div>

                        <button className="date-button">
                            September 2026 ▾
                        </button>

                    </div>

                    <div className="cards-container">

                        <BalanceCard />
                        <IncomeCard />
                        <ExpenseCard />

                    </div>

                </main>

            </div>

        </div>
    );
}

export default Dashboard;