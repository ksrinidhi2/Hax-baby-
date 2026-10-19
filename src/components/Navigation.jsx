import React, { useState, useEffect } from 'react';
import './Navigation.css';
import pipAvatar from '../../assets/pip_portrait.png';
import { useSite } from '../context/SiteContext';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'about', label: 'About', icon: '👶' },
  { id: 'projects', label: 'Projects', icon: '📁' },
  { id: 'story', label: 'Story', icon: '📖' },
  { id: 'guestbook', label: 'Guestbook', icon: '✉️' }
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    theme,
    toggleTheme,
    isMuted,
    toggleMute,
    isChaosMode,
    toggleChaosMode,
    sparklesActive,
    openMiniGame
  } = useSite();

  // Close mobile menu when clicking outside or pressing Escape
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    const handlePointerDown = (e) => {
      const navEl = document.querySelector('.nav-container');
      if (navEl && !navEl.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;

      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const section = document.getElementById(NAV_ITEMS[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(NAV_ITEMS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Scroll to initial hash if present
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1);
      setTimeout(() => {
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'instant' });
          setActiveSection(targetId);
        }
      }, 150);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
    setIsMobileMenuOpen(false);
  };

  const handleMiniGameClick = () => {
    openMiniGame();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="nav-wrapper">
      <nav className={`nav-container ${isMobileMenuOpen ? 'is-menu-open' : ''}`} aria-label="Main Navigation">
        {/* Brand */}
        <a
          href="#home"
          className="nav-brand"
          onClick={(e) => handleNavClick(e, 'home')}
        >
          <div className="nav-brand-avatar">
            <img src={pipAvatar} alt="Pip" />
          </div>
          <div className="nav-brand-text">
            <span className="nav-brand-title">Pip's Little Dream Desktop</span>
            <span className="nav-brand-subtitle">Midnight Nursery ⭐</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <ul className="nav-links">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id} className="nav-link-item">
                <a
                  href={`#${item.id}`}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="nav-link-icon">{item.icon}</span>
                  <span className="nav-link-label">{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        {/* Desktop Toolbar Controls */}
        <div className="nav-actions">
          <button
            type="button"
            className={`theme-pill-toggle ${theme === 'night' ? 'is-night' : 'is-day'}`}
            onClick={toggleTheme}
            title={`Current mode: ${theme === 'day' ? 'Day' : 'Night'}. Click to switch to ${theme === 'day' ? 'Night' : 'Day'} mode`}
            aria-label={`Current mode: ${theme}. Click to switch to ${theme === 'day' ? 'night' : 'day'} mode`}
          >
            <span className="theme-indicator">
              {theme === 'day' ? '☀️' : '🌙'}
            </span>
            <span className="theme-mode-text">{theme === 'day' ? 'Day' : 'Night'}</span>
          </button>

          <button
            type="button"
            className={`nav-tool-btn nav-tool-sound ${isMuted ? 'is-muted' : 'is-sound-on'}`}
            onClick={toggleMute}
            title={isMuted ? 'Sound is Muted (Click to unmute)' : 'Sound is ON (Click to mute)'}
            aria-label={isMuted ? 'Sound Muted. Click to turn sound on' : 'Sound ON. Click to mute sound'}
            aria-pressed={!isMuted}
          >
            <span className="sound-btn-icon" aria-hidden="true">{isMuted ? '🔇' : '🔊'}</span>
            <span className="sound-btn-label">{isMuted ? 'Muted' : 'Sound ON'}</span>
          </button>

          <button
            type="button"
            className={`nav-tool-btn nav-tool-chaos ${isChaosMode ? 'is-active' : ''}`}
            onClick={toggleChaosMode}
            title={isChaosMode ? 'Chaos Mode is ON (Click to turn OFF)' : 'Chaos Mode is OFF (Click to turn ON)'}
            aria-label={`Chaos Mode is currently ${isChaosMode ? 'ON' : 'OFF'}. Click to toggle.`}
            aria-pressed={isChaosMode}
          >
            <span className="chaos-btn-icon" aria-hidden="true">{isChaosMode ? '✨' : '🎮'}</span>
            <span className="chaos-btn-label">{isChaosMode ? 'Chaos: ON' : 'Chaos: OFF'}</span>
          </button>

          <button
            type="button"
            className="nav-tool-btn nav-tool-star"
            onClick={openMiniGame}
            title="Catch the Falling Stars Mini-Game ⭐"
            aria-label="Play Catch the Falling Stars Mini-Game"
          >
            ⭐
          </button>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          className={`nav-mobile-toggle ${isMobileMenuOpen ? 'is-active' : ''}`}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav-panel"
        >
          <span className="mobile-toggle-bars" aria-hidden="true">
            <span className="toggle-bar bar-top" />
            <span className="toggle-bar bar-mid" />
            <span className="toggle-bar bar-bot" />
          </span>
          <span className="mobile-toggle-star" aria-hidden="true">⭐</span>
        </button>

        {/* Mobile Dropdown Menu Panel */}
        {isMobileMenuOpen && (
          <div
            id="mobile-nav-panel"
            className="mobile-nav-dropdown"
            role="dialog"
            aria-label="Mobile Navigation Menu"
          >
            <div className="mobile-dropdown-header">
              <span className="mobile-header-icon" aria-hidden="true">☁️</span>
              <span className="mobile-header-title">Menu (pip_nav.exe)</span>
              <button
                type="button"
                className="mobile-close-btn"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            {/* Navigation Section Links */}
            <div className="mobile-links-section">
              <span className="mobile-section-label">Sections</span>
              <ul className="mobile-links-list">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <li key={item.id} className="mobile-link-item">
                      <a
                        href={`#${item.id}`}
                        className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                        onClick={(e) => handleNavClick(e, item.id)}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <span className="mobile-link-icon">{item.icon}</span>
                        <span className="mobile-link-text">{item.label}</span>
                        {isActive && <span className="mobile-active-dot" aria-hidden="true">●</span>}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Controls & Mini-Game Section */}
            <div className="mobile-controls-section">
              <span className="mobile-section-label">Dream Controls</span>
              <div className="mobile-controls-grid">
                {/* Theme Mode Toggle */}
                <button
                  type="button"
                  className={`mobile-control-btn theme-pill-toggle ${theme === 'night' ? 'is-night' : 'is-day'}`}
                  onClick={toggleTheme}
                  aria-label={`Current mode: ${theme}. Click to switch to ${theme === 'day' ? 'night' : 'day'} mode`}
                >
                  <span className="theme-indicator">
                    {theme === 'day' ? '☀️' : '🌙'}
                  </span>
                  <span className="mobile-control-label">{theme === 'day' ? 'Day Mode' : 'Night Mode'}</span>
                </button>

                {/* Sound & Mute Toggle */}
                <button
                  type="button"
                  className={`mobile-control-btn nav-tool-btn nav-tool-sound ${isMuted ? 'is-muted' : 'is-sound-on'}`}
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Sound Muted. Click to turn sound on' : 'Sound ON. Click to mute sound'}
                  aria-pressed={!isMuted}
                >
                  <span className="sound-btn-icon" aria-hidden="true">{isMuted ? '🔇' : '🔊'}</span>
                  <span className="mobile-control-label">{isMuted ? 'Muted' : 'Sound ON'}</span>
                </button>

                {/* Chaos Mode Toggle */}
                <button
                  type="button"
                  className={`mobile-control-btn nav-tool-btn nav-tool-chaos ${isChaosMode ? 'is-active' : ''}`}
                  onClick={toggleChaosMode}
                  aria-label={`Chaos Mode is currently ${isChaosMode ? 'ON' : 'OFF'}. Click to toggle.`}
                  aria-pressed={isChaosMode}
                >
                  <span className="chaos-btn-icon" aria-hidden="true">{isChaosMode ? '✨' : '🎮'}</span>
                  <span className="mobile-control-label">{isChaosMode ? 'Chaos: ON' : 'Chaos: OFF'}</span>
                </button>

                {/* Star Catch Mini-Game Button */}
                <button
                  type="button"
                  className="mobile-control-btn nav-tool-btn nav-tool-star mobile-game-btn"
                  onClick={handleMiniGameClick}
                  aria-label="Play Catch the Falling Stars Mini-Game"
                >
                  <span className="mobile-star-icon" aria-hidden="true">⭐</span>
                  <span className="mobile-control-label">Star Game</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
