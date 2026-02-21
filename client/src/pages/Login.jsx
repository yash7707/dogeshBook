import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import useAuth from "../context/useAuth";
import "../style/Login.css"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      // save token + user in context
      login(data);

      // Show success animation before redirect
      setTimeout(() => {
        navigate("/feed");
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
      setIsSubmitting(false);
    }
  };

  const redirectRegister = () => {
    navigate("/register");
  };

  // Animated paws for decoration
  const animatedPaws = ["🐾", "🐾", "🐾", "🐾", "🐾"];

  return (
    <div className="login-container">
      {/* Background Decorative Paws */}
      <div className="background-paws">
        {animatedPaws.map((paw, index) => (
          <span 
            key={index} 
            className="paw"
            style={{ 
              animationDelay: `${index * 0.5}s`,
              left: `${20 + index * 15}%`,
              top: `${10 + index * 8}%`
            }}
          >
            {paw}
          </span>
        ))}
      </div>

      {/* Left Side - Illustration */}
      <div className="login-illustration">
        <div className="illustration-content">
          <div className="dog-characters hide">
            <span className="dog-big">🐕</span>
            <span className="dog-medium">🐩</span>
            <span className="dog-small">🐕‍🦺</span>
          </div>
          <div className="illustration-text">
            <h2 className="welcome-title">Welcome Back!</h2>
            <p className="welcome-subtitle">
              Your furry friends missed you! Sign in to see what they've been up to.
            </p>
          </div>
          <div className="illustration-features">
            <div className="feature">
              <span className="feature-icon">📰</span>
              <span className="feature-text">See doggy updates</span>
            </div>
            <div className="feature">
              <span className="feature-icon">❤️</span>
              <span className="feature-text">Wag at cute posts</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🐾</span>
              <span className="feature-text">Share your adventures</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-form-container">
        <div className="form-card">
          {/* Logo */}
          <div className="form-logo">
            <div className="logo-icon">
              <span className="logo-dog">🐶</span>
            </div>
            <h1 className="logo-text">DogeshBook</h1>
          </div>

          {/* Form Header */}
          <div className="form-header">
            <h2 className="form-title">Sign In to Your Account</h2>
            <p className="form-subtitle">
              Enter your credentials to access your dog's social network
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <div className="error-content">
                <strong>Login Failed</strong>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📧</span>
                Email Address
              </label>
              <div className="input-container">
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="form-input"
                  autoComplete="email"
                />
                <span className="input-icon">✉️</span>
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <div className="label-row">
                <label className="form-label">
                  <span className="label-icon">🔒</span>
                  Password
                </label>
                <button
                  type="button"
                  className="show-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈 Hide" : "👁️ Show"}
                </button>
              </div>
              <div className="input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="form-input"
                  autoComplete="current-password"
                />
                <span className="input-icon">🔑</span>
              </div>
              <div className="password-hint">
                <span className="hint-icon">💡</span>
                Must be at least 6 characters long
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
              disabled={isSubmitting || !email || !password}
            >
              {isSubmitting ? (
                <>
                  <span className="loading-spinner"></span>
                  Signing In...
                </>
              ) : (
                <>
                  <span className="btn-icon">🐾</span>
                  Sign In to DogeshBook
                  <span className="btn-arrow">→</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="form-divider  hide">
              <span className="divider-text">or continue with</span>
            </div>

            {/* Alternative Login Options */}
            <div className="social-login hide">
              <button 
                type="button"
                className="social-btn google-btn"
                disabled={isSubmitting}
              >
                <span className="social-icon">🐕</span>
                Demo Login
              </button>
              <button 
                type="button"
                className="social-btn demo-btn"
                onClick={() => {
                  setEmail("demo@example.com");
                  setPassword("demo123");
                }}
                disabled={isSubmitting}
              >
                <span className="social-icon">🎮</span>
                Quick Demo
              </button>
            </div>
          </form>

          {/* Register Link */}
          <div className="register-section">
            <p className="register-text">
              New to DogeshBook? 
              <button 
                onClick={redirectRegister}
                className="register-link"
                disabled={isSubmitting}
              >
                Create an account
                <span className="link-arrow">🐕→</span>
              </button>
            </p>
          </div>

          {/* Footer Note */}
          <div className="form-footer hide">
            <div className="footer-note">
              <span className="note-icon">🐕‍🦺</span>
              <p>
                By signing in, you agree to our 
                <button className="footer-link">Doggy Terms</button> and 
                <button className="footer-link">Bone Policy</button>
              </p>
            </div>
          </div>
        </div>

        {/* Success Animation */}
        <div className={`success-overlay ${isSubmitting && !error ? 'visible' : ''}`}>
          <div className="success-content">
            <div className="success-dog">
              <span className="dog-icon">🐶</span>
              <div className="tail-wag"></div>
            </div>
            <h3>Welcome Back!</h3>
            <p>Taking you to your feed...</p>
            <div className="success-paws">
              {animatedPaws.map((paw, index) => (
                <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                  {paw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cute Corner Elements */}
      <div className="corner-elements">
        <div className="corner-paw top-left">🐾</div>
        <div className="corner-paw top-right">🐾</div>
        <div className="corner-paw bottom-left">🐾</div>
        <div className="corner-paw bottom-right">🐾</div>
      </div>
    </div>
  );
};

export default Login;