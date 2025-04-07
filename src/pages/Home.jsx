import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/styles.css';

function HomePage() {
  return (
    <div className="homepage">
      {/* Header Section */}
      <header className="site-header">
        <div className="header-container">
          <div className="header-content">
            <h1><span className="welcome-text">Welcome to</span> <span className="brand-text">LearnAI</span></h1>
            <p>Your personalized academic assistant, powered by AI.</p>
          </div>
          <div className="logo-container">
            <img src="src/assets/LearnAI-Slogan(nobg).png" alt="LearnAI Logo" className="custom-logo" />
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="features">
        <h2>Features</h2>
        <ul className="features-list">
          <li className="feature-item">
            <h3>Task Management</h3>
            <p>Organize and prioritize your academic tasks with ease.</p>
          </li>
          <li className="feature-item">
            <h3>Progress Tracking</h3>
            <p>Visualize your task completion and academic growth.</p>
          </li>
          <li className="feature-item">
            <h3>Calendar</h3>
            <p>Keep track of deadlines with an intuitive calendar view.</p>
          </li>
          <li className="feature-item">
            <h3>Personalized Suggestions</h3>
            <p>Receive AI-driven study tips tailored to your needs.</p>
          </li>
        </ul>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-buttons">
          <Link to="/login" className="cta-button">Login</Link>
          <Link to="/register" className="cta-button">Sign Up</Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
