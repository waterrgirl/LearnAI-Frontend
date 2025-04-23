import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../api';
import '../styles/Navbar.css';
import Notifications from './Notifications';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();
  const authenticated = isAuthenticated();

  // Handle clicks outside navbar
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMenuOpen(false);
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
                  <li><Link to="/notifications" className={isActive('/notifications')} onClick={closeMenu}>Notifications</Link></li>
                  <li><Link to="/settings" className={isActive('/settings')} onClick={closeMenu}>Settings</Link></li>
                  
                  {/* Divider for informational pages */}
                  <li className="nav-divider"></li>
                  <li><Link to="/about-us" className={isActive('/about-us')} onClick={closeMenu}>About Us</Link></li>
                  <li><Link to="/contact-us" className={isActive('/contact-us')} onClick={closeMenu}>Contact Us</Link></li>
                  
                  {/* Second divider for profile */}
                  <li className="nav-divider"></li>
                  <li><Link to="/profile" className={isActive('/profile')} onClick={closeMenu}>Profile</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/login" className={isActive('/login')} onClick={closeMenu}>Login</Link></li>
                  <li><Link to="/register" className={isActive('/register')} onClick={closeMenu}>Sign Up</Link></li>
                  {/* Divider for non-authenticated users */}
                  <li className="nav-divider"></li>
                  <li><Link to="/about-us" className={isActive('/about-us')} onClick={closeMenu}>About Us</Link></li>
                  <li><Link to="/contact-us" className={isActive('/contact-us')} onClick={closeMenu}>Contact Us</Link></li>
                </>
              )}
            </ul>
          </div>

          <div className="nav-actions">
            {authenticated && (
              <Notifications />
            )}
            
            <button className="burger-menu" onClick={toggleMenu} aria-label="Menu">
              <span className={`burger-bar ${menuOpen ? 'open' : ''}`}></span>
              <span className={`burger-bar ${menuOpen ? 'open' : ''}`}></span>
              <span className={`burger-bar ${menuOpen ? 'open' : ''}`}></span>
            </button>
          </div>
        </div>
      </nav>
      <div className={`page-overlay ${menuOpen ? 'active' : ''}`} onClick={closeMenu}></div>
    </>
  );
}

export default Navbar;