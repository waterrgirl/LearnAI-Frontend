import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth } from "../firebase";
import API from "../api";
import '../styles/Dashboard.css';
import TaskSummary from "../components/TaskSummary";
import CalendarPreview from "../components/CalendarPreview";
import ProgressSummary from "../components/ProgressSummary";

function Dashboard() {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    highPriority: 0
  });
  const [editMode, setEditMode] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data when component mounts
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (!storedUser.uid) {
          navigate('/login');
          return;
        }

        setUpdatedName(storedUser.name || "");
        setUserData(storedUser);

        // Fetch profile data
        try {
          const response = await axios.get('/api/users/profile', {
            headers: { 'X-User-ID': storedUser.uid }
          });
          
          setUserData(prev => ({...prev, ...response.data}));
        } catch (profileError) {
          console.log('Profile data fetch failed, using local data:', profileError);

        }
        
        // Fetch tasks for stats
        try {
          const tasksResponse = await API.get('/api/tasks');
          const tasks = tasksResponse.data || [];
          
          // Calculate task statistics
          const stats = {
            total: tasks.length,
            completed: tasks.filter(task => task.completed).length,
            pending: tasks.filter(task => !task.completed).length,
            highPriority: tasks.filter(task => task.priority === 'High').length
          };
          
          setTaskStats(stats);
        } catch (tasksError) {
          console.error('Error fetching tasks:', tasksError);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    // Fetch personalized suggestions
    const fetchSuggestions = async () => {
      try {
        setSuggestionsLoading(true);
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (!storedUser.uid) return;
        
        try {
          // Try to fetch real suggestions from API
          const response = await axios.get('/api/suggestions', {
            headers: { 'X-User-ID': storedUser.uid }
          });
          
          if (response.data && response.data.suggestions) {
            setSuggestions(response.data.suggestions.slice(0, 3));
            return;
          }
        } catch (apiError) {
          console.log('API suggestions fetch failed, using mock data:', apiError);
        }
        
        // Mock data as fallback
        const mockSuggestions = [
          {
            type: 'productivity',
            title: 'Break Down Your Tasks',
            content: 'Based on your completion patterns, try breaking large assignments into smaller tasks for better progress tracking.',
            confidence: 0.89
          },
          {
            type: 'schedule',
            title: 'Optimal Study Times',
            content: 'You seem to complete more tasks in the evening. Consider scheduling important work between 7-9pm.',
            confidence: 0.78
          },
          {
            type: 'technique', 
            title: 'Try the Pomodoro Technique',
            content: 'For your upcoming tasks, try working in focused 25-minute intervals with short breaks in between.',
            confidence: 0.91
          }
        ];
        
        setSuggestions(mockSuggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setSuggestionsLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateMessage("");
    
    try {
      // Get current user's ID token
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setUpdateMessage("You must be logged in to update your profile");
        return;
      }
      
      const idToken = await currentUser.getIdToken();
      
      // Update user profile in Firestore
      await API.post('/api/update-profile', {
        idToken,
        name: updatedName
      });
      
      // Update local storage and state
      const updatedUser = { ...userData, name: updatedName };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUserData(updatedUser);
      
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

  // Render loading state while fetching data
  if (loading) {
    return (
      <div className="dashboard-loading">
        <i className="fas fa-circle-notch fa-spin"></i>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // Main dashboard rendering
  return (
    <div className="dashboard-page">
      {/* Welcome header */}
      <div className="dashboard-header">
        <div>
          <h1>
            Welcome back, {userData.name || userData.firstName || 'Student'}!
          </h1>
          <p className="dashboard-date">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        
        {/* Tab switcher */}
        <div className="dashboard-tabs">
          <button 
            className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <i className="fas fa-chart-line"></i> Dashboard
          </button>
          <button 
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="fas fa-user"></i> My Profile
          </button>
        </div>
      </div>

      {/* Conditional rendering based on active tab */}
      {activeTab === 'dashboard' ? (
        /* Dashboard Content */
        <div className="dashboard-grid">
          {/* Main content area */}
          <div className="dashboard-main">
            {/* Task summary card */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2>Task Overview</h2>
                <Link to="/tasks" className="view-all-link">
                  View All <i className="fas fa-chevron-right"></i>
                </Link>
              </div>
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

            {/* Calendar preview card */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2>Upcoming Deadlines</h2>
                <Link to="/calendar" className="view-all-link">
                  View Calendar <i className="fas fa-chevron-right"></i>
                </Link>
              </div>
              <CalendarPreview />
            </div>

            {/* Progress overview */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2>Your Progress</h2>
                <Link to="/progress" className="view-all-link">
                  Details <i className="fas fa-chevron-right"></i>
                </Link>
              </div>
              <div className="progress-preview">
                <div className="progress-chart-placeholder">
                  <div className="completion-circle">
                    <div className="completion-inner">
                      <span className="completion-percentage">
                        {taskStats.total > 0 
                          ? Math.round((taskStats.completed / taskStats.total) * 100) 
                          : 0}%
                      </span>
                      <span className="completion-label">Complete</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar content */}
          <div className="dashboard-sidebar">
            {/* Smart suggestions section */}
            <div className="dashboard-card suggestions-widget">
              <div className="card-header">
                <h2>Smart Suggestions</h2>
                <button className="refresh-suggestions" title="Refresh suggestions">
                  <i className="fas fa-sync-alt"></i>
                </button>
              </div>
              
              <div className="suggestions-content">
                {suggestionsLoading ? (
                  <div className="suggestions-loading">
                    <i className="fas fa-cog fa-spin"></i>
                    <p>Analyzing your study patterns...</p>
                  </div>
                ) : suggestions.length === 0 ? (
                  <div className="empty-suggestions">
                    <i className="fas fa-lightbulb"></i>
                    <p>Complete more tasks to get personalized suggestions!</p>
                  </div>
                ) : (
                  <div className="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                      <div 
                        key={index}
                        className={`suggestion-item suggestion-${suggestion.type}`}
                      >
                        <div className="suggestion-icon">
                          <i className={`fas ${getSuggestionIcon(suggestion.type)}`}></i>
                        </div>
                        <div className="suggestion-text">
                          <h3>{suggestion.title}</h3>
                          <p>{suggestion.content}</p>
                        </div>
                      </div>
                    ))}
                    
                    <div className="suggestion-actions">
                      <Link to="/suggestions" className="view-all-suggestions">
                        View All Suggestions <i className="fas fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Quick actions */}
            <div className="dashboard-card quick-actions">
              <h2>Quick Actions</h2>
              <div className="action-buttons">
                <Link to="/tasks" className="action-button">
                  <i className="fas fa-plus"></i>
                  <span>New Task</span>
                </Link>
                <Link to="/calendar" className="action-button">
                  <i className="fas fa-calendar-alt"></i>
                  <span>Calendar</span>
                </Link>
                <Link to="/settings" className="action-button">
                  <i className="fas fa-cog"></i>
                  <span>Settings</span>
                </Link>
                <Link to="/notifications" className="action-button">
                  <i className="fas fa-bell"></i>
                  <span>Notifications</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Profile Content */
        <div className="profile-container">
          <div className="profile-content">
            <div className="dashboard-card">
              <div className="card-header">
                <h2>Account Details</h2>
              </div>
              <div className="profile-details-container">
                {!editMode ? (
                  <div className="profile-details">
                    <div className="profile-avatar-section">
                      <div className="profile-avatar">
                        {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
                      </div>
                    </div>
                    <div className="profile-info-section">
                      <div className="detail-row">
                        <span className="detail-label">Name:</span>
                        <span className="detail-value">{userData.name || "No name set"}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">{userData.email}</span>
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
                        value={userData.email}
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
                          setUpdatedName(userData.name || "");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
                {updateMessage && <p className="update-message">{updateMessage}</p>}
              </div>
            </div>
            
            <div className="dashboard-card">
              <div className="card-header">
                <h2>Task Statistics</h2>
              </div>
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
            
            <div className="dashboard-card">
              <div className="card-header">
                <h2>Account Actions</h2>
              </div>
              <div className="account-actions">
                <button className="action-btn danger-btn" onClick={() => {
                  auth.signOut();
                  localStorage.removeItem('user');
                  navigate('/login');
                }}>
                  <i className="fas fa-sign-out-alt"></i> Sign Out
                </button>
                <Link to="/settings" className="action-btn neutral-btn">
                  <i className="fas fa-cog"></i> Account Settings
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getSuggestionIcon(type) {
  switch (type) {
    case 'productivity': return 'fa-chart-line';
    case 'schedule': return 'fa-clock';
    case 'technique': return 'fa-brain';
    case 'subject': return 'fa-book';
    default: return 'fa-lightbulb';
  }
}

export default Dashboard;