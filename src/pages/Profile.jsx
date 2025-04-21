import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import API from "../api";
import "../styles/ProfilePage.css";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    highPriority: 0
  });
  const [editMode, setEditMode] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const navigate = useNavigate();

  // Fetch user data and stats on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Get current user from localStorage
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          navigate('/login');
          return;
        }
        
        const userData = JSON.parse(userStr);
        setUser(userData);
        setUpdatedName(userData.name || "");
        
        // Fetch user's tasks to calculate stats
        const response = await API.get('/api/tasks');
        const tasks = response.data;
        
        // Calculate task statistics
        const stats = {
          total: tasks.length,
          completed: tasks.filter(task => task.completed).length,
          pending: tasks.filter(task => !task.completed).length,
          highPriority: tasks.filter(task => task.priority === 'High').length
        };
        
        setTaskStats(stats);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateMessage("");
    
    try {
      // Get current user's ID token
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setError("You must be logged in to update your profile");
        return;
      }
      
      const idToken = await currentUser.getIdToken();
      
      // Update user profile in Firestore
      await API.post('/api/update-profile', {
        idToken,
        name: updatedName
      });
      
      // Update local storage
      const updatedUser = { ...user, name: updatedName };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      // Exit edit mode and show success message
      setEditMode(false);
      setUpdateMessage("Profile updated successfully!");
      
      // Clear message after 3 seconds
      setTimeout(() => setUpdateMessage(""), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setUpdateMessage("Failed to update profile. Please try again.");
    }
  };

  if (loading) {
    return <div className="profile-page loading">Loading profile information...</div>;
  }

  if (error) {
    return <div className="profile-page error">{error}</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="profile-title">
            <h1>My Profile</h1>
          </div>
        </div>
        
        <div className="profile-content">
          <div className="profile-section">
            <h2>Account Details</h2>
            {!editMode ? (
              <div className="profile-details">
                <div className="detail-row">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{user.name || "No name set"}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{user.email}</span>
                </div>
                <div className="detail-row">
                  <button 
                    className="edit-profile-btn"
                    onClick={() => setEditMode(true)}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            ) : (
              <form className="edit-profile-form" onSubmit={handleUpdateProfile}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={user.email}
                    disabled
                  />
                  <small>Email cannot be changed</small>
                </div>
                <div className="form-actions">
                  <button type="submit" className="update-btn">Update Profile</button>
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => {
                      setEditMode(false);
                      setUpdatedName(user.name || "");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
            {updateMessage && <p className="update-message">{updateMessage}</p>}
          </div>
          
          <div className="profile-section">
            <h2>Task Statistics</h2>
            <div className="stats-container">
              <div className="stat-card">
                <div className="stat-value">{taskStats.total}</div>
                <div className="stat-label">Total Tasks</div>
              </div>
              <div className="stat-card completed">
                <div className="stat-value">{taskStats.completed}</div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat-card pending">
                <div className="stat-value">{taskStats.pending}</div>
                <div className="stat-label">Pending</div>
              </div>
              <div className="stat-card high-priority">
                <div className="stat-value">{taskStats.highPriority}</div>
                <div className="stat-label">High Priority</div>
              </div>
            </div>
          </div>
          
          <div className="profile-actions">
            <button 
              className="logout-btn" 
              onClick={() => {
                auth.signOut();
                localStorage.removeItem('user');
                navigate('/login');
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;