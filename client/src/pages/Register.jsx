import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import useAuth from "../context/useAuth";
import "../style/Register.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await api.post("/auth/register", {
        email,
        password,
      });

      // save token + user in context
      login(data);

      // Show success animation before redirect
      setTimeout(() => {
        navigate("/dog");
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Calculate password strength
  const calculatePasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 6) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    calculatePasswordStrength(value);
  };

  // Animated paws for decoration
  const animatedPaws = ["🐾", "🐾", "🐾", "🐾", "🐾"];

  return (
    <div className="register-container">
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
      <div className="register-illustration">
        <div className="illustration-content">
          <div className="dog-characters">
            <span className="dog-big">🐶</span>
            <span className="dog-medium">🎉</span>
            <span className="dog-small">🐕</span>
          </div>
          <div className="illustration-text">
            <h2 className="welcome-title">Join the Pack!</h2>
            <p className="welcome-subtitle">
              Create an account and let your dog make new furry friends!
            </p>
          </div>
          <div className="illustration-features">
            <div className="feature">
              <span className="feature-icon">📝</span>
              <span className="feature-text">Create dog profiles</span>
            </div>
            <div className="feature">
              <span className="feature-icon">📷</span>
              <span className="feature-text">Share photos & stories</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🤝</span>
              <span className="feature-text">Connect with other dogs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="register-form-container">
        <div className="form-card">
          {/* Logo */}
          <div className="form-logo">
            <div className="logo-icon">
              <span className="logo-dog">🐕</span>
            </div>
            <h1 className="logo-text">DogeshBook</h1>
          </div>

          {/* Form Header */}
          <div className="form-header">
            <h2 className="form-title">Create Your Account</h2>
            <p className="form-subtitle">
              Join our community of dog lovers and start sharing today!
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <div className="error-content">
                <strong>Registration Failed</strong>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="register-form">
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
              <div className="input-hint">
                We'll use this to send you doggy updates
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
                  placeholder="Create a secure password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  disabled={isSubmitting}
                  className="form-input"
                  autoComplete="new-password"
                />
                <span className="input-icon">🔑</span>
              </div>
              
              {/* Password Strength Meter */}
              <div className="password-strength">
                <div className="strength-label">
                  Password Strength:
                  <span className={`strength-text strength-${passwordStrength}`}>
                    {passwordStrength === 0 ? " Weak" : 
                     passwordStrength === 1 ? " Fair" : 
                     passwordStrength === 2 ? " Good" : 
                     passwordStrength === 3 ? " Strong" : " Very Strong"}
                  </span>
                </div>
                <div className="strength-meter">
                  {[1, 2, 3, 4].map((level) => (
                    <div 
                      key={level}
                      className={`strength-bar ${passwordStrength >= level ? 'active' : ''}`}
                      style={{ backgroundColor: passwordStrength >= level ? 
                        ['#FF8A7A', '#FFB7C5', '#4A6FA5', '#68D391'][level - 1] : 
                        'var(--border-light)' 
                      }}
                    />
                  ))}
                </div>
                <div className="password-hint">
                  <span className="hint-icon">💡</span>
                  Use at least 6 characters with uppercase, numbers, and symbols for best security
                </div>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">✅</span>
                Confirm Password
              </label>
              <div className="input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className={`form-input ${confirmPassword && password !== confirmPassword ? 'error' : ''}`}
                  autoComplete="new-password"
                />
                <span className="input-icon">🔒</span>
                {confirmPassword && password === confirmPassword && (
                  <span className="input-check">✅</span>
                )}
              </div>
              {confirmPassword && password !== confirmPassword && (
                <div className="password-mismatch">
                  <span className="mismatch-icon">❌</span>
                  Passwords do not match
                </div>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="terms-group">
              <label className="terms-label">
                <input
                  type="checkbox"
                  required
                  disabled={isSubmitting}
                  className="terms-checkbox"
                />
                <span className="terms-text">
                  I agree to the 
                  <button type="button" className="terms-link">Doggy Terms of Service</button> and 
                  <button type="button" className="terms-link">Bone Privacy Policy</button>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
              disabled={isSubmitting || !email || !password || !confirmPassword || password !== confirmPassword}
            >
              {isSubmitting ? (
                <>
                  <span className="loading-spinner"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  <span className="btn-icon">✨</span>
                  Join DogeshBook
                  <span className="btn-arrow">🐕→</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="form-divider">
              <span className="divider-text">Already have an account?</span>
            </div>

            {/* Login Link */}
            <div className="login-section">
              <button 
                type="button"
                className="login-btn"
                onClick={() => navigate("/login")}
                disabled={isSubmitting}
              >
                <span className="login-icon">←</span>
                Back to Login
              </button>
            </div>
          </form>

          {/* Quick Tips */}
          <div className="register-tips">
            <div className="tip-item">
              <span className="tip-icon">🐾</span>
              <span className="tip-text">
                After registration, you'll create your dog's profile!
              </span>
            </div>
            <div className="tip-item">
              <span className="tip-icon">🎯</span>
              <span className="tip-text">
                Use a valid email to receive important updates
              </span>
            </div>
          </div>
        </div>

        {/* Success Animation */}
        <div className={`success-overlay ${isSubmitting && !error ? 'visible' : ''}`}>
          <div className="success-content">
            <div className="success-dog">
              <span className="dog-icon">🎉</span>
              <div className="confetti">✨</div>
            </div>
            <h3>Welcome to the Pack!</h3>
            <p>Creating your account...</p>
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

export default Register;