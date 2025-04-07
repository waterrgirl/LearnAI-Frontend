import React, { useState } from "react";
import axios from "axios";
import "../styles/LoginPage.css"; // Import custom styles for the login page

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission refresh
    setErrorMessage("");
    setLoading(true);

    if (!email || !password) {
      setErrorMessage("Please fill in both fields.");
      setLoading(false);
      return;
    }

    try {
      // Replace with your back-end login API endpoint
      const response = await axios.post("http://<your-backend-url>/login", {
        email,
        password,
      });

      // Handle successful login (e.g., saving token, redirecting)
      console.log("Login successful:", response.data);
      alert("Login successful!");

      // Example: Redirect to another page
      window.location.href = "/tasks";
    } catch (error) {
      // Handle errors (e.g., invalid credentials)
      console.error("Login error:", error.response);
      setErrorMessage(
        error.response?.data?.message || "An error occurred during login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h1>Login to LearnAI</h1>
      <form className="login-form" onSubmit={handleLogin}>
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
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="signup-link">
        Don't have an account? <a href="/register">Sign up here</a>.
      </p>
    </div>
  );
}

export default LoginPage;
