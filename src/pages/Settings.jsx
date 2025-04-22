import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, updatePassword } from "firebase/auth";
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
  const [loadingPreferences, setLoadingPreferences] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();

  // Load user preferences on component mount
  useEffect(() => {
    const fetchUserPreferences = async () => {
      const userData = JSON.parse(localStorage.getItem('user'));
      
      if (!userData || !userData.token) {
        navigate('/login');
        return;
      }

      try {
        // We could make an API call to get current preferences
        // For now, just showing how to use the token
        const response = await axios.post("/api/verify-token", {
          idToken: userData.token,
        });
        
        // If we had stored preferences, we could set them here
        // For this example, using defaults
        setEmailNotifications(response.data?.preferences?.emailNotifications ?? true);
        setPushNotifications(response.data?.preferences?.pushNotifications ?? false);
      } catch (error) {
        console.error("Error fetching preferences:", error);
        // If token is invalid, redirect to login
        if (error.response?.status === 401) {
          localStorage.removeItem('user');
          navigate('/login');
        }
      } finally {
        setLoadingPreferences(false);
      }
    };

    fetchUserPreferences();
  }, [navigate]);

  // Save notification preferences
  const handleSavePreferences = async () => {
    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true);

    const userData = JSON.parse(localStorage.getItem('user'));
    
    if (!userData || !userData.token) {
      setErrorMessage("You need to be logged in");
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post("/api/update-preferences", {
        idToken: userData.token,
        emailNotifications,
        pushNotifications,
      });

      setSuccessMessage("Preferences updated successfully!");
      console.log("Preferences updated:", response.data);
    } catch (error) {
      console.error("Error updating preferences:", error);
      
      if (error.response?.status === 401) {
        setErrorMessage("Your session has expired. Please log in again.");
        localStorage.removeItem('user');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setErrorMessage(
          error.response?.data?.error || "An error occurred while updating preferences."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Change password
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

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    const userData = JSON.parse(localStorage.getItem('user'));
    
    if (!userData || !userData.token) {
      setErrorMessage("You need to be logged in");
      navigate('/login');
      return;
    }

    try {
      // First, update password in Firebase Authentication
      const currentUser = auth.currentUser;
      
      if (currentUser) {
        await updatePassword(currentUser, password);
        
        // Then update through our backend for audit/logging purposes
        await axios.post("/api/change-password", {
          idToken: userData.token,
          password,
        });

        setSuccessMessage("Password changed successfully!");
        setPassword("");
        setConfirmPassword("");
      } else {
        // User needs to reauthenticate
        setErrorMessage("For security reasons, please log in again before changing your password.");
        localStorage.removeItem('user');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      
      if (error.code === 'auth/requires-recent-login') {
        setErrorMessage("For security reasons, please log in again before changing your password.");
        localStorage.removeItem('user');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setErrorMessage(
          error.response?.data?.error || error.message || "An error occurred while changing the password."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // If still loading preferences, show loading indicator
  if (loadingPreferences) {
    return (
      <div className="settings-page">
        <h1>Settings</h1>
        <p>Loading preferences...</p>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <h1>Settings</h1>

      {/* Notification Preferences */}
      <div className="settings-section">
        <h2>Notification Preferences</h2>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={() => setEmailNotifications(!emailNotifications)}
          />
          <span>Enable Email Notifications</span>
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={pushNotifications}
            onChange={() => setPushNotifications(!pushNotifications)}
          />
          <span>Enable Push Notifications</span>
        </label>
        <button 
          className="settings-button"
          onClick={handleSavePreferences} 
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Preferences"}
        </button>
      </div>

      {/* Change Password */}
      <div className="settings-section">
        <h2>Change Password</h2>
        <div className="form-group">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="settings-input"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="settings-input"
          />
        </div>
        <button 
          className="settings-button"
          onClick={handleChangePassword} 
          disabled={loading}
        >
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