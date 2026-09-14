import React from "react";
import "../styles/Sidebar.css";

function Sidebar() {
    return (
        <aside className="sidebar">

            <div className="sidebar-logo">
                <div className="logo-icon">F</div>
                <h2>FinStack</h2>
            </div>

            <nav className="sidebar-nav">

                <a href="#" className="sidebar-item active">
                    <span>⌂</span>
                    Dashboard
                </a>

                <a href="#" className="sidebar-item">
                    <span>↔</span>
                    Transactions
                </a>

                <a href="#" className="sidebar-item">
                    <span>◉</span>
                    Budgets
                </a>

                <a href="#" className="sidebar-item">
                    <span>▣</span>
                    Analytics
                </a>

                <a href="#" className="sidebar-item">
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