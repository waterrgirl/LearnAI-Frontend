import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
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
            <li><Link to="/about"><i className="fas fa-chevron-right"></i> About LearnAI</Link></li>
            <li><Link to="/faq"><i className="fas fa-chevron-right"></i> FAQ</Link></li>
            <li><Link to="/privacy"><i className="fas fa-chevron-right"></i> Privacy Policy</Link></li>
            <li><Link to="/terms"><i className="fas fa-chevron-right"></i> Terms of Service</Link></li>
            <li><Link to="/help"><i className="fas fa-chevron-right"></i> Help Center</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contact Us</h3>
          <div className="contact-info">
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <span>hfyrk3@nottingham.edu.my</span>
            </div>
            <div className="contact-item">
              <i className="fas fa-phone"></i>
              <span>+60 182 857 242</span>
            </div>
            <div className="contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>University of Nottingham<br />Selangor, Malaysia</span>
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
  );
}

export default Footer;