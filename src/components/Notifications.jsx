import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import "../styles/Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState({ 
    overdue: [], 
    urgent: [], 
    soon: [], 
    upcoming: [] 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Handle clicks outside of the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && 
          !dropdownRef.current.contains(event.target) && 
          buttonRef.current && 
          !buttonRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch notifications on component mount
  useEffect(() => {
    console.log("Notifications component mounted");
    fetchNotifications();
    
    // Set up polling interval (every 5 minutes)
    const intervalId = setInterval(fetchNotifications, 5 * 60 * 1000);
    
    // Add event listener for task updates
    window.addEventListener('tasksUpdated', fetchNotifications);
    
    // For debugging
    console.log("Today's date in Notifications component:", new Date().toISOString().split('T')[0]);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('tasksUpdated', fetchNotifications);
    };
  }, []);

  // Calculate unread count whenever notifications change
  useEffect(() => {
    const totalCount = getTotalNotifications();
    console.log("Total notification count:", totalCount);
    setUnreadCount(totalCount);
  }, [notifications]);

  // Add the missing function to calculate total notifications
  const getTotalNotifications = () => {
    return notifications.overdue.length + 
           notifications.urgent.length + 
           notifications.soon.length + 
           notifications.upcoming.length;
  };

  const fetchNotifications = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = userData.uid;
      
      if (!userId) {
        console.log("User not authenticated, skipping notification fetch");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      // Use direct API endpoint without environment variables
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

  // Toggle dropdown on bell click - with debugging
  const handleBellClick = () => {
    console.log("Bell clicked, toggling dropdown");
    setShowDropdown(prevState => !prevState);
  };

  const handleTaskClick = (taskId) => {
    // Navigate to tasks page
    navigate('/tasks');
    setShowDropdown(false);
  };

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'overdue': return 'notification-overdue';
      case 'urgent': return 'notification-urgent';
      case 'soon': return 'notification-soon';
      case 'upcoming': return 'notification-upcoming';
      default: return '';
    }
  };

  const formatMessage = (task) => {
    switch (task.reminder_type) {
      case 'overdue': return `OVERDUE: ${task.title} (${task.deadline})`;
      case 'urgent': return `Due today: ${task.title}`;
      case 'soon': return `Due tomorrow: ${task.title}`;
      case 'upcoming': return `Due soon: ${task.title} (${task.deadline})`;
      default: return task.title;
    }
  };

  // For debugging only
  console.log("Rendering Notifications component", { showDropdown, unreadCount });

  return (
    <div className="notifications-container">
      <div 
        className="notification-bell-wrapper"
        onClick={handleBellClick}
        ref={buttonRef}
      >
        <i className="fas fa-bell"></i>
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </div>

      {showDropdown && (
        <div className="notifications-dropdown" ref={dropdownRef}>
          <div className="notifications-header">
            <h3>Notifications</h3>
            <button className="mark-read-btn" onClick={fetchNotifications}>
              Refresh
            </button>
          </div>
          
          {loading ? (
            <p className="loading-text">Loading notifications...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : (
            <div className="notifications-content">
              {notifications.overdue.length === 0 &&
               notifications.urgent.length === 0 &&
               notifications.soon.length === 0 &&
               notifications.upcoming.length === 0 ? (
                <p className="no-notifications">No pending notifications</p>
              ) : (
                <ul className="notifications-list">
                  {notifications.overdue.map(task => (
                    <li 
                      key={task.id} 
                      className={`notification-item ${getNotificationStyle(task.reminder_type)}`}
                      onClick={() => handleTaskClick(task.id)}
                    >
                      <span className="notification-message">{formatMessage(task)}</span>
                      <span className="notification-priority">{task.priority}</span>
                    </li>
                  ))}
                  
                  {notifications.urgent.map(task => (
                    <li 
                      key={task.id} 
                      className={`notification-item ${getNotificationStyle(task.reminder_type)}`}
                      onClick={() => handleTaskClick(task.id)}
                    >
                      <span className="notification-message">{formatMessage(task)}</span>
                      <span className="notification-priority">{task.priority}</span>
                    </li>
                  ))}
                  
                  {notifications.soon.map(task => (
                    <li 
                      key={task.id} 
                      className={`notification-item ${getNotificationStyle(task.reminder_type)}`}
                      onClick={() => handleTaskClick(task.id)}
                    >
                      <span className="notification-message">{formatMessage(task)}</span>
                      <span className="notification-priority">{task.priority}</span>
                    </li>
                  ))}
                  
                  {notifications.upcoming.map(task => (
                    <li 
                      key={task.id} 
                      className={`notification-item ${getNotificationStyle(task.reminder_type)}`}
                      onClick={() => handleTaskClick(task.id)}
                    >
                      <span className="notification-message">{formatMessage(task)}</span>
                      <span className="notification-priority">{task.priority}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <div className="notifications-footer">
            <Link to="/notifications" className="see-all-link" onClick={() => setShowDropdown(false)}>
              See all notifications <i className="fas fa-chevron-right"></i>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications;