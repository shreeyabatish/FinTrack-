import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFinance } from "../context/FinanceContext.jsx";
import "../styles/Register.css";

export default function Register() {
  const { signupUser } = useFinance();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signupUser(form);
      setMessage("✅ User registered successfully. Please login.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      // ✅ Show backend error instead of generic message
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="register-screen">
      <div className="register-box">
        <h1>FinTrack</h1>
        <p>Create your account to start tracking finances.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Priya"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="e.g. test@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn" style={{ width: "100%" }}>
            Sign Up
          </button>
        </form>
        {message && <p className="register-hint">{message}</p>}
      </div>
    </div>
  );
}
