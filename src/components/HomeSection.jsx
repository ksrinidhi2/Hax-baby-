import React, { useState, useEffect, useRef } from 'react';
import './HomeSection.css';
import pipHeroObservatory from '../../assets/pip_hero_observatory.png';
import { useSite } from '../context/SiteContext';

export default function HomeSection() {
  const {
    isReturningVisitor,
    showGreeting,
    setShowGreeting,
    bowTickled,
    triggerTickleBow,
    playSoundEffect
  } = useSite();

  const [tilt, setTilt] = useState({ x: 0, y: 0, shiftX: 0, shiftY: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);

    const handleMotion = (e) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handleMotion);

    return () => mql.removeEventListener('change', handleMotion);
  }, []);

  const handleMouseMove = (e) => {
    if (prefersReducedMotion || !heroRef.current) return;
    if (e.pointerType === 'touch') return;

    const rect = heroRef.current.getBoundingClientRect();
    const pipCenterX = rect.left + rect.width * 0.72;
    const pipCenterY = rect.top + rect.height * 0.48;

    const deltaX = (e.clientX - pipCenterX) / (rect.width * 0.5);
    const deltaY = (e.clientY - pipCenterY) / (rect.height * 0.5);

    const clampedX = Math.max(-1, Math.min(1, deltaX));
    const clampedY = Math.max(-1, Math.min(1, deltaY));

    setTilt({
      x: clampedX * 2.2,
      y: -clampedY * 2.2,
      shiftX: clampedX * 3.5,
      shiftY: clampedY * 3.0
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, shiftX: 0, shiftY: 0 });
  };

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWorkshopClick = () => {
    if (playSoundEffect) playSoundEffect('star');
    scrollTo('projects');
  };

  const handleStoryClick = () => {
    if (playSoundEffect) playSoundEffect('click');
    scrollTo('story');
  };

  const handleScrollClick = () => {
    if (playSoundEffect) playSoundEffect('click');
    scrollTo('about');
  };

  const handleBtnHover = () => {
    if (playSoundEffect) playSoundEffect('click');
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="hero-section"
      aria-label="Home"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Decorative Atmosphere Elements (Twinkling celestial sparkles) */}
      <div className="hero-atmosphere" aria-hidden="true">
        <span className="hero-star star-1">✦</span>
        <span className="hero-star star-2">⭐</span>
        <span className="hero-star star-3">✧</span>
        <span className="hero-star star-4">⋆</span>
      </div>

      {/* Floating Returning Visitor Greeting Pill */}
      {showGreeting && (
        <div className="hero-visitor-pill" role="status" aria-live="polite">
          <span className="visitor-pill-icon">⭐</span>
          <span className="visitor-pill-msg">
            {isReturningVisitor
              ? 'Welcome back to the dream, little star! Pip missed you! ✨'
              : "Welcome to Pip's Little Dream Desktop! Let's explore together! ☁️"}
          </span>
          <button
            type="button"
            className="visitor-pill-dismiss"
            onClick={() => setShowGreeting(false)}
            aria-label="Dismiss greeting"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Hero Container - Responsive 2-Column Real Content Layout */}
      <div className="hero-main-container">
        {/* Left Column: Heading, Tagline, and Action Buttons (Real HTML Elements) */}
        <div className="hero-content-col">
          {/* Welcome Badge Line */}
          <div className="hero-welcome-badge">
            <span className="welcome-text">Welcome to</span>
            <span className="welcome-moon-icon" aria-hidden="true">🌙</span>
            <span className="welcome-star-icon" aria-hidden="true">⭐</span>
          </div>

          {/* Main Title */}
          <h1 className="hero-main-title">
            Pip's Little <span className="hero-title-star" aria-hidden="true">⭐</span><br />
            Dream Desktop <span className="hero-title-sparkle" aria-hidden="true">✧</span>
          </h1>

          {/* Subtitle / Tagline */}
          <p className="hero-tagline">
            I build the dreams you fall asleep inside. <span className="tagline-star" aria-hidden="true">✨</span>
          </p>

          {/* Real Action Buttons */}
          <div className="hero-cta-buttons">
            <button
              type="button"
              onClick={handleWorkshopClick}
              onMouseEnter={handleBtnHover}
              className="btn hero-btn-workshop"
              aria-label="Explore the Workshop"
            >
              <span className="btn-star-emoji" aria-hidden="true">⭐</span>
              <span>Explore the Workshop →</span>
            </button>

            <button
              type="button"
              onClick={handleStoryClick}
              onMouseEnter={handleBtnHover}
              className="btn hero-btn-story"
              aria-label="Read Pip's Story"
            >
              <span className="btn-book-emoji" aria-hidden="true">📖</span>
              <span>Read Pip's Story</span>
            </button>
          </div>
        </div>

        {/* Right Column: Pip & Observatory Castle Artwork (Separate Illustration Element) */}
        <div className="hero-artwork-col">
          <div
            className={`hero-illustration-wrapper ${bowTickled ? 'bow-wiggle' : ''}`}
            style={{
              transform: prefersReducedMotion
                ? 'none'
                : `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) translate3d(${tilt.shiftX}px, ${tilt.shiftY}px, 0)`
            }}
          >
            {/* Separate Speech Bubble Sticker */}
            <div className="pip-speech-bubble-sticker" role="note" aria-label="Pip says: Hi! I'm Pip! Let's explore my world!">
              <p className="bubble-text-title">Hi! I'm Pip!</p>
              <p className="bubble-text-sub">
                Let's explore my world! <span className="bubble-star" aria-hidden="true">⭐</span>
              </p>
            </div>

            <img
              src={pipHeroObservatory}
              alt="Pip on a cloud holding a shining star beside the Midnight Nursery Observatory"
              className="hero-illustration-img"
            />

            {/* Interactive Ticklish Bow Hotspot Target */}
            <button
              type="button"
              className={`hero-bow-target ${bowTickled ? 'is-tickled' : ''}`}
              onClick={triggerTickleBow}
              aria-label="Pip's ticklish nightcap bow"
              title="psst... Pip's bow is ticklish! (Click to tickle ✨)"
            />

            {/* Floating Tickle Bubble */}
            {bowTickled && (
              <div className="pip-hero-tickle-bubble" role="status" aria-live="polite">
                <span>Teehee! Pip's bow is ticklish! ✨</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Scroll Indicator - Real HTML Element */}
      <div
        className="hero-scroll-indicator"
        onClick={handleScrollClick}
        onMouseEnter={handleBtnHover}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleScrollClick();
          }
        }}
        aria-label="Scroll down to begin our journey"
        title="Scroll to About Pip"
      >
        <span className="scroll-star scroll-star-left" aria-hidden="true">⭐</span>
        <div className="scroll-text-group">
          <span className="scroll-label">Scroll down to begin our journey!</span>
          <div className="scroll-mouse-symbol" aria-hidden="true">
            <span className="mouse-arrow">↓</span>
          </div>
        </div>
        <span className="scroll-star scroll-star-right" aria-hidden="true">⭐</span>
      </div>
    </section>
  );
}
