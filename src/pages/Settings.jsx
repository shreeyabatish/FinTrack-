import React, { useEffect, useState } from "react";
import "../styles/Settings.css";

function Settings() {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [currency, setCurrency] = useState("INR");
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const settings = JSON.parse(
            localStorage.getItem("finstack_settings")
        );

        if (settings) {
            setNotifications(settings.notifications);
            setDarkMode(settings.darkMode);
            setCurrency(settings.currency);
        }
    }, []);

    const saveSettings = () => {
        localStorage.setItem(
            "finstack_settings",
            JSON.stringify({
                notifications,
                darkMode,
                currency,
            })
        );

        setSaved(true);

        setTimeout(() => {
            setSaved(false);
        }, 2000);
    };

    const resetSettings = () => {
        setNotifications(true);
        setDarkMode(false);
        setCurrency("INR");

        localStorage.removeItem("finstack_settings");
    };

    return (
        <div className={`settings-page ${darkMode ? "settings-dark" : ""}`}>

            {/* Header */}
            <div className="settings-header">
                <div>
                    <p className="settings-label">PREFERENCES</p>
                    <h1>Settings</h1>
                    <p>
                        Manage your FinStack account and application preferences.
                    </p>
                </div>
            </div>


            {/* Account */}
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
                        <div className="settings-avatar">
                            D
                        </div>

                        <div>
                            <strong>Damanpreet</strong>
                            <span>Personal Account</span>
                        </div>

                        <button className="outline-btn">
                            Edit Profile
                        </button>
                    </div>

                </div>

            </section>


            {/* Preferences */}
            <section className="settings-section">

                <div className="section-heading">
                    <div className="section-icon">⚙</div>

                    <div>
                        <h2>Preferences</h2>
                        <p>Customize your FinStack experience</p>
                    </div>
                </div>

                <div className="settings-card">

                    {/* Currency */}
                    <div className="setting-row">

                        <div className="setting-info">
                            <strong>Currency</strong>
                            <span>
                                Choose the currency displayed throughout the app
                            </span>
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


                    {/* Notifications */}
                    <div className="setting-row">

                        <div className="setting-info">
                            <strong>Notifications</strong>
                            <span>
                                Receive reminders and financial updates
                            </span>
                        </div>

                        <button
                            className={`toggle ${notifications ? "active" : ""}`}
                            onClick={() =>
                                setNotifications(!notifications)
                            }
                        >
                            <span></span>
                        </button>

                    </div>


                    {/* Dark Mode */}
                    <div className="setting-row">

                        <div className="setting-info">
                            <strong>Dark Mode</strong>
                            <span>
                                Use a darker appearance for the application
                            </span>
                        </div>

                        <button
                            className={`toggle ${darkMode ? "active" : ""}`}
                            onClick={() =>
                                setDarkMode(!darkMode)
                            }
                        >
                            <span></span>
                        </button>

                    </div>

                </div>

            </section>


            {/* Security */}
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

                        <button className="outline-btn">
                            Change Password
                        </button>

                    </div>

                </div>

            </section>


            {/* Bottom actions */}
            <div className="settings-actions">

                <button
                    className="reset-btn"
                    onClick={resetSettings}
                >
                    Reset Settings
                </button>

                <button
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