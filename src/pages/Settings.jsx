import React, { useState } from "react";
import axios from "axios";
import "../styles/SettingsPage.css";

function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSavePreferences = async () => {
    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true);

    try {
      // Replace with your back-end endpoint for saving preferences
      const response = await axios.post("http://<your-backend-url>/update-preferences", {
        emailNotifications,
        pushNotifications,
      });

      setSuccessMessage("Preferences updated successfully!");
      console.log("Preferences updated:", response.data);
    } catch (error) {
      console.error("Error updating preferences:", error.response);
      setErrorMessage(
        error.response?.data?.message || "An error occurred while updating preferences."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true);

    if (!password || !confirmPassword) {
      setErrorMessage("Please fill in both password fields.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      // Replace with your back-end endpoint for changing password
      const response = await axios.post("http://<your-backend-url>/change-password", {
        password,
      });

      setSuccessMessage("Password changed successfully!");
      setPassword("");
      setConfirmPassword("");
      console.log("Password changed:", response.data);
    } catch (error) {
      console.error("Error changing password:", error.response);
      setErrorMessage(
        error.response?.data?.message || "An error occurred while changing the password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>

      {/* Notification Preferences */}
      <div className="settings-section">
        <h2>Notification Preferences</h2>
        <label>
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={() => setEmailNotifications(!emailNotifications)}
          />
          Enable Email Notifications
        </label>
        <label>
          <input
            type="checkbox"
            checked={pushNotifications}
            onChange={() => setPushNotifications(!pushNotifications)}
          />
          Enable Push Notifications
        </label>
        <button onClick={handleSavePreferences} disabled={loading}>
          {loading ? "Saving..." : "Save Preferences"}
        </button>
      </div>

      {/* Change Password */}
      <div className="settings-section">
        <h2>Change Password</h2>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button onClick={handleChangePassword} disabled={loading}>
          {loading ? "Updating..." : "Change Password"}
        </button>
      </div>

      {/* Success/Error Messages */}
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default SettingsPage;
