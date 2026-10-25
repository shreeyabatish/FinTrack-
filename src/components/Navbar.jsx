import React from "react";
import "../styles/Navbar.css";
import { useFinance } from "../context/FinanceContext.jsx";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { isLoggedIn, user, logoutUser } = useFinance();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const displayName = user?.name || user?.email || "Guest";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2>FinTrack</h2>
      </div>

      <div className="navbar-right">
        {isLoggedIn ? (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}

        <button className="notification-btn">🔔</button>

        <div className="profile">
          <div className="profile-avatar">{avatarLetter}</div>

          <div className="profile-info">
            <span className="profile-name">{displayName}</span>
            <span className="profile-role">Personal Account</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;