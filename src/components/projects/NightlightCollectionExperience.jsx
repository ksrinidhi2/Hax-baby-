import React, { useState } from 'react';
import './NightlightCollectionExperience.css';
import starJarImg from '../../../assets/project_nightlight_collection.png';
import lanternImg from '../../../assets/pip_dream_lantern.png';
import cloudFriendImg from '../../../assets/pip_avatar_cloud.png';

import { useSite } from '../../context/SiteContext';

const NIGHTLIGHT_DESIGNS = [
  {
    id: 'star-jar',
    title: 'Star Lantern Jar',
    tagline: 'Pip’s Handcrafted Star Jar',
    description: 'A frosted celestial glass jar capturing a real fallen star from the Midnight Observatory. It casts soft constellation patterns across the bedroom ceiling.',
    image: starJarImg,
    glowColor: '#f59e0b',
    auraGlow: 'rgba(245, 158, 11, 0.45)',
    icon: '⭐',
    mood: 'Warm Golden Starlight'
  },
  {
    id: 'pip-lantern',
    title: 'Observatory Brass Lantern',
    tagline: 'The Celestial Beacon',
    description: 'A vintage brass lantern with stained glass facets. Fitted with a magical everlasting stardust candle that flickers with peaceful warmth.',
    image: lanternImg,
    glowColor: '#fbbf24',
    auraGlow: 'rgba(251, 191, 36, 0.45)',
    icon: '🏮',
    mood: 'Cozy Candlelight'
  },
  {
    id: 'cloud-friend',
    title: 'Sleepy Cloud Nightlight',
    tagline: 'The Floating Cloud Spirit',
    description: 'A puffy, squishy cloud companion with rosy cheeks. It breathes a slow, calming lavender glow to help little friends synchronize their breathing for sleep.',
    image: cloudFriendImg,
    glowColor: '#c084fc',
    auraGlow: 'rgba(192, 132, 252, 0.45)',
    icon: '☁️',
    mood: 'Lavender Dream Mist'
  },
  {
    id: 'crescent-moon',
    title: 'Crescent Moon Cradle',
    tagline: 'Soft Moonbeam Glow',
    description: 'A polished mother-of-pearl crescent moon resting on a cushion of cloud foam. It radiates a cool, serene glow that soothes nighttime worries.',
    image: null, // Custom SVG renderer in preview
    glowColor: '#38bdf8',
    auraGlow: 'rgba(56, 189, 248, 0.45)',
    icon: '🌙',
    mood: 'Moonlight Serenade'
  },
  {
    id: 'mushroom-glow',
    title: 'Stardust Mushroom Lamp',
    tagline: 'Enchanted Forest Toadstool',
    description: 'A whimsical pastel toadstool gathered from the edges of the Sleepy Forest. Its glowing spots twinkle like quiet fireflies.',
    image: null, // Custom SVG renderer in preview
    glowColor: '#f472b6',
    auraGlow: 'rgba(244, 114, 182, 0.45)',
    icon: '🍄',
    mood: 'Cotton-Candy Rose'
  }
];

const GLOW_TONES = [
  { id: 'gold', name: 'Starlight Gold', color: '#f59e0b', aura: 'rgba(245, 158, 11, 0.5)' },
  { id: 'rose', name: 'Cotton Rose', color: '#ec4899', aura: 'rgba(236, 72, 153, 0.5)' },
  { id: 'lavender', name: 'Moon Lavender', color: '#a855f7', aura: 'rgba(168, 85, 247, 0.5)' },
  { id: 'cyan', name: 'Aurora Cyan', color: '#06b6d4', aura: 'rgba(6, 182, 212, 0.5)' }
];

