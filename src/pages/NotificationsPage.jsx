import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/NotificationsPage.css';

function NotificationsPage() {
  const [notifications, setNotifications] = useState({
    overdue: [],
    urgent: [],
    soon: [],
    upcoming: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  // Fetch notifications on component mount
  useEffect(() => {
    console.log("NotificationsPage mounted");
    fetchNotifications();
    
    // Create a custom event to trigger notification refresh
    window.addEventListener('tasksUpdated', fetchNotifications);
    
    return () => {
      window.removeEventListener('tasksUpdated', fetchNotifications);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = userData.uid;
      
      if (!userId) {
        console.log("User not authenticated, skipping notification fetch");
        setError("You must be logged in to view notifications");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      // Use direct API endpoint
      const response = await axios.get("/api/reminders", {
        headers: {
          'X-User-ID': userId
        }
      });
      
      console.log("Reminders API response:", response.data);
      
      if (response.data) {
        const notifs = {
          overdue: response.data.overdue || [],
          urgent: response.data.urgent || [],
          soon: response.data.soon || [],
          upcoming: response.data.upcoming || []
        };
        
        setNotifications(notifs);
        console.log("Set notifications to:", notifs);
      }
      
      setError(null);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError(`Failed to load notifications: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Get notifications based on active tab
  const getFilteredNotifications = () => {
    if (activeTab === 'all') {
      return [
        ...notifications.overdue,
        ...notifications.urgent, 
        ...notifications.soon,
        ...notifications.upcoming
      ];
    }
    return notifications[activeTab] || [];
  };

  // Get style for notification based on type
  const getNotificationStyle = (type) => {
    switch (type) {
      case 'overdue': return 'status-badge overdue';
      case 'urgent': return 'status-badge urgent';
      case 'soon': return 'status-badge soon';
      case 'upcoming': return 'status-badge upcoming';
      default: return '';
    }
  };

  // Handle marking a task as complete
  const handleCompleteTask = async (taskId) => {
    try {
      // Get user data for API call
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      await axios.patch(`/api/tasks/${taskId}`, 
        { completed: true }, 
        { headers: { 'X-User-ID': userData.uid } }
      );
      
      // Refresh notifications after marking as complete
      fetchNotifications();
      
      // Trigger global task update event
      window.dispatchEvent(new Event('tasksUpdated'));
      
    } catch (err) {
      console.error("Error completing task:", err);
      alert("Could not mark task as complete");
    }
  };

  // Handle viewing task details
  const handleViewTask = (taskId) => {
    navigate(`/tasks?highlight=${taskId}`);
  };

  const filteredNotifications = getFilteredNotifications();
  
  // Format the notification message
  const formatNotificationMessage = (notification) => {
    switch (notification.reminder_type) {
      case 'overdue': return `OVERDUE: Task was due on ${notification.deadline}`;
      case 'urgent': return 'Due TODAY';
      case 'soon': return 'Due TOMORROW';
      case 'upcoming': return `Due on ${notification.deadline}`;
      default: return '';
    }
  };

  return (
    <div className="notifications-page">
      <div className="page-header">
        <h1>Notifications</h1>
        <div className="notification-filters">
          <button 
            className={`filter-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${activeTab === 'overdue' ? 'active' : ''}`}
            onClick={() => setActiveTab('overdue')}
          >
            Overdue
          </button>
          <button 
            className={`filter-btn ${activeTab === 'urgent' ? 'active' : ''}`}
            onClick={() => setActiveTab('urgent')}
          >
            Due Today
          </button>
          <button 
            className={`filter-btn ${activeTab === 'soon' ? 'active' : ''}`}
            onClick={() => setActiveTab('soon')}
          >
            Due Tomorrow
          </button>
          <button 
            className={`filter-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
          </button>
        </div>
        <button 
          onClick={fetchNotifications} 
          className="refresh-button"
          disabled={loading}
        >
          <i className="fas fa-sync-alt"></i> Refresh
        </button>
      </div>

      {loading ? (
        <div className="loading">
          <i className="fas fa-spinner fa-spin"></i> Loading notifications...
        </div>
      ) : error ? (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-bell-slash"></i>
          <p>No notifications in this category</p>
        </div>
      ) : (
        <div className="notifications-list">
          {filteredNotifications.map(notification => (
            <div key={notification.id} className="notification-card">
              <div className="notification-icon">
                <i className="fas fa-bell"></i>
              </div>
              <div className="notification-content">
                <h3 className="notification-title">{notification.title}</h3>
                <div className="notification-meta">
                  <span className={getNotificationStyle(notification.reminder_type)}>
                    {formatNotificationMessage(notification)}
                  </span>
                  {notification.priority && (
                    <span className="priority-badge">
                      {notification.priority}
                    </span>
                  )}
                </div>
                {notification.description && (
                  <p className="notification-description">
                    {notification.description}
                  </p>
                )}
                <div className="task-meta">
                  {notification.category && (
                    <span className="task-category">
                      <i className="fas fa-tag"></i> {notification.category}
                    </span>
                  )}
                  <span className="task-date">
                    <i className="fas fa-calendar"></i> {notification.deadline}
                  </span>
                </div>
              </div>
              <div className="notification-actions">
                <button 
                  className="action-btn view-btn"
                  onClick={() => handleViewTask(notification.id)}
                  title="View task details"
                >
                  <i className="fas fa-eye"></i> View
                </button>
                <button 
                  className="action-btn complete-btn"
                  onClick={() => handleCompleteTask(notification.id)}
                  title="Mark task as complete"
                >
                  <i className="fas fa-check"></i> Done
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;