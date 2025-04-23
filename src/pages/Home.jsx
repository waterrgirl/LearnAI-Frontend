import React from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../api';
import '../styles/styles.css';

function HomePage() {
  const authenticated = isAuthenticated();

  return (
    <div className="homepage">
      {/* Header Section */}
      <header className="site-header">
        <div className="header-container">
          <div className="header-content">
            <h1>
              <span className="welcome-text">Welcome to</span>
              <span className="brand-text">LearnAI</span>
            </h1>
            <p>Your personalized academic assistant, powered by AI. Manage tasks, track progress, and stay ahead of deadlines.</p>
            <div className="header-buttons">
              {authenticated ? (
                <Link to="/tasks" className="btn">My Tasks</Link>
              ) : (
                <>
                  <Link to="/login" className="btn">Login</Link>
                  <Link to="/register" className="btn btn-secondary">Sign Up</Link>
                </>
              )}
            </div>
          </div>
          <div className="logo-container">
            <img src="/src/assets/LearnAI-Slogan(nobg).png" alt="LearnAI Logo" className="custom-logo" />
          </div>
        </div>
      </header>

      {/* Features Section */}
          
      <section className="features">
        <div className="container">
          <h2>Smart Features for Academic Success</h2>
          <ul className="features-list">
            <li className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-tasks"></i>
              </div>
              <h3>Task Management</h3>
              <p>Organize and prioritize your academic tasks with our intuitive interface.</p>
            </li>
            <li className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Progress Tracking</h3>
              <p>Visualize your task completion and academic growth with detailed analytics.</p>
            </li>
            <li className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <h3>Smart Calendar</h3>
              <p>Keep track of deadlines and important dates with our integrated calendar view.</p>
            </li>
            <li className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-bell"></i>
              </div>
              <h3>Smart Reminders</h3>
              <p>Receive timely notifications for upcoming deadlines and important tasks.</p>
            </li>
            <li className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-lightbulb"></i>
              </div>
              <h3>Adaptive Suggestions</h3>
              <p>Get personalized study tips and recommendations based on your unique learning patterns.</p>
            </li>
            <li className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-user-friends"></i>
              </div>
              <h3>User Friendly Design</h3>
              <p>Enjoy a clean, intuitive interface designed for smooth navigation and effortless task management.</p>
            </li>
          </ul>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Boost Your Academic Performance?</h2>
          <p>Join thousands of students who are already using LearnAI to stay organized and excel in their studies.</p>
          <div className="cta-buttons">
            {authenticated ? (
              <Link to="/tasks" className="cta-button">My Tasks</Link>
            ) : (
              <>
                <Link to="/login" className="cta-button">Login</Link>
                <Link to="/register" className="cta-button">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}


export default HomePage;