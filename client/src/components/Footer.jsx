import { useState, useEffect } from "react";
import "../style/Footer.css";

const Footer = () => {
  const [bouncingPaw, setBouncingPaw] = useState(false);
  const [tailWag, setTailWag] = useState(false);
  const [funFactIndex, setFunFactIndex] = useState(0);

  // Dog fun facts
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

  // Cycle through fun facts
  useEffect(() => {
    const interval = setInterval(() => {
      setFunFactIndex((prev) => (prev + 1) % dogFacts.length);
      setTailWag(true);
      setTimeout(() => setTailWag(false), 1000);
    }, 8000); // Change fact every 8 seconds

    return () => clearInterval(interval);
  }, [dogFacts.length]);

  // Trigger paw bounce randomly
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
      {/* Fun fact section */}
      <div className="fun-fact-section">
        <div className={`tail ${tailWag ? "wagging" : ""}`}>🐕</div>
        <p className="fun-fact">
          <span className="fact-icon">💡</span>
          {dogFacts[funFactIndex]}
        </p>
      </div>

      {/* Animated paws */}
      <div className="paw-trail">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`paw ${bouncingPaw ? "bounce" : ""}`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            🐾
          </span>
        ))}
      </div>

      {/* Main content */}
      <div className="footer-content">
        <div className="footer-message">
          <span className="heart-beat">💖</span>
          <span> Made with </span>
          <span className="treat-icon" title="Treats!">
            🍖
          </span>
          <span> for dog lovers everywhere </span>
          <span className="heart-beat">💖</span>
        </div>

        <div className="footer-links hide">
          <button
            className="footer-link"
            onClick={() => {
              window.open("https://www.akc.org/dog-breeds/", "_blank");
              setBouncingPaw(true);
              setTimeout(() => setBouncingPaw(false), 300);
            }}
          >
            🐶 Breed Guide
          </button>
          <span className="divider">•</span>
          <button
            className="footer-link"
            onClick={() => {
              window.open(
                "https://www.aspca.org/animal-homelessness",
                "_blank",
              );
              setBouncingPaw(true);
              setTimeout(() => setBouncingPaw(false), 300);
            }}
          >
            🏡 Adopt Don't Shop
          </button>
          <span className="divider">•</span>
          <button
            className="footer-link"
            onClick={() => {
              window.open("mailto:woof@dogeshbook.com");
              setBouncingPaw(true);
              setTimeout(() => setBouncingPaw(false), 300);
            }}
          >
            📧 Woof at Us
          </button>
        </div>

        {/* Copyright */}
        <div className="copyright">
          <span>
            {" "}
            © {new Date().getFullYear()} DogeshBook - Where every dog has its
            day!{" "}
          </span>
        </div>

        {/* Tiny hidden joke */}
        <div className="hidden-joke hide">
          <small
            title="Click for a surprise!"
            onClick={() => {
              alert(
                "Why don't dogs make good dancers?\n\nBecause they have two left feet! 🐾🕺",
              );
              setBouncingPaw(true);
              setTimeout(() => setBouncingPaw(false), 500);
            }}
          >
            psst... click here for a dog joke! 🤫
          </small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
