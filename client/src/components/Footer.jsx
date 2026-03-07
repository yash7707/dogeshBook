import { useState, useEffect } from "react";
import "../style/Footer.css";

const Footer = () => {
  const [bouncingPaw, setBouncingPaw] = useState(false);
  const [tailWag, setTailWag] = useState(false);
  const [funFactIndex, setFunFactIndex] = useState(0);
  const [factVisible, setFactVisible] = useState(true);

  const dogFacts = [
    "Dogs' noses are as unique as human fingerprints!",
    "A dog's sense of smell is 10,000 times stronger than ours!",
    "Puppies are born blind, deaf, and toothless!",
    "Dogs dream just like humans do!",
    "The Basenji is the only barkless dog!",
    "Dogs have three eyelids!",
    "A dog's whiskers help them 'see' in the dark!",
    "Yawning is contagious between dogs and humans!",
  ];

  // Cycle through fun facts with fade
  useEffect(() => {
    const interval = setInterval(() => {
      setFactVisible(false);
      setTimeout(() => {
        setFunFactIndex((prev) => (prev + 1) % dogFacts.length);
        setFactVisible(true);
        setTailWag(true);
        setTimeout(() => setTailWag(false), 1000);
      }, 400);
    }, 8000);

    return () => clearInterval(interval);
  }, [dogFacts.length]);

  // Random paw bounce
  useEffect(() => {
    const randomBounce = () => {
      if (Math.random() > 0.7) {
        setBouncingPaw(true);
        setTimeout(() => setBouncingPaw(false), 300);
      }
    };
    const interval = setInterval(randomBounce, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="footer">

     

      <div className="footer-body">

        {/* Fun fact pill */}
        <div className="fun-fact-pill">
          <span className={`tail-dog ${tailWag ? "wagging" : ""}`}>🐕</span>
          <p className={`fun-fact-text ${factVisible ? "visible" : "hidden"}`}>
            {dogFacts[funFactIndex]}
          </p>
        </div>

        {/* Paw trail — subtle, text based */}
        <div className="paw-trail">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`paw-dot ${bouncingPaw ? "bounce" : ""}`}
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>

        {/* Brand + tagline */}
        <div className="footer-brand">
          <span className="footer-logo-word1">Dogesh</span>
          <span className="footer-logo-word2">Book</span>
          <p className="footer-tagline">Where every dog has its day</p>
        </div>

        {/* Links */}
        <div className="footer-links">
          <button
            className="footer-link"
            onClick={() => {
              window.open("https://www.akc.org/dog-breeds/", "_blank");
              setBouncingPaw(true);
              setTimeout(() => setBouncingPaw(false), 300);
            }}
          >
            Breed Guide
          </button>
          <span className="footer-divider" />
          <button
            className="footer-link"
            onClick={() => {
              window.open("https://www.aspca.org/animal-homelessness", "_blank");
              setBouncingPaw(true);
              setTimeout(() => setBouncingPaw(false), 300);
            }}
          >
            Adopt Don't Shop
          </button>
        </div>

        {/* Copyright */}
        <div className="footer-copyright">
          © {new Date().getFullYear()} DogeshBook — Made with love for dog lovers everywhere
        </div>

        {/* Hidden joke */}
        <div className="hidden-joke hide">
          <small
            title="Click for a surprise!"
            onClick={() => {
              alert("Why don't dogs make good dancers?\n\nBecause they have two left feet! 🐾🕺");
              setBouncingPaw(true);
              setTimeout(() => setBouncingPaw(false), 500);
            }}
          >
            psst... click here for a dog joke!
          </small>
        </div>

      </div>
    </footer>
  );
};

export default Footer;