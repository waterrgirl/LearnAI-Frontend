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
  const [showDrawer, setShowDrawer] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const drawerRef = useRef(null);
  const buttonRef = useRef(null);
  console.log("Rendering notifications component");

  const handleBellClick = (e) => {
    console.log("Bell clicked!");
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowDrawer(prev => !prev);
  };
  
  // Handle clicks outside of the drawer
  useEffect(() => {
    function handleClickOutside(event) {
      if (drawerRef.current && 
          !drawerRef.current.contains(event.target) && 
          buttonRef.current && 
          !buttonRef.current.contains(event.target)) {
        setShowDrawer(false);
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

  // Calculate total notifications
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

  const handleTaskClick = (taskId) => {
    // Navigate to tasks page
    navigate('/tasks');
    setShowDrawer(false);
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

  const formatStatus = (task) => {
    switch (task.reminder_type) {
      case 'overdue': return 'OVERDUE';
      case 'urgent': return 'Due Today';
      case 'soon': return 'Due Tomorrow';
      case 'upcoming': return `Due ${task.deadline}`;
      default: return '';
    }
  };

  return (
    <div className="notifications-container">
      <button 
        type="button"
        className="notification-bell" 
        onClick={handleBellClick}
        ref={buttonRef}
        style={{cursor: 'pointer'}}
      >
        <i className="fas fa-bell"></i>
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>
  
      <div 
        className={`notifications-drawer ${showDrawer ? 'open' : ''}`}
        ref={drawerRef}
      >
        <div className="notifications-drawer-header">
          <h2>Notifications</h2>
          <button 
            className="close-drawer"
            onClick={() => setShowDrawer(false)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="notifications-drawer-content">
          {loading ? (
            <div className="loading-state">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading notifications...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <i className="fas fa-exclamation-circle"></i>
              <p>{error}</p>
            </div>
          ) : getTotalNotifications() === 0 ? (
            <div className="empty-state">
              <i className="fas fa-bell-slash"></i>
              <p>No notifications</p>
            </div>
          ) : (
            <>
              {notifications.overdue.length > 0 && (
                <div className="notification-category">
                  <h3 className="category-title overdue">Overdue</h3>
                  <ul className="notification-items">
                    {notifications.overdue.map(task => (
                      <li 
                        key={task.id} 
                        className="notification-item"
                        onClick={() => handleTaskClick(task.id)}
                      >
                        <div className="notification-content">
                          <h4 className="task-title">{task.title}</h4>
                          <p className="task-status overdue">{formatStatus(task)}</p>
                        </div>
                        <i className="fas fa-chevron-right"></i>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {notifications.urgent.length > 0 && (
                <div className="notification-category">
                  <h3 className="category-title urgent">Due Today</h3>
                  <ul className="notification-items">
                    {notifications.urgent.map(task => (
                      <li 
                        key={task.id} 
                        className="notification-item"
                        onClick={() => handleTaskClick(task.id)}
                      >
                        <div className="notification-content">
                          <h4 className="task-title">{task.title}</h4>
                          <p className="task-status urgent">{formatStatus(task)}</p>
                        </div>
                        <i className="fas fa-chevron-right"></i>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {notifications.soon.length > 0 && (
                <div className="notification-category">
                  <h3 className="category-title soon">Due Tomorrow</h3>
                  <ul className="notification-items">
                    {notifications.soon.map(task => (
                      <li 
                        key={task.id} 
                        className="notification-item"
                        onClick={() => handleTaskClick(task.id)}
                      >
                        <div className="notification-content">
                          <h4 className="task-title">{task.title}</h4>
                          <p className="task-status soon">{formatStatus(task)}</p>
                        </div>
                        <i className="fas fa-chevron-right"></i>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {notifications.upcoming.length > 0 && (
                <div className="notification-category">
                  <h3 className="category-title upcoming">Coming Up</h3>
                  <ul className="notification-items">
                    {notifications.upcoming.map(task => (
                      <li 
                        key={task.id} 
                        className="notification-item"
                        onClick={() => handleTaskClick(task.id)}
                      >
                        <div className="notification-content">
                          <h4 className="task-title">{task.title}</h4>
                          <p className="task-status upcoming">{formatStatus(task)}</p>
                        </div>
                        <i className="fas fa-chevron-right"></i>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="notifications-drawer-footer">
          <Link 
            to="/notifications" 
            className="view-all-link"
            onClick={() => setShowDrawer(false)}
          >
            View All Notifications
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </div>
      
      {/* Add an overlay when drawer is open */}
      {showDrawer && (
        <div 
          className="notifications-overlay"
          onClick={() => setShowDrawer(false)}
        ></div>
      )}
    </div>
  );
}

export default Notifications;