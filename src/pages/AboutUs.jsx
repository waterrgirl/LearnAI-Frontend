import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/AboutUsPage.css';

function AboutUs() {
  return (
    <div className="about-page">
      <div className="about-header">
        <h1>About LearnAI</h1>
        <div className="header-decoration"></div>
        <p className="about-subtitle">Empowering your academic journey with intelligent solutions</p>
      </div>

      <div className="about-section">
        <div className="about-section-header">
          <i className="fas fa-rocket"></i>
          <h2>Our Mission</h2>
        </div>
        <p className="about-text">
          LearnAI is a cutting-edge academic assistant platform designed to help students manage their tasks, 
          track progress, and receive AI-driven study recommendations. Our mission is to empower students to achieve 
          their academic goals with personalized tools and an intuitive interface.
        </p>
        <div className="mission-stats">
          <div className="stat-item">
            <div className="stat-number">1000+</div>
            <div className="stat-label">Active Users</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50,000+</div>
            <div className="stat-label">Tasks Managed</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">Satisfaction Rate</div>
          </div>
        </div>
      </div>

      <div className="about-section">
        <div className="about-section-header">
          <i className="fas fa-users"></i>
          <h2>Our Team</h2>
        </div>
        <p className="about-text">
          LearnAI was developed by a passionate group of students and professionals committed to enhancing the learning experience. 
          With expertise in AI, machine learning, and user-centered design, our team is dedicated to creating innovative solutions 
          for academic success.
        </p>
        <div className="team-grid">
          <div className="team-member">
            <div className="team-member-avatar">
              <i className="fas fa-user"></i>
            </div>
            <h3>Raeesa Karodia</h3>
            <p>Founder & Lead Developer</p>
          </div>
          <div className="team-member">
            <div className="team-member-avatar">
              <i className="fas fa-user"></i>
            </div>
            <h3>Dr. Kalaimagal</h3>
            <p>AI Research Advisor</p>
          </div>
        </div>
      </div>

      <div className="about-section">
        <div className="about-section-header">
          <i className="fas fa-lightbulb"></i>
          <h2>What We Offer</h2>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-tasks"></i>
            </div>
            <h3>Task Management</h3>
            <p>Organize your academic workload efficiently with our intuitive task management system.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <h3>Progress Tracking</h3>
            <p>Visualize your performance with detailed insights and customized analytics.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-lightbulb"></i>
            </div>
            <h3>AI Recommendations</h3>
            <p>Receive tailored study tips and strategies based on your learning patterns.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-calendar-alt"></i>
            </div>
            <h3>Calendar Integration</h3>
            <p>Stay on top of your deadlines and schedules with our smart calendar system.</p>
          </div>
        </div>
      </div>

      <div className="about-section">
        <div className="about-section-header">
          <i className="fas fa-code"></i>
          <h2>Our Technology</h2>
        </div>
        <p className="about-text">
          LearnAI leverages cutting-edge technologies to provide a seamless and intelligent experience:
        </p>
        <div className="tech-stack">
          <div className="tech-item">
            <div className="tech-icon">
              <i className="fab fa-react"></i>
            </div>
            <span>React</span>
          </div>
          <div className="tech-item">
            <div className="tech-icon">
              <i className="fab fa-node-js"></i>
            </div>
            <span>Node.js</span>
          </div>
          <div className="tech-item">
            <div className="tech-icon">
              <i className="fas fa-database"></i>
            </div>
            <span>MongoDB</span>
          </div>
          <div className="tech-item">
            <div className="tech-icon">
              <i className="fas fa-brain"></i>
            </div>
            <span>TensorFlow</span>
          </div>
          <div className="tech-item">
            <div className="tech-icon">
              <i className="fas fa-cloud"></i>
            </div>
            <span>AWS</span>
          </div>
        </div>
      </div>

      <div className="about-action">
        <h2>Ready to boost your academic performance?</h2>
        <div className="about-buttons">
          <Link to="/register" className="about-button primary">
            <i className="fas fa-user-plus"></i> Sign Up Now
          </Link>
          <Link to="/contact-us" className="about-button secondary">
            <i className="fas fa-envelope"></i> Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;