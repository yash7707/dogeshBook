import { Link, useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import useAuth from "../context/useAuth";

import "../style/Header.css";

import logoGif from "../assets/logo-gif.gif";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Refs for GSAP animations
  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const feedLinkRef = useRef(null);
  const dogLinkRef = useRef(null);
  const logoutBtnRef = useRef(null);
  const loginLinkRef = useRef(null);
  const registerLinkRef = useRef(null);

  // GSAP animations on mount
  useEffect(() => {
    // Ensure refs are available
    if (!headerRef.current) return;

    // Store the animation context
    const ctx = gsap.context(() => {
      // Header slide in from top
      gsap.from(headerRef.current, {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      // Animate navigation items based on user state
      if (user) {
        // For logged in user
        const navItems = [
          feedLinkRef.current,
          dogLinkRef.current,
          logoutBtnRef.current,
        ].filter(Boolean);
        gsap.from(navItems, {
          x: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.4,
          ease: "power2.out",
        });
      } else {
        // For logged out user
        // const navItems = [loginLinkRef.current, registerLinkRef.current].filter(
        //   Boolean,
        // );
        // gsap.from(navItems, {
        //   x: 30,
        //   opacity: 0,
        //   duration: 0.6,
        //   stagger: 0.1,
        //   delay: 0.4,
        //   ease: "power2.out",
        // });
      }
    });

    // Cleanup
    return () => ctx.revert();
  }, [user]); // Re-run when user changes

  // Original handleLogout function (unchanged)
  const handleLogout = () => {
    // Add exit animation before logout
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

  // Animation for nav item clicks
  const animateNavClick = (element) => {
    if (!element) return;

    gsap.to(element, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
    });
  };

  // Animation for logo hover
  const animateLogoHover = (isHovering) => {
    if (!logoRef.current) return;

    gsap.to(logoRef.current, {
      scale: isHovering ? 1.05 : 1,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  // Animation for button/link hover
  const animateHover = (element, isHovering, colorType = "blue") => {
    if (!element) return;

    const colors = {
      blue: {
        bg: "var(--primary-blue)",
        bgHover: "var(--primary-blue-dark)",
        text: "white",
      },
      coral: {
        bg: "var(--secondary-coral)",
        bgHover: "var(--secondary-coral-dark)",
        text: "white",
      },
      outline: {
        bg: "transparent",
        bgHover: "var(--secondary-coral)",
        text: "var(--secondary-coral)",
        textHover: "white",
      },
    };

    const color = colors[colorType];

    gsap.to(element, {
      backgroundColor: isHovering ? color.bgHover : color.bg,
      color: isHovering ? color.textHover || color.text : color.text,
      scale: isHovering ? 1.05 : 1,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  // Animation for regular link hover
  const animateLinkHover = (element, isHovering, color = "blue") => {
    if (!element) return;

    const bgColors = {
      blue: "rgba(74, 111, 165, 0.1)",
      coral: "rgba(255, 138, 122, 0.1)",
    };

    gsap.to(element, {
      backgroundColor: isHovering ? bgColors[color] : "transparent",
      scale: isHovering ? 1.05 : 1,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  return (
    <header
      ref={headerRef}
      style={{
        padding: "16px 32px",
        backgroundColor: "var(--card-white, #FFFFFF)",
        borderBottom: "1px solid var(--border-light, #E2E8F0)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div
        ref={logoRef}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
        }}
        onClick={() => {
          gsap.to(logoRef.current, {
            scale: 1.1,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: "power2.out",
          });
          navigate(user ? "/feed" : "/");
        }}
        onMouseEnter={() => animateLogoHover(true)}
        onMouseLeave={() => animateLogoHover(false)}
      >
        {/* Custom Dog Icon */}
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <img src={logoGif} id="logo" alt="logo-dog-gif" />
        </div>

        <h3
          style={{
            color: "var(--primary-blue, #4A6FA5)",
            margin: 0,
            fontSize: "1.5rem",
            fontWeight: 700,
          }}
        >
          DogeshBook
        </h3>
      </div>

      <nav style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        {user ? (
          <>
            <Link
              ref={feedLinkRef}
              to="/feed"
              style={{
                marginRight: "10px",
                color: "var(--text-dark, #2D3748)",
                textDecoration: "none",
                fontWeight: 600,
                padding: "8px 16px",
                borderRadius: "12px",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
              }}
              onClick={(e) => animateNavClick(e.target)}
              onMouseEnter={(e) => animateLinkHover(e.target, true, "blue")}
              onMouseLeave={(e) => animateLinkHover(e.target, false, "blue")}
            >
              Feed
            </Link>

            <Link
              ref={dogLinkRef}
              to="/dog"
              style={{
                marginRight: "10px",
                color: "var(--text-dark, #2D3748)",
                textDecoration: "none",
                fontWeight: 600,
                padding: "8px 16px",
                borderRadius: "12px",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
              }}
              onClick={(e) => animateNavClick(e.target)}
              onMouseEnter={(e) => animateLinkHover(e.target, true, "coral")}
              onMouseLeave={(e) => animateLinkHover(e.target, false, "coral")}
            >
              My Dog
            </Link>

            <button
              ref={logoutBtnRef}
              onClick={() => {
                animateNavClick(logoutBtnRef.current);
                handleLogout();
              }}
              style={{
                padding: "8px 16px",
                backgroundColor: "transparent",
                border: "2px solid var(--secondary-coral, #FF8A7A)",
                borderRadius: "12px",
                color: "var(--secondary-coral, #FF8A7A)",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "14px",
              }}
              onMouseEnter={() =>
                animateHover(logoutBtnRef.current, true, "outline")
              }
              onMouseLeave={() =>
                animateHover(logoutBtnRef.current, false, "outline")
              }
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* <Link
              ref={loginLinkRef}
              to="/login"
              style={{
                marginRight: "10px",
                backgroundColor: "var(--primary-blue, #4A6FA5)",
                color: "white",
                textDecoration: "none",
                fontWeight: 600,
                padding: "8px 16px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
              }}
              onClick={(e) => animateNavClick(e.target)}
              onMouseEnter={(e) => animateHover(e.target, true, "blue")}
              onMouseLeave={(e) => animateHover(e.target, false, "blue")}
            >
              Login
            </Link>

            <Link
              ref={registerLinkRef}
              to="/register"
              style={{
                backgroundColor: "var(--secondary-coral, #FF8A7A)",
                color: "white",
                textDecoration: "none",
                fontWeight: 600,
                padding: "8px 16px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
              }}
              onClick={(e) => animateNavClick(e.target)}
              onMouseEnter={(e) => animateHover(e.target, true, "coral")}
              onMouseLeave={(e) => animateHover(e.target, false, "coral")}
            >
              Register
            </Link> */}
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
