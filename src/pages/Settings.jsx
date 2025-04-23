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
  const [currentPassword, setCurrentPassword] = useState("");
  const [activeTab, setActiveTab] = useState('notifications');
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSavePreferences = () => {
    setSuccessMessage("Your notification preferences have been saved!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleChangePassword = () => {
    if (!password || !confirmPassword || !currentPassword) {
      setErrorMessage("Please fill in all password fields");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMessage("New passwords don't match");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage("Password changed successfully!");
      setPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 1500);
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1><i className="fas fa-cog fa-spin-hover"></i> Settings</h1>
        <p className="settings-subtitle">Manage your account preferences and settings</p>
      </div>
      
      <div className="settings-tabs">
        <button 
          className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <i className="fas fa-bell"></i> Notifications
        </button>
        <button 
          className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <i className="fas fa-shield-alt"></i> Security
        </button>
        <button 
          className={`settings-tab ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          <i className="fas fa-user-cog"></i> Account
        </button>
        <button 
          className={`settings-tab ${activeTab === 'theme' ? 'active' : ''}`}
          onClick={() => setActiveTab('theme')}
        >
          <i className="fas fa-palette"></i> Theme
        </button>
      </div>

      {successMessage && (
        <div className="settings-alert success">
          <i className="fas fa-check-circle"></i> {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="settings-alert error">
          <i className="fas fa-exclamation-circle"></i> {errorMessage}
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="settings-content">
          <div className="settings-section">
            <div className="settings-section-header">
              <i className="fas fa-bell"></i>
              <h2>Notification Preferences</h2>
            </div>
            <p className="settings-description">
              Configure how you want to be notified about tasks, deadlines and other important updates.
            </p>

            <div className="setting-options">
              <div className="setting-option">
                <div className="setting-option-info">
                  <h3>Email Notifications</h3>
                  <p>Receive updates about tasks and deadlines via email</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={emailNotifications} 
                    onChange={() => setEmailNotifications(!emailNotifications)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="setting-option">
                <div className="setting-option-info">
                  <h3>Push Notifications</h3>
                  <p>Get real-time alerts in your browser</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={pushNotifications} 
                    onChange={() => setPushNotifications(!pushNotifications)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-option">
                <div className="setting-option-info">
                  <h3>Task Reminders</h3>
                  <p>Get reminded of upcoming tasks and deadlines</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={true} 
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-option">
                <div className="setting-option-info">
                  <h3>Weekly Summary</h3>
                  <p>Receive a weekly email with your task completion summary</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={true} 
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="settings-action">
              <button className="settings-button primary" onClick={handleSavePreferences}>
                <i className="fas fa-save"></i> Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="settings-content">
          <div className="settings-section">
            <div className="settings-section-header">
              <i className="fas fa-lock"></i>
              <h2>Password & Security</h2>
            </div>
            <p className="settings-description">
              Update your password and manage account security settings.
            </p>

            <div className="password-form">
              <div className="form-group">
                <label>Current Password</label>
                <div className="password-input-container">
                  <i className="fas fa-key input-icon"></i>
                  <input 
                    type="password" 
                    className="settings-input" 
                    placeholder="Enter your current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>New Password</label>
                <div className="password-input-container">
                  <i className="fas fa-lock input-icon"></i>
                  <input 
                    type="password" 
                    className="settings-input" 
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Confirm New Password</label>
                <div className="password-input-container">
                  <i className="fas fa-lock input-icon"></i>
                  <input 
                    type="password" 
                    className="settings-input" 
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="password-requirements">
                <p>Password must:</p>
                <ul>
                  <li className={password.length >= 8 ? "met" : ""}>
                    <i className={`fas ${password.length >= 8 ? "fa-check" : "fa-times"}`}></i>
                    Be at least 8 characters long
                  </li>
                  <li className={/[A-Z]/.test(password) ? "met" : ""}>
                    <i className={`fas ${/[A-Z]/.test(password) ? "fa-check" : "fa-times"}`}></i>
                    Include at least one uppercase letter
                  </li>
                  <li className={/\d/.test(password) ? "met" : ""}>
                    <i className={`fas ${/\d/.test(password) ? "fa-check" : "fa-times"}`}></i>
                    Include at least one number
                  </li>
                </ul>
              </div>

              <div className="settings-action">
                <button 
                  className={`settings-button primary ${loading ? "loading" : ""}`} 
                  onClick={handleChangePassword}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Updating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-key"></i> Update Password
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <div className="settings-section-header">
              <i className="fas fa-shield-alt"></i>
              <h2>Two-Factor Authentication</h2>
            </div>
            <p className="settings-description">
              Add an extra layer of security to your account.
            </p>
            
            <div className="two-factor-status">
              <div className="status-indicator">
                <span className="status-dot disabled"></span>
                <span className="status-text">Disabled</span>
              </div>
              <button className="settings-button secondary">
                <i className="fas fa-plus-circle"></i> Enable 2FA
              </button>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'account' && (
        <div className="settings-content">
          <div className="settings-section">
            <div className="settings-section-header">
              <i className="fas fa-user"></i>
              <h2>Account Information</h2>
            </div>
            <p className="settings-description">
              Manage your account details and preferences.
            </p>

            <div className="account-info-card">
              <div className="account-avatar">
                <div className="avatar-placeholder">
                  <i className="fas fa-user"></i>
                </div>
                <button className="change-avatar-btn">
                  <i className="fas fa-camera"></i>
                </button>
              </div>
              
              <div className="account-details">
                <div className="form-group">
                  <label>Full Name</label>
                  <div className="input-container">
                    <i className="fas fa-user input-icon"></i>
                    <input type="text" className="settings-input" defaultValue="Student User" />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-container">
                    <i className="fas fa-envelope input-icon"></i>
                    <input type="email" className="settings-input" defaultValue="student@example.com" disabled />
                    <span className="input-note">Email cannot be changed</span>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Time Zone</label>
                  <div className="input-container">
                    <i className="fas fa-globe input-icon"></i>
                    <select className="settings-input">
                      <option>Malaysia Time (GMT+8)</option>
                      <option>London (GMT+0)</option>
                      <option>New York (GMT-5)</option>
                      <option>Pacific Time (GMT-8)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="settings-action">
              <button className="settings-button primary">
                <i className="fas fa-save"></i> Save Changes
              </button>
            </div>
          </div>

          <div className="settings-section danger-zone">
            <div className="settings-section-header">
              <i className="fas fa-exclamation-triangle"></i>
              <h2>Danger Zone</h2>
            </div>
            <p className="settings-description danger">
              Actions here cannot be undone. Please be careful.
            </p>

            <div className="danger-actions">
              <div className="danger-action">
                <div className="danger-info">
                  <h3>Export Data</h3>
                  <p>Download all your tasks and activity history</p>
                </div>
                <button className="settings-button secondary">
                  <i className="fas fa-download"></i> Export
                </button>
              </div>
              
              <div className="danger-action">
                <div className="danger-info">
                  <h3>Delete Account</h3>
                  <p>Permanently delete your account and all data</p>
                </div>
                <button className="settings-button danger">
                  <i className="fas fa-trash-alt"></i> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'theme' && (
        <div className="settings-content">
          <div className="settings-section">
            <div className="settings-section-header">
              <i className="fas fa-palette"></i>
              <h2>Appearance</h2>
            </div>
            <p className="settings-description">
              Customize how LearnAI looks for you.
            </p>

            <div className="theme-options">
              <h3>Color Theme</h3>
              <div className="color-theme-selector">
                <div className="theme-option active">
                  <div className="theme-preview blue"></div>
                  <span>Blue</span>
                </div>
                <div className="theme-option">
                  <div className="theme-preview purple"></div>
                  <span>Purple</span>
                </div>
                <div className="theme-option">
                  <div className="theme-preview green"></div>
                  <span>Green</span>
                </div>
                <div className="theme-option">
                  <div className="theme-preview orange"></div>
                  <span>Orange</span>
                </div>
              </div>

              <h3>Display Mode</h3>
              <div className="display-mode-selector">
                <div className="mode-option">
                  <input type="radio" id="light-mode" name="display-mode" defaultChecked />
                  <label htmlFor="light-mode">
                    <i className="fas fa-sun"></i>
                    <span>Light</span>
                  </label>
                </div>
                
                <div className="mode-option">
                  <input type="radio" id="dark-mode" name="display-mode" />
                  <label htmlFor="dark-mode">
                    <i className="fas fa-moon"></i>
                    <span>Dark</span>
                  </label>
                </div>
                
                <div className="mode-option">
                  <input type="radio" id="auto-mode" name="display-mode" />
                  <label htmlFor="auto-mode">
                    <i className="fas fa-adjust"></i>
                    <span>Auto</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="settings-action">
              <button className="settings-button primary">
                <i className="fas fa-check"></i> Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsPage;