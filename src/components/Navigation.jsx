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
  };

  return (
    <header className="nav-wrapper">
      <nav className="nav-container" aria-label="Main Navigation">
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

        {/* Links */}
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

        {/* Toolbar Controls */}
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
            className={`nav-tool-btn nav-tool-sound ${isMuted ? 'is-muted' : ''}`}
            onClick={toggleMute}
            title={isMuted ? 'Sound Muted (Click to unmute)' : 'Sound Active (Click to mute)'}
            aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
          >
            <span>{isMuted ? '🔇' : '🔊'}</span> {isMuted ? 'Muted' : 'Sound'}
          </button>

          <button
            type="button"
            className={`nav-tool-btn nav-tool-chaos ${isChaosMode ? 'is-active' : ''}`}
            onClick={toggleChaosMode}
            title={isChaosMode ? 'Chaos Mode ON (Click to calm down)' : 'Chaos Mode (Click to unleash playful dream chaos)'}
            aria-label="Toggle playful chaos mode"
            aria-pressed={isChaosMode}
          >
            <span>🎮</span> {isChaosMode ? 'Calm' : 'Chaos'}
          </button>

          <button
            type="button"
            className={`nav-tool-btn nav-tool-star ${sparklesActive ? 'is-active' : ''}`}
            onClick={openMiniGame}
            title="Star Catch Mini-Game ⭐"
            aria-label="Play Star Catch Mini-Game"
          >
            ⭐
          </button>
        </div>
      </nav>
    </header>
  );
}
