import React, { useState, useEffect, useRef } from 'react';
import './HomeSection.css';
import heroSceneArtwork from '../../assets/pip_home_hero_scene.png';
import { useSite } from '../context/SiteContext';

export default function HomeSection() {
  const {
    isReturningVisitor,
    showGreeting,
    setShowGreeting,
    bowTickled,
    triggerTickleBow
  } = useSite();

  const [tilt, setTilt] = useState({ x: 0, y: 0, shiftX: 0, shiftY: 0 });
  const [isTouch, setIsTouch] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const stageRef = useRef(null);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);

    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);

    const handleMotion = (e) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handleMotion);

    return () => mql.removeEventListener('change', handleMotion);
  }, []);

  const handleMouseMove = (e) => {
    if (prefersReducedMotion || isTouch || !stageRef.current) return;

    const rect = stageRef.current.getBoundingClientRect();
    // Pip is located at ~74% horizontal and ~46% vertical of the stage
    const pipCenterX = rect.left + rect.width * 0.74;
    const pipCenterY = rect.top + rect.height * 0.46;

    const deltaX = (e.clientX - pipCenterX) / (rect.width * 0.45);
    const deltaY = (e.clientY - pipCenterY) / (rect.height * 0.45);

    // Clamp strictly to [-1, 1]
    const clampedX = Math.max(-1, Math.min(1, deltaX));
    const clampedY = Math.max(-1, Math.min(1, deltaY));

    // Subtle, gentle tilt and shift (max 2 degrees, 3px translate)
    setTilt({
      x: clampedX * 2.0,
      y: -clampedY * 2.0,
      shiftX: clampedX * 3.0,
      shiftY: clampedY * 2.5
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

  return (
    <section id="home" className="hero-section" aria-label="Home">
      {/* Semantic Text for Screen Readers & SEO */}
      <div className="sr-only">
        <h1>Pip's Little Dream Desktop</h1>
        <p>Welcome to Pip's Little Dream Desktop. I build the dreams you fall asleep inside.</p>
        <p>Hi! I'm Pip! Let's explore my world!</p>
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

      {/* Main Hero Stage - Scaled to fit exactly within 100svh */}
      <div className="hero-stage-wrapper">
        <div
          ref={stageRef}
          className="hero-stage"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            aspectRatio: '1774 / 783',
            width: 'min(100%, calc((100svh - 16px) * (1774 / 783)))',
            maxHeight: 'calc(100svh - 16px)',
            position: 'relative'
          }}
        >
          {/* Complete, Unified Target Scene Artwork with subtle gaze tilt */}
          <div
            className={`hero-artwork-tilt-box ${bowTickled ? 'bow-wiggle' : ''}`}
            style={{
              transform: prefersReducedMotion
                ? 'none'
                : `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) translate(${tilt.shiftX}px, ${tilt.shiftY}px)`
            }}
          >
            <img
              src={heroSceneArtwork}
              alt="Pip's Little Dream Desktop - Pip on a cloud holding a glowing star beside the Midnight Nursery observatory"
              className="hero-scene-artwork"
            />
          </div>

          {/* Interactive Button & Scroll Targets Positioned Over The Scene */}
          <button
            type="button"
            className="hero-hotspot hero-hotspot-pink"
            onClick={() => scrollTo('projects')}
            aria-label="Explore the Workshop"
            title="Explore the Workshop →"
          />

          <button
            type="button"
            className="hero-hotspot hero-hotspot-white"
            onClick={() => scrollTo('story')}
            aria-label="Read Pip's Story"
            title="Read Pip's Story"
          />

          <button
            type="button"
            className="hero-hotspot hero-hotspot-scroll"
            onClick={() => scrollTo('about')}
            aria-label="Scroll down to begin our journey"
            title="Scroll to About Pip"
          />

          {/* Pip's Ticklish Bow Easter Egg Hotspot */}
          <button
            type="button"
            className={`hero-hotspot hero-hotspot-bow ${bowTickled ? 'is-tickled' : ''}`}
            onClick={triggerTickleBow}
            aria-label="Pip's ticklish nightcap bow"
            title="psst... Pip's bow is ticklish! (Click to tickle ✨)"
          />

          {/* Floating Tickle Bubble */}
          {bowTickled && (
            <div className="pip-tickle-bubble" role="status" aria-live="polite">
              <span>Teehee! Pip's bow is ticklish! ✨</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
