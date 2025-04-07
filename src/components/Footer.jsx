
import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-links">
          <Link to="/about-us">About Us</Link>
          <Link to="/contact-us">Contact Us</Link>
        </div>
        <p className="footer-copyright">© 2024 LearnAI. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
