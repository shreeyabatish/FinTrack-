
import React, { useEffect, useState } from "react";
import "../styles/Settings.css";
import { useFinance } from "../context/FinanceContext.jsx";

function Settings() {
  const { user, updateProfile } = useFinance();

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrency] = useState("INR");
  const [saved, setSaved] = useState(false);

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [editEmail, setEditEmail] = useState(user?.email || "");
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  const displayName = user?.name || user?.email || "Guest";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    try {
      const settings = JSON.parse(
        localStorage.getItem("finstack_settings") || "null"
      );

      if (settings) {
        setNotifications(settings.notifications ?? true);
        setDarkMode(settings.darkMode ?? false);
        setCurrency(settings.currency || "INR");
      }
    } catch (error) {
      console.error("Could not load settings:", error);
    }
  }, []);

  // Keep the edit form synchronized with the logged-in user
  useEffect(() => {
    setEditName(user?.name || "");
    setEditEmail(user?.email || "");
  }, [user]);

  const openEditProfile = () => {
    setEditName(user?.name || "");
    setEditEmail(user?.email || "");
    setProfileMessage("");
    setProfileError("");
    setIsEditing(true);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileMessage("");
    setProfileError("");

    if (!user) {
      setProfileError("Please log in before editing your profile.");
      return;
    }

    try {
      await updateProfile({
        name: editName,
        email: editEmail,
      });

      setProfileMessage("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      setProfileError(error.message || "Could not update profile.");
    }
  };

  const saveSettings = () => {
    localStorage.setItem(
      "finstack_settings",
      JSON.stringify({ notifications, darkMode, currency })
    );

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const resetSettings = () => {
    setNotifications(true);
    setDarkMode(false);
    setCurrency("INR");
    localStorage.removeItem("finstack_settings");
    setSaved(false);
  };

  return (
    <div className={`settings-page ${darkMode ? "settings-dark" : ""}`}>
      <div className="settings-header">
        <div>
          <p className="settings-label">PREFERENCES</p>
          <h1>Settings</h1>
          <p>Manage your FinStack account and application preferences.</p>
        </div>
      </div>

      {/* ACCOUNT */}
      <section className="settings-section">
        <div className="section-heading">
          <div className="section-icon">👤</div>
          <div>
            <h2>Account</h2>
            <p>Your personal account information</p>
          </div>
        </div>

        <div className="settings-card">
          <div className="profile-row">
            <div className="settings-avatar">{avatarLetter}</div>

            <div>
              <strong>{displayName}</strong>
              <span>{user?.email || "Not logged in"}</span>
            </div>

            <button
              type="button"
              className="outline-btn"
              onClick={openEditProfile}
              disabled={!user}
            >
              Edit Profile
            </button>
          </div>

          {profileMessage && (
            <p role="status" style={{ color: "green", marginTop: 12 }}>
              {profileMessage}
            </p>
          )}

          {profileError && (
            <p role="alert" style={{ color: "crimson", marginTop: 12 }}>
              {profileError}
            </p>
          )}

          {isEditing && (
            <form
              onSubmit={handleProfileSave}
              style={{
                display: "grid",
                gap: 14,
                marginTop: 20,
                paddingTop: 20,
                borderTop: "1px solid #e5e7eb",
              }}
            >
              <div>
                <label htmlFor="profile-name">Full name</label>
                <input
                  id="profile-name"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  style={{
                    display: "block",
                    width: "100%",
                    padding: 10,
                    marginTop: 6,
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label htmlFor="profile-email">Display email</label>
                <input
                  id="profile-email"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  style={{
                    display: "block",
                    width: "100%",
                    padding: 10,
                    marginTop: 6,
                    boxSizing: "border-box",
                  }}
                />
                <small>
                  This changes the email shown in your profile, not your
                  registered login email.
                </small>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button type="submit" className="save-btn">
                  Save Profile
                </button>

                <button
                  type="button"
                  className="reset-btn"
                  onClick={() => {
                    setIsEditing(false);
                    setProfileError("");
                    setEditName(user?.name || "");
                    setEditEmail(user?.email || "");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* PREFERENCES */}
      <section className="settings-section">
        <div className="section-heading">
          <div className="section-icon">⚙</div>
          <div>
            <h2>Preferences</h2>
            <p>Customize your FinStack experience</p>
          </div>
        </div>

        <div className="settings-card">
          <div className="setting-row">
            <div className="setting-info">
              <strong>Currency</strong>
              <span>Choose the currency displayed throughout the app</span>
            </div>

            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="INR">₹ INR — Indian Rupee</option>
              <option value="USD">$ USD — US Dollar</option>
              <option value="EUR">€ EUR — Euro</option>
              <option value="GBP">£ GBP — British Pound</option>
            </select>
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <strong>Notifications</strong>
              <span>Receive reminders and financial updates</span>
            </div>

            <button
              type="button"
              aria-label="Toggle notifications"
              aria-pressed={notifications}
              className={`toggle ${notifications ? "active" : ""}`}
              onClick={() => setNotifications(!notifications)}
            >
              <span />
            </button>
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <strong>Dark Mode</strong>
              <span>Use a darker appearance for the application</span>
            </div>

            <button
              type="button"
              aria-label="Toggle dark mode"
              aria-pressed={darkMode}
              className={`toggle ${darkMode ? "active" : ""}`}
              onClick={() => setDarkMode(!darkMode)}
            >
              <span />
            </button>
          </div>
        </div>
      </section>

      {/* SECURITY */}
      <section className="settings-section">
        <div className="section-heading">
          <div className="section-icon">🔒</div>
          <div>
            <h2>Security</h2>
            <p>Manage your account security</p>
          </div>
        </div>

        <div className="settings-card">
          <div className="setting-row">
            <div className="setting-info">
              <strong>Password</strong>
              <span>
                Keep your account protected with a secure password
              </span>
            </div>

            <button
              type="button"
              className="outline-btn"
              onClick={() =>
                alert("Password changing is not available yet.")
              }
            >
              Change Password
            </button>
          </div>
        </div>
      </section>

      {/* SETTINGS ACTIONS */}
      <div className="settings-actions">
        <button
          type="button"
          className="reset-btn"
          onClick={resetSettings}
        >
          Reset Settings
        </button>

        <button
          type="button"
          className="save-btn"
          onClick={saveSettings}
        >
          {saved ? "✓ Settings Saved" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

export default Settings;
