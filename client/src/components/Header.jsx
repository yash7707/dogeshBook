import { Link, useNavigate, useLocation } from "react-router-dom";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import useAuth from "../context/useAuth";

import "../style/Header.css";
import logoGif from "../assets/logo-gif.gif";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const logoTextRef = useRef(null);
  const feedLinkRef = useRef(null);
  const dogLinkRef = useRef(null);
  const logoutBtnRef = useRef(null);

  // Mount animation
  useEffect(() => {
    if (!headerRef.current) return;

    const ctx = gsap.context(() => {
      // Header drops in with bounce
      gsap.from(headerRef.current, {
        y: -80,
        opacity: 0,
        duration: 0.9,
        ease: "back.out(1.4)",
      });

      // Logo icon pops in with spin
      gsap.from(logoRef.current, {
        scale: 0,
        rotation: -15,
        opacity: 0,
        duration: 0.6,
        delay: 0.3,
        ease: "back.out(2)",
      });

      // Logo text slides in
      gsap.from(logoTextRef.current, {
        x: -20,
        opacity: 0,
        duration: 0.5,
        delay: 0.45,
        ease: "power3.out",
      });

      if (user) {
        const navItems = [
          feedLinkRef.current,
          dogLinkRef.current,
          logoutBtnRef.current,
        ].filter(Boolean);

        gsap.from(navItems, {
          y: -16,
          opacity: 0,
          duration: 0.5,
          stagger: 0.08,
          delay: 0.55,
          ease: "back.out(1.6)",
        });
      }
    });

    return () => ctx.revert();
  }, [user]);

  const handleLogout = () => {
    gsap.to(headerRef.current, {
      opacity: 0,
      y: -50,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        logout();
        navigate("/login");
      },
    });
  };

  const animateNavClick = (element) => {
    if (!element) return;
    gsap.to(element, {
      scale: 0.92,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
    });
  };

  const animateLogoHover = (isHovering) => {
    if (!logoRef.current) return;
    gsap.to(logoRef.current, {
      scale: isHovering ? 1.12 : 1,
      rotation: isHovering ? 10 : 0,
      duration: 0.3,
      ease: "back.out(2)",
    });
  };

  const animateLinkHover = (element, isHovering) => {
    if (!element) return;
    gsap.to(element, {
      scale: isHovering ? 1.07 : 1,
      duration: 0.2,
      ease: "back.out(2)",
    });
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header ref={headerRef} className="header">
      <div className="header-inner">
        {/* Logo */}
        <div
          className="header-logo"
          onClick={() => navigate(user ? "/feed" : "/")}
          onMouseEnter={() => animateLogoHover(true)}
          onMouseLeave={() => animateLogoHover(false)}
        >
          <div ref={logoRef} className="header-logo-icon">
            <img src={logoGif} id="logo" alt="logo-dog-gif" />
          </div>

          <div ref={logoTextRef} className="header-logo-text">
            <span className="logo-word-1">Dogesh</span>
            <span className="logo-word-2">Book</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="header-nav">
          {user ? (
            <>
              <Link
                ref={feedLinkRef}
                to="/feed"
                className={`header-nav-link ${isActive("/feed") || isActive("/") ? "is-active" : ""}`}
                onClick={() => animateNavClick(feedLinkRef.current)}
                onMouseEnter={() => animateLinkHover(feedLinkRef.current, true)}
                onMouseLeave={() =>
                  animateLinkHover(feedLinkRef.current, false)
                }
              >
                <span className="nav-icon">🏠</span>
                <span className="nav-label">Feed</span>
                {(isActive("/feed") || isActive("/")) && (
                  <span className="nav-active-dot" />
                )}
              </Link>

              <Link
                ref={dogLinkRef}
                to="/dog"
                className={`header-nav-link ${isActive("/dog") ? "is-active" : ""}`}
                onClick={() => animateNavClick(dogLinkRef.current)}
                onMouseEnter={() => animateLinkHover(dogLinkRef.current, true)}
                onMouseLeave={() => animateLinkHover(dogLinkRef.current, false)}
              >
                <span className="nav-icon">🐶</span>
                <span className="nav-label">My Dog</span>
                {isActive("/dog") && <span className="nav-active-dot" />}
              </Link>

              <button
                ref={logoutBtnRef}
                onClick={() => {
                  animateNavClick(logoutBtnRef.current);
                  handleLogout();
                }}
                className="header-logout-btn"
                onMouseEnter={(e) =>
                  animateLinkHover(logoutBtnRef.current, true)
                }
                onMouseLeave={(e) =>
                  animateLinkHover(logoutBtnRef.current, false)
                }
              >
                <span>👋</span>
                Logout
              </button>
            </>
          ) : (
            <></>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
