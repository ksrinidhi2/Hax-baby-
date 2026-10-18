import React from 'react';
import './FooterCredits.css';
import { useSite } from '../context/SiteContext';

export default function FooterCredits() {
  const { triggerTickleBow } = useSite();
  const digits = ['0', '0', '0', '0', '7'];

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
      {/* 1. Dreams you've delivered Odometer Counter */}
      <div className="credits-counter-block">
        <span className="counter-label">Dreams you've delivered</span>
        <div className="footer-odometer-box" role="status" aria-label="Dreams delivered: 00007">
          {digits.map((digit, idx) => (
            <div key={idx} className="footer-odometer-slot">
              <span className="footer-odometer-digit">{digit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Webring Navigation Line */}
      <nav className="webring-nav-line" aria-label="Midnight Nursery Webring">
        <span className="webring-arrow">←</span>
        <a
          href="#prev"
          className="webring-nav-link"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          prev
        </a>
        <span className="webring-bullet">·</span>
        <span className="webring-ring-name">Midnight Nursery Ring</span>
        <span className="webring-bullet">·</span>
        <a
          href="#next"
          className="webring-nav-link"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          next
        </a>
        <span className="webring-arrow">→</span>
      </nav>

      {/* 3. Back to Top Button */}
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

      {/* 4. Credits Paragraph */}
      <p className="credits-main-paragraph">
        <strong>Credits:</strong> Pip's character and canon by{' '}
        <a
          href="https://hax.baby"
          target="_blank"
          rel="noopener noreferrer"
          className="credits-author-link"
        >
          haX.baby
        </a>{' '}
        (Baby's First Website). All illustrations are SVG and CSS drawn in code (written with AI assistance from Claude). Fonts: Fraunces and Fredoka via Google Fonts (OFL). Every sound is synthesized live with the Web Audio API. Built by [YOUR NAME] during 17–19 Oct 2026.
      </p>

      {/* 5. Subtle Easter Egg Line */}
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
