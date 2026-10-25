
import React, { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useFinance } from "../context/FinanceContext.jsx";
import "../styles/Login.css";

export default function Login() {
  const { isLoggedIn, loginUser } = useFinance();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Dashboard is registered at "/"
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      await loginUser({
        email: email.trim().toLowerCase(),
        password,
      });

      setMessage("Logged in successfully!");

      const from = location.state?.from?.pathname || "/";

      // Give the context time to update before navigating.
      setTimeout(() => {
        navigate(from === "/login" || from === "/register" ? "/" : from, {
          replace: true,
        });
      }, 500);
    } catch (err) {
      setMessage(`Login failed: ${err.message}`);
    }
  }

  return (
    <div className="login-screen">
      <div className="login-box">
        <h1>FinTrack</h1>
        <p>Sign in to see your finances.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="e.g. test@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn" style={{ width: "100%" }}>
            Log in
          </button>
        </form>

        {message && <p className="login-hint">{message}</p>}

        <button
          type="button"
          className="btn"
          style={{ marginTop: "10px", width: "100%" }}
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </div>
    </div>
  );
}
