import React from 'react';
import './FooterCredits.css';
import { useSite } from '../context/SiteContext';

export default function FooterCredits() {
  const { triggerTickleBow } = useSite();

  const scrollToTop = () => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: isReduced ? 'auto' : 'smooth'
    });
  };

  const handleWhisperClick = () => {
    triggerTickleBow();
    const homeEl = document.getElementById('home');
    if (homeEl) {
      homeEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="site-credits-footer" aria-label="Website Credits">
      {/* 1. Back to Top Button */}
      <div className="footer-back-to-top-container">
        <button
          type="button"
          onClick={scrollToTop}
          className="footer-back-to-top-btn"
          aria-label="Scroll back to the top of the page"
          title="Return to the beginning of the dream"
        >
          <span className="back-top-arrow">↑</span> Back to top <span className="back-top-star">⭐</span>
        </button>
      </div>

      {/* 2. Unified GenGeez Credits Section */}
      <div className="gengeez-credits-card">
        <div className="gengeez-credits-header">
          <span className="credits-deco-symbol" aria-hidden="true">⭐</span>
          <h3 className="gengeez-credits-heading">A Little Dream, Made With Love</h3>
          <span className="credits-deco-symbol" aria-hidden="true">✨</span>
        </div>

        <div className="gengeez-credits-body">
          <p className="gengeez-project-title">Pip's Little Dream Desktop</p>
          <p className="gengeez-team-credit">
            Created with love by <strong>GenGeez</strong>
          </p>
          <p className="gengeez-character-credit">A little dream world for Pip</p>
          <p className="gengeez-closing-line">
            Thanks for visiting our little corner of the sky! ☁️✨
          </p>
        </div>
      </div>

      {/* 3. Subtle Easter Egg Line */}
      <button
        type="button"
        onClick={handleWhisperClick}
        className="credits-whisper-btn"
        title="Click to visit Pip and tickle the bow! ✨"
        aria-label="Pip's bow is ticklish. Click to jump to Pip and tickle his bow"
      >
        psst... Pip's bow is ticklish ✨
      </button>
    </footer>
  );
}
