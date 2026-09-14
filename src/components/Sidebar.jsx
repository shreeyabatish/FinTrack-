import React from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar() {
    return (
        <aside className="sidebar">

            <div className="sidebar-logo">
                <div className="logo-icon">F</div>
                <h2>FinStack</h2>
            </div>

            <nav className="sidebar-nav">

    <Link to="/" className="sidebar-item active">
        <span>⌂</span>
        Dashboard
    </Link>

    <Link to="/transactions" className="sidebar-item">
        <span>↔</span>
        Transactions
    </Link>

    <Link to="/budgets" className="sidebar-item">
        <span>◎</span>
        Budgets
    </Link>

    <Link to="/analytics" className="sidebar-item">
        <span>▣</span>
        Analytics
    </Link>

    <Link to="/goals" className="sidebar-item">
        <span>◉</span>
        Goals
    </Link>

    <a href="/settings" className="sidebar-item">
    <span>⚙</span>
    Settings
</a>

</nav>

            <div className="sidebar-user">

                <div className="user-avatar">D</div>

                <div>
                    <strong>Damanpreet</strong>
                    <small>Personal Account</small>
                </div>

            </div>

        </aside>
    );
}

export default Sidebar;