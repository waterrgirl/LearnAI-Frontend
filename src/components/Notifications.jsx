import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState({ 
    overdue: [], 
    urgent: [], 
    soon: [], 
    upcoming: [] 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  // Fetch notifications on component mount and every 15 minutes
  useEffect(() => {
    fetchNotifications();
    
    // Set up polling interval (every 15 minutes)
    const intervalId = setInterval(fetchNotifications, 15 * 60 * 1000);
    
    // Add event listener for task updates
    window.addEventListener('tasksUpdated', fetchNotifications);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('tasksUpdated', fetchNotifications);
    };
  }, []);

  // Calculate unread count whenever notifications change
  useEffect(() => {
    const allNotifications = [
      ...notifications.overdue, 
      ...notifications.urgent, 
      ...notifications.soon, 
      ...notifications.upcoming
    ];
    
    const totalCount = allNotifications.length;
    
    setUnreadCount(totalCount);
    
    // Store read status in localStorage
    const readStatus = JSON.parse(localStorage.getItem('readNotifications') || '{}');
    
    // Update with any new notifications
    allNotifications.forEach(notif => {
      if (!readStatus[notif.id]) {
        readStatus[notif.id] = false; // unread
      }
    });
    
    localStorage.setItem('readNotifications', JSON.stringify(readStatus));
  }, [notifications]);

  const fetchNotifications = async () => {
    if (!API.isAuthenticated()) return;
    
    setLoading(true);
    try {
      const res = await API.get("/api/reminders");
      setNotifications(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = (taskId) => {
    // Mark notification as read
    const readStatus = JSON.parse(localStorage.getItem('readNotifications') || '{}');
    readStatus[taskId] = true;
    localStorage.setItem('readNotifications', JSON.stringify(readStatus));
    
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

  return (
    <div className="notifications-container">
      <div 
        className="notification-bell" 
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <i className="fas fa-bell"></i>
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </div>

      {showDropdown && (
        <div className="notifications-dropdown">
          <h3>Notifications</h3>
          
          {loading ? (
            <p className="loading-text">Loading notifications...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : (
            <>
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
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Notifications;