import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../api';
import '../styles/Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  const navRef = useRef(null);
  const notificationsRef = useRef(null);
  const location = useLocation();
  const authenticated = isAuthenticated();

  // Handle clicks outside navbar and notifications
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scrolling when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [menuOpen]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    // Close notifications when menu opens
    if (!menuOpen) {
      setNotificationsOpen(false);
    }
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    // Close menu when notifications open
    if (!notificationsOpen) {
      setMenuOpen(false);
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <nav ref={navRef}>
        <div className="nav-container">
          <Link to="/" className="nav-logo" onClick={closeMenu}>
            <img src="/src/assets/LearnAI-Logo.png" alt="LearnAI Logo" />
          </Link>

          <div className={`nav-menu ${menuOpen ? 'open' : ''}`}>
            <ul>
              {/* Home link added at the top of the menu */}
              <li><Link to="/" className={isActive('/')} onClick={closeMenu}>Home</Link></li>
              
              {authenticated ? (
                <>
                  <li><Link to="/tasks" className={isActive('/tasks')} onClick={closeMenu}>Tasks</Link></li>
                  <li><Link to="/progress" className={isActive('/progress')} onClick={closeMenu}>Progress</Link></li>
                  <li><Link to="/calendar" className={isActive('/calendar')} onClick={closeMenu}>Calendar</Link></li>
                  <li><Link to="/settings" className={isActive('/settings')} onClick={closeMenu}>Settings</Link></li>
                  <li><Link to="/profile" className={isActive('/profile')} onClick={closeMenu}>Profile</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/login" className={isActive('/login')} onClick={closeMenu}>Login</Link></li>
                  <li><Link to="/register" className={isActive('/register')} onClick={closeMenu}>Sign Up</Link></li>
                </>
              )}
            </ul>
          </div>

          <div className="nav-actions">
            {authenticated && (
              <div className="notifications-container" ref={notificationsRef}>
                <button 
                  className="notification-bell" 
                  onClick={toggleNotifications}
                  aria-label="Notifications"
                >
                  <i className="fas fa-bell"></i>
                  {hasNotifications && <span className="notification-badge"></span>}
                </button>
                
                {notificationsOpen && (
                  <div className={`notifications-dropdown ${notificationsOpen ? 'open' : ''}`}>
                    <div className="notifications-header">
                      <h3>Notifications</h3>
                      <button className="mark-read-btn">Mark all as read</button>
                    </div>
                    <div className="notifications-list">
                      <div className="empty-notifications">
                        <p>You have no new notifications</p>
                      </div>
                      {/* Notification items would be rendered here */}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <button className="burger-menu" onClick={toggleMenu} aria-label="Menu">
              <span className={`burger-bar ${menuOpen ? 'open' : ''}`}></span>
              <span className={`burger-bar ${menuOpen ? 'open' : ''}`}></span>
              <span className={`burger-bar ${menuOpen ? 'open' : ''}`}></span>
            </button>
          </div>
        </div>
      </nav>
      {/* Page overlay when mobile menu is open */}
      <div className={`page-overlay ${menuOpen ? 'active' : ''}`} onClick={closeMenu}></div>
    </>
  );
}

export default Navbar;