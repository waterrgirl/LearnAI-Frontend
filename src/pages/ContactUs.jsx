import React, { useState } from "react";
import axios from "axios";
import "../styles/ContactUsPage.css";

function ContactUsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    // Validate inputs
    if (!name || !email || !message) {
      setErrorMessage("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      // Replace with your back-end endpoint for submitting contact messages
      const response = await axios.post("http://<your-backend-url>/contact", {
        name,
        email,
        message,
      });

      setSuccessMessage("Thank you for reaching out! We'll get back to you soon.");
      setName("");
      setEmail("");
      setMessage("");
      console.log("Contact submission successful:", response.data);
    } catch (error) {
      console.error("Error submitting contact form:", error.response);
      setErrorMessage(
        error.response?.data?.message || "An error occurred. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-us-page">
      <h1>Contact Us</h1>
      <p>If you have any questions, feedback, or suggestions, feel free to contact us using the form below!</p>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            placeholder="Enter your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="5"
            required
          ></textarea>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Sending..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default ContactUsPage;