export default function NightlightCollectionExperience({ onBack }) {
  const { isMuted } = useSite();
  const [selectedDesignId, setSelectedDesignId] = useState('star-jar');
  const [isPoweredOn, setIsPoweredOn] = useState(true);
  const [glowIntensity, setGlowIntensity] = useState(75);
  const [customToneId, setCustomToneId] = useState(null);

  const currentDesign = NIGHTLIGHT_DESIGNS.find((d) => d.id === selectedDesignId) || NIGHTLIGHT_DESIGNS[0];
  const activeTone = customToneId
    ? GLOW_TONES.find((t) => t.id === customToneId)
    : { color: currentDesign.glowColor, aura: currentDesign.auraGlow };

  // Play gentle soft chime on switch or toggle
  const playClickSound = (high = false) => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(high ? 880 : 587, ctx.currentTime);
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // Ignore
    }
  };

  // Toggle Power
  const handleTogglePower = () => {
    playClickSound(!isPoweredOn);
    setIsPoweredOn((prev) => !prev);
  };

  // Change Design
  const handleSelectDesign = (id) => {
    playClickSound(true);
    setSelectedDesignId(id);
    setCustomToneId(null);
  };

  // Reset to default
  const handleReset = () => {
    playClickSound(false);
    setSelectedDesignId('star-jar');
    setIsPoweredOn(true);
    setGlowIntensity(75);
    setCustomToneId(null);
  };

  return (
    <div className="project-experience-container nightlight-experience" aria-label="Nightlight Collection Experience">
      {/* Top Experience Navigation Bar */}
      <div className="experience-top-bar">
        <button
          type="button"
          onClick={onBack}
          className="btn experience-back-btn"
          aria-label="Back to Projects Gallery"
        >
          <span className="back-arrow">←</span> Back to Projects
        </button>

        <div className="experience-badge nightlight-badge">
          <span className="badge-icon">💡</span> Project 02 · Full Experience
        </div>
      </div>

      {/* Main Experience Window */}
      <div className="nightlight-window">
        {/* Header Hero */}
        <div className="nightlight-header">
          <div className="nightlight-header-text">
            <div className="nightlight-title-row">
              <span className="nightlight-icon" aria-hidden="true">💡</span>
              <h1 className="nightlight-title">Nightlight Collection</h1>
              <span className="nightlight-star" aria-hidden="true">⭐</span>
            </div>
            <p className="nightlight-subtitle">
              Pip designs bedside nightlights to illuminate the dark with soft, comforting pastel auras.
              Switch designs, adjust glow intensities, and light up the cozy midnight nursery.
            </p>
          </div>

          <div className="nightlight-header-actions">
            <button
              type="button"
              onClick={handleReset}
              className="btn nightlight-reset-btn"
              title="Reset all settings to default"
            >
              <span>🔄</span> Reset Lamp
            </button>
          </div>
        </div>

        {/* Interactive Nightlight Stage Grid */}
        <div className="nightlight-stage-grid">
          {/* Left / Center: Large Interactive Lamp Chamber */}
          <div
            className={`lamp-chamber-stage ${isPoweredOn ? 'is-lit' : 'is-dark'}`}
            style={{
              '--glow-color': activeTone.color,
              '--glow-aura': activeTone.aura,
              '--glow-scale': `${(glowIntensity / 100).toFixed(2)}`,
              '--glow-opacity': isPoweredOn ? `${(glowIntensity / 100).toFixed(2)}` : '0'
            }}
          >
            {/* Ambient Background Aura Effect */}
            <div className="chamber-ambient-aura" aria-hidden="true" />

            {/* Floating Sparkle Particles */}
            {isPoweredOn && (
              <div className="chamber-sparkles" aria-hidden="true">
                <span className="sparkle s-1">✨</span>
                <span className="sparkle s-2">⭐</span>
                <span className="sparkle s-3">🌟</span>
                <span className="sparkle s-4">✨</span>
                <span className="sparkle s-5">🌙</span>
              </div>
            )}

            {/* Central Lamp Illustration Display */}
            <div className="lamp-centerpiece-wrapper">
              <div className="lamp-glow-halo" aria-hidden="true" />

              {currentDesign.image ? (
                <img
                  src={currentDesign.image}
                  alt={currentDesign.title}
                  className={`lamp-rendered-img ${isPoweredOn ? 'lamp-on' : 'lamp-off'}`}
                />
              ) : currentDesign.id === 'crescent-moon' ? (
                <div className={`custom-svg-lamp moon-lamp ${isPoweredOn ? 'lamp-on' : 'lamp-off'}`}>
                  <svg viewBox="0 0 200 200" className="moon-svg">
                    <circle cx="100" cy="100" r="75" fill="#fde047" opacity="0.15" />
                    <path
                      d="M120 40 A70 70 0 1 0 120 160 A52 52 0 1 1 120 40 Z"
                      fill="#fef08a"
                      stroke="#facc15"
                      strokeWidth="4"
                    />
                    <path
                      d="M50 150 Q100 120 150 150 Q130 170 100 170 Q70 170 50 150 Z"
                      fill="#ffffff"
                      opacity="0.9"
                    />
                    <circle cx="85" cy="95" r="4" fill="#854d0e" />
                    <path d="M83 105 Q87 110 91 105" stroke="#854d0e" strokeWidth="2" fill="none" />
                  </svg>
                </div>
              ) : (
                <div className={`custom-svg-lamp mushroom-lamp ${isPoweredOn ? 'lamp-on' : 'lamp-off'}`}>
                  <svg viewBox="0 0 200 200" className="mushroom-svg">
                    {/* Mushroom stem */}
                    <path d="M82 110 Q78 170 85 180 Q100 185 115 180 Q122 170 118 110 Z" fill="#fff1f2" stroke="#fda4af" strokeWidth="4" />
                    {/* Cute face */}
                    <circle cx="94" cy="145" r="3.5" fill="#9f1239" />
                    <circle cx="106" cy="145" r="3.5" fill="#9f1239" />
                    <path d="M97 152 Q100 155 103 152" stroke="#9f1239" strokeWidth="2" fill="none" />
                    {/* Cap */}
                    <path d="M40 115 Q100 25 160 115 Q100 125 40 115 Z" fill="#fb7185" stroke="#e11d48" strokeWidth="5" />
                    {/* Glowing dots */}
                    <circle cx="100" cy="65" r="12" fill="#fff" opacity="0.95" />
                    <circle cx="68" cy="92" r="9" fill="#fff" opacity="0.95" />
                    <circle cx="132" cy="92" r="9" fill="#fff" opacity="0.95" />
                    <circle cx="100" cy="100" r="7" fill="#fff" opacity="0.9" />
                  </svg>
                </div>
              )}
            </div>

            {/* Bottom Status Ribbon on Lamp Chamber */}
            <div className="lamp-chamber-footer">
              <div className="lamp-status-text">
                <span className="status-indicator-dot" />
                <strong>{isPoweredOn ? 'Glow Active ✨' : 'Sleeping in Darkness 💤'}</strong>
                <span className="status-separator">·</span>
                <span>{currentDesign.mood}</span>
              </div>
              <div className="lamp-intensity-badge">
                {isPoweredOn ? `${glowIntensity}% Brightness` : 'Off'}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Controls & Selection */}
          <div className="nightlight-controls-card">
            {/* 1. Power Switch & Intensity Slider */}
            <div className="control-group-panel">
              <div className="power-switch-row">
                <div className="power-label-col">
                  <h3 className="control-heading">Nightlight Power</h3>
                  <span className="control-subtext">Turn the magical lamp on or off</span>
                </div>

                <button
                  type="button"
                  onClick={handleTogglePower}
                  className={`power-toggle-switch ${isPoweredOn ? 'is-on' : 'is-off'}`}
                  aria-pressed={isPoweredOn}
                  aria-label="Toggle Nightlight Power"
                >
                  <span className="switch-slider" />
                  <span className="switch-text">{isPoweredOn ? 'ON ⭐' : 'OFF'}</span>
                </button>
              </div>

              {/* Glow Intensity Slider */}
              <div className="slider-control-block">
                <div className="slider-label-row">
                  <label htmlFor="lamp-glow-slider" className="slider-label">
                    Glow Intensity
                  </label>
                  <strong className="slider-value">{glowIntensity}%</strong>
                </div>

                <input
                  id="lamp-glow-slider"
                  type="range"
                  min="10"
                  max="100"
                  value={glowIntensity}
                  disabled={!isPoweredOn}
                  onChange={(e) => setGlowIntensity(parseInt(e.target.value, 10))}
                  className="intensity-range-slider"
                  aria-label="Adjust Nightlight Glow Intensity"
                />

                <div className="slider-ticks-row" aria-hidden="true">
                  <span>Soft (10%)</span>
                  <span>Cozy (50%)</span>
                  <span>Radiant (100%)</span>
                </div>
              </div>

              {/* Aura Glow Tone Picker */}
              <div className="tone-picker-block">
                <span className="tone-picker-label">Magical Aura Tone:</span>
                <div className="tone-buttons-row">
                  {GLOW_TONES.map((tone) => {
                    const isSelected = activeTone.color === tone.color;
                    return (
                      <button
                        key={tone.id}
                        type="button"
                        onClick={() => {
                          playClickSound(true);
                          setCustomToneId(tone.id);
                        }}
                        disabled={!isPoweredOn}
                        className={`tone-pill-btn ${isSelected ? 'is-active' : ''}`}
                        style={{ '--tone-color': tone.color }}
                        title={tone.name}
                      >
                        <span className="tone-dot" />
                        <span className="tone-name">{tone.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2. Selectable Designs Carousel / Grid */}
            <div className="designs-selection-panel">
              <h3 className="control-heading">
                <span>🏮</span> Choose a Nightlight Design ({NIGHTLIGHT_DESIGNS.length})
              </h3>

              <div className="designs-list">
                {NIGHTLIGHT_DESIGNS.map((design) => {
                  const isSelected = design.id === selectedDesignId;
                  return (
                    <button
                      key={design.id}
                      type="button"
                      onClick={() => handleSelectDesign(design.id)}
                      className={`design-item-card ${isSelected ? 'is-selected' : ''}`}
                      aria-label={`Select ${design.title}`}
                    >
                      <span className="design-icon-badge">{design.icon}</span>
                      <div className="design-info-col">
                        <strong className="design-title">{design.title}</strong>
                        <span className="design-tagline">{design.tagline}</span>
                      </div>
                      {isSelected && <span className="design-selected-mark">Active ⭐</span>}
                    </button>
                  );
                })}
              </div>

              {/* Selected Design Description Callout */}
              <div className="selected-design-card">
                <div className="selected-card-header">
                  <span className="card-sparkle">✨</span>
                  <h4 className="selected-card-title">{currentDesign.title}</h4>
                </div>
                <p className="selected-card-text">{currentDesign.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
