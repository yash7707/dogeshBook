// animations.js
import gsap from "gsap";

// Initialize GSAP with default settings
gsap.defaults({
  ease: "power2.out",
  duration: 0.3,
});

// Page transition animations
export const pageTransition = {
  enter: (node) => {
    gsap.from(node, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: "power2.out",
    });
  },
  exit: (node) => {
    gsap.to(node, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: "power2.in",
    });
  },
};

// Button animations
export const buttonAnimations = {
  tap: (element) => {
    gsap.to(element, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });
  },
  hover: (element) => {
    gsap.to(element, {
      scale: 1.05,
      duration: 0.2,
    });
  },
  leave: (element) => {
    gsap.to(element, {
      scale: 1,
      duration: 0.2,
    });
  },
};

// Card animations
export const cardAnimations = {
  appear: (element) => {
    gsap.from(element, {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.6,
    });
  },
  hover: (element) => {
    gsap.to(element, {
      y: -5,
      boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
      duration: 0.3,
    });
  },
  leave: (element) => {
    gsap.to(element, {
      y: 0,
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      duration: 0.3,
    });
  },
};

// Dog-themed animations
export const dogAnimations = {
  tailWag: (element) => {
    gsap.to(element, {
      rotate: 15,
      duration: 0.2,
      yoyo: true,
      repeat: 3,
      ease: "power1.inOut",
    });
  },
  pawTap: (element) => {
    gsap.to(element, {
      scale: 0.8,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });
  },
  bounce: (element) => {
    gsap.to(element, {
      y: -10,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
    });
  },
};

// Loading animation
export const loadingAnimation = (element) => {
  gsap.to(element, {
    rotation: 360,
    duration: 1,
    repeat: -1,
    ease: "linear",
  });
};
