import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import api from "../api/axios";
import useAuth from "../context/useAuth";
import "../style/Auth.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);

  const navigate = useNavigate();
  const { login } = useAuth();
  const cardRef = useRef(null);
  const pawRefs = useRef([]);

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    );
    pawRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        y: `-=${10 + i * 3}`,
        rotation: `+=${15 + i * 5}`,
        duration: 3 + i * 0.7,
        repeat: -1, yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.4,
      });
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setIsSubmitting(true);
    try {
      const { data } = await api.post("/auth/register", { email, password });
      login(data);
      setTimeout(() => navigate("/dog"), 800);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
      setIsSubmitting(false);
      gsap.fromTo(cardRef.current,
        { x: 0 },
        { x: -8, duration: 0.07, yoyo: true, repeat: 5, ease: "power2.out" }
      );
    }
  };

  const onPasswordChange = (e) => {
    const v = e.target.value;
    setPassword(v);
    let s = 0;
    if (v.length >= 6) s++;
    if (/[A-Z]/.test(v)) s++;
    if (/[0-9]/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    setStrength(s);
  };

  const strengthColors = ["#e5e7eb", "#ef4444", "#f97316", "#eab308", "#22c55e"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const match = confirmPassword && password === confirmPassword;
  const mismatch = confirmPassword && password !== confirmPassword;
  const canSubmit = email && password && confirmPassword && match && !isSubmitting;

  return (
    <div className="auth-page">
      <span ref={el => pawRefs.current[0] = el} className="auth-paw" style={{ left: "6%",  top: "10%" }}>🐾</span>
      <span ref={el => pawRefs.current[1] = el} className="auth-paw" style={{ left: "88%", top: "7%"  }}>🐾</span>
      <span ref={el => pawRefs.current[2] = el} className="auth-paw" style={{ left: "4%",  top: "72%" }}>🐾</span>
      <span ref={el => pawRefs.current[3] = el} className="auth-paw" style={{ left: "91%", top: "68%" }}>🐾</span>
      <span ref={el => pawRefs.current[4] = el} className="auth-paw" style={{ left: "78%", top: "85%" }}>🐾</span>
      <span ref={el => pawRefs.current[5] = el} className="auth-paw" style={{ left: "20%", top: "88%" }}>🐾</span>

      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-blob bg-blob-3" />

      <div ref={cardRef} className="auth-card auth-card-register">
        <div className="auth-brand">
          <div className="auth-brand-icon">🐕</div>
          <span className="auth-brand-name">
            <span>Dogesh</span><span className="brand-accent">Book</span>
          </span>
        </div>

        <div className="auth-heading">
          <h1 className="auth-title">Join the pack</h1>
          <p className="auth-sub">Create an account and let your dog make new friends</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              className="auth-input" type="email" placeholder="your@email.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
              required disabled={isSubmitting} autoComplete="email"
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
              className="auth-input" type={showPassword ? "text" : "password"}
              placeholder="Create a password" value={password}
              onChange={onPasswordChange} required disabled={isSubmitting}
              autoComplete="new-password"
            />
            {password.length > 0 && (
              <div className="strength-row">
                <div className="strength-track">
                  {[1,2,3,4].map(l => (
                    <div key={l} className="strength-seg" style={{
                      background: strength >= l ? strengthColors[strength] : "#e5e7eb"
                    }} />
                  ))}
                </div>
                <span className="strength-label" style={{ color: strengthColors[strength] }}>
                  {strengthLabels[strength]}
                </span>
              </div>
            )}
          </div>

          <div className="auth-field">
            <label className="auth-label">Confirm Password</label>
            <div className="input-suffix-wrap">
              <input
                className={`auth-input ${mismatch ? "input-err" : ""}`}
                type={showPassword ? "text" : "password"} placeholder="Re-enter password"
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                required disabled={isSubmitting}
              />
              {match && <span className="input-ok">✓</span>}
            </div>
            {mismatch && <p className="field-err">Passwords do not match</p>}
          </div>

          <label className="terms-row">
            <input type="checkbox" required disabled={isSubmitting} className="terms-check" />
            <span className="terms-text">
              I agree to the <button type="button" className="inline-link">Terms</button> &amp; <button type="button" className="inline-link">Privacy Policy</button>
            </span>
          </label>

          <button type="submit" disabled={!canSubmit} className={`auth-btn ${canSubmit ? "auth-btn-active" : ""}`}>
            {isSubmitting ? <><span className="auth-spin" /> Creating account...</> : "Create Account"}
          </button>
        </form>

        <div className="auth-divider"><span>Already have an account?</span></div>
        <button className="auth-alt-btn" onClick={() => navigate("/login")} disabled={isSubmitting}>
          Sign in instead
        </button>
      </div>
    </div>
  );
};

export default Register;