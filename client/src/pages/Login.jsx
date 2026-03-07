import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import api from "../api/axios";
import useAuth from "../context/useAuth";
import "../style/Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const cardRef = useRef(null);
  const pawRefs = useRef([]);

  useEffect(() => {
    // Card entrance — start visible, just slide up
    gsap.fromTo(cardRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    );

    // Float each paw independently
    pawRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        y: `-=${10 + i * 3}`,
        rotation: `+=${15 + i * 5}`,
        duration: 3 + i * 0.7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.4,
      });
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      login(data);
      setTimeout(() => navigate("/feed"), 800);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
      setIsSubmitting(false);
      gsap.fromTo(cardRef.current,
        { x: 0 },
        { x: -8, duration: 0.07, yoyo: true, repeat: 5, ease: "power2.out" }
      );
    }
  };

  return (
    <div className="auth-page">
      {/* Floating paws — CSS animated, no GSAP opacity issues */}
      <span ref={el => pawRefs.current[0] = el} className="auth-paw" style={{ left: "6%",  top: "10%" }}>🐾</span>
      <span ref={el => pawRefs.current[1] = el} className="auth-paw" style={{ left: "88%", top: "7%"  }}>🐾</span>
      <span ref={el => pawRefs.current[2] = el} className="auth-paw" style={{ left: "4%",  top: "72%" }}>🐾</span>
      <span ref={el => pawRefs.current[3] = el} className="auth-paw" style={{ left: "91%", top: "68%" }}>🐾</span>
      <span ref={el => pawRefs.current[4] = el} className="auth-paw" style={{ left: "78%", top: "85%" }}>🐾</span>
      <span ref={el => pawRefs.current[5] = el} className="auth-paw" style={{ left: "20%", top: "88%" }}>🐾</span>

      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-blob bg-blob-3" />

      <div ref={cardRef} className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-icon">🐶</div>
          <span className="auth-brand-name">
            <span>Dogesh</span><span className="brand-accent">Book</span>
          </span>
        </div>

        <div className="auth-heading">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">Sign in to see what your pack is up to</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              className="auth-input"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <div className="field-row">
              <label className="auth-label">Password</label>
              <button type="button" className="toggle-pass" onClick={() => setShowPassword(p => !p)}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              className="auth-input"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !email || !password}
            className={`auth-btn ${email && password && !isSubmitting ? "auth-btn-active" : ""}`}
          >
            {isSubmitting ? <><span className="auth-spin" /> Signing in...</> : "Sign In"}
          </button>
        </form>

        <div className="auth-divider"><span>New to DogeshBook?</span></div>
        <button className="auth-alt-btn" onClick={() => navigate("/register")} disabled={isSubmitting}>
          Create an account
        </button>
      </div>
    </div>
  );
};

export default Login;