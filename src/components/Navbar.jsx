import React from "react";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2>FinStack</h2>
      </div>

      <div className="navbar-right">
        <button className="notification-btn">🔔</button>

        <div className="profile">
          <div className="profile-avatar">D</div>
          <div className="profile-info">
            <span className="profile-name">Damanpreet</span>
            <span className="profile-role">Personal Account</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;