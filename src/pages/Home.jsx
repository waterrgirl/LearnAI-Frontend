import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/styles.css';

function HomePage() {
  return (
    <div className="homepage">
      {/* Header Section */}
      <header className="site-header">
        <nav className="header-nav">
          <div className="logo-container">
            {}
            <img src="src/assets/LearnAI-Slogan.png" alt="LearnAI Logo" className="custom-logo" />
          </div>
          <div className="burger-menu">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        </nav>
        <div className="header-content">
          <h1>Welcome to LearnAI</h1>
          <p>Your personalized academic assistant, powered by AI.</p>
        </div>
      </header>

      {/* Features Section */}
      <section className="features">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-item">
            <h3>Task Management</h3>
            <p>Organize and prioritize your academic tasks with ease.</p>
          </div>
          <div className="feature-item">
            <h3>Progress Tracking</h3>
            <p>Visualize your task completion and academic growth.</p>
          </div>
          <div className="feature-item">
            <h3>Calendar</h3>
            <p>Keep track of deadlines with an intuitive calendar view.</p>
          </div>
          <div className="feature-item">
            <h3>Personalized Suggestions</h3>
            <p>Receive AI-driven study tips tailored to your needs.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
