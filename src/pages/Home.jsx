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

      {/* Improved Footer Section */}
      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <img src="/src/assets/LearnAI-Logo.png" alt="LearnAI Logo" className="footer-logo" />
            <p className="footer-tagline">Your personalized academic assistant, powered by AI. Helping students stay ahead of deadlines and excel in their studies.</p>
            <div className="footer-social">
              <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-github"></i></a>
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/"><i className="fas fa-chevron-right"></i> Home</Link></li>
              <li><Link to="/tasks"><i className="fas fa-chevron-right"></i> Tasks</Link></li>
              <li><Link to="/progress"><i className="fas fa-chevron-right"></i> Progress</Link></li>
              <li><Link to="/calendar"><i className="fas fa-chevron-right"></i> Calendar</Link></li>
              <li><Link to="/settings"><i className="fas fa-chevron-right"></i> Settings</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Resources</h3>
            <ul className="footer-links">
              <li><Link to="/about-us"><i className="fas fa-chevron-right"></i> About Us</Link></li>
              <li><Link to="/contact-us"><i className="fas fa-chevron-right"></i> Contact Us</Link></li>
              <li><Link to="/privacy"><i className="fas fa-chevron-right"></i> Privacy Policy</Link></li>
              <li><Link to="/terms"><i className="fas fa-chevron-right"></i> Terms of Service</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Contact Us</h3>
            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <span>support@learnai.edu</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <span>+44 115 951 5151</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>University of Nottingham<br />Nottingham, NG7 2RD, UK</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="copyright-wrapper">
          <div className="copyright">
            <p>© {new Date().getFullYear()} LearnAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}


export default HomePage;