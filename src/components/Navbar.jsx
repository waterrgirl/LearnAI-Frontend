
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/styles.css';

function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/" className="nav-logo">
            <img src="/src/assets/LearnAI-Logo.png" alt="LearnAI Logo" className="nav-logo-img" />
          </Link>
        </li>
        <li><Link to="/tasks">Tasks</Link></li>
        <li><Link to="/progress">Progress</Link></li>
        <li><Link to="/settings">Settings</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/calendar">Calendar</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
