import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import API from "../api";
import "../styles/LoginPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/tasks');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    if (!email || !password) {
      setErrorMessage("Please fill in both fields.");
      setLoading(false);
      return;
    }

    try {
      // First, authenticate with Firebase Auth REST API
      const authResponse = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${import.meta.env.VITE_FIREBASE_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        }
      );

      const authData = await authResponse.json();

      if (!authResponse.ok) {
        const errorMessage = authData.error?.message || 'Failed to login';
        throw new Error(errorMessage);
      }

      // Then, verify the token with our backend
      const backendResponse = await API.post("/api/login", {
        idToken: authData.idToken,
      });

      // Store user info in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: authData.localId,
          email: authData.email,
          name: backendResponse.data.name || '',
          token: authData.idToken,
          refreshToken: authData.refreshToken,
          expiresIn: authData.expiresIn
        })
      );

      // Redirect to tasks page
      navigate("/tasks");
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.message === "EMAIL_NOT_FOUND") {
        setErrorMessage("Email not found. Please check your email or register.");
      } else if (error.message === "INVALID_PASSWORD") {
        setErrorMessage("Invalid password. Please try again.");
      } else {
        setErrorMessage("Login failed: " + error.message);
      }
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