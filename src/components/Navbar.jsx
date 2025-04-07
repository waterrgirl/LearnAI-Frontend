
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/styles.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav>
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img src="/src/assets/LearnAI-Logo.png" alt="LearnAI Logo" className="nav-logo-img" />
        </Link>
        <div className="burger-menu" onClick={toggleMenu}>
          <div className={`burger-bar ${isOpen ? 'open' : ''}`}></div>
          <div className={`burger-bar ${isOpen ? 'open' : ''}`}></div>
          <div className={`burger-bar ${isOpen ? 'open' : ''}`}></div>
        </div>
      </div>
      <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
        <li><Link to="/tasks" onClick={toggleMenu}>Tasks</Link></li>
        <li><Link to="/progress" onClick={toggleMenu}>Progress</Link></li>
        <li><Link to="/calendar" onClick={toggleMenu}>Calendar</Link></li>
        <li><Link to="/login" onClick={toggleMenu}>LogIn</Link></li>
        <li><Link to="/register" onClick={toggleMenu}>Signup</Link></li>
        <li><Link to="/settings" onClick={toggleMenu}>Settings</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
