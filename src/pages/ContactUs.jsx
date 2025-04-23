import React, { useState } from 'react';
import '../styles/ContactUsPage.css';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <div className="header-decoration"></div>
          <p className="contact-subtitle">Have questions or feedback? We'd love to hear from you!</p>
        </div>
        
        <div className="contact-content">
          <div className="contact-info">
            <div className="info-section">
              <div className="info-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div className="info-text">
                <h3>Location</h3>
                <p>University of Nottingham<br/>Semenyih, Selangor, Malaysia</p>
              </div>
            </div>
            
            <div className="info-section">
              <div className="info-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="info-text">
                <h3>Email</h3>
                <p>hfyrk3@nottingham.edu.my</p>
              </div>
            </div>
            
            <div className="info-section">
              <div className="info-icon">
                <i className="fas fa-phone-alt"></i>
              </div>
              <div className="info-text">
                <h3>Phone</h3>
                <p>+60 182 857 242</p>
              </div>
            </div>
            
            <div className="social-links">
              <a href="#" className="social-link">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
          
          <div className="contact-form-container">
            {submitted ? (
              <div className="form-success">
                <div className="success-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <h2>Thank You!</h2>
                <p>Your message has been sent successfully. We'll get back to you soon!</p>
                <button 
                  className="contact-button"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <div className="input-container">
                    <i className="fas fa-user input-icon"></i>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className={errors.name ? 'error' : ''}
                    />
                  </div>
                  {errors.name && <div className="error-message">{errors.name}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-container">
                    <i className="fas fa-envelope input-icon"></i>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className={errors.email ? 'error' : ''}
                    />
                  </div>
                  {errors.email && <div className="error-message">{errors.email}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject (Optional)</label>
                  <div className="input-container">
                    <i className="fas fa-tag input-icon"></i>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What is this regarding?"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
                  <div className="textarea-container">
                    <i className="fas fa-comment input-icon"></i>
                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Type your message here..."
                      className={errors.message ? 'error' : ''}
                    ></textarea>
                  </div>
                  {errors.message && <div className="error-message">{errors.message}</div>}
                </div>
                
                <button 
                  type="submit" 
                  className="contact-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Sending...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;