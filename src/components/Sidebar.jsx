import React from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";
import { useFinance } from "../context/FinanceContext.jsx";

function Sidebar() {
  const { user } = useFinance();

  const displayName = user?.name || user?.email || "Guest";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">F</div>
        <h2>FinTrack</h2>
      </div>

      <nav className="sidebar-nav">
        <Link to="/" className="sidebar-item">
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

        <Link to="/settings" className="sidebar-item">
          <span>⚙</span>
          Settings
        </Link>
      </nav>

      <div className="sidebar-user">
        <div className="user-avatar">{avatarLetter}</div>

        <div>
          <strong>{displayName}</strong>
          <small>Personal Account</small>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;