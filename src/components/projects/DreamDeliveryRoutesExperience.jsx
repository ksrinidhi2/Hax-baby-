import React, { useState, useEffect, useRef } from 'react';
import './DreamDeliveryRoutesExperience.css';
import deliveryPipImg from '../../../assets/project_dream_delivery.png';
import observatoryImg from '../../../assets/pip_hero_observatory.png';
import { useSite } from '../../context/SiteContext';

const DESTINATIONS = [
  {
    id: 'star-cottage',
    name: 'Star Cottage',
    icon: '🏡',
    badgeColor: '#f59e0b',
    coords: { x: 74, y: 22 },
    recipient: 'Little Mouse & Sleepy Owl',
    packageItem: 'Fluffy Quilt & Starlight Bottle ⭐',
    flightTimeSec: 4.5,
    description: 'A cozy cottage nestled on the eastern stardust hills. A chimney puffs soft twilight clouds while the little mice tuck in for sleep.',
    arrivalMessage: 'Pip tucked the little mice into their feather quilt and whispered sweet dreams! 🏡✨'
  },
  {
    id: 'moon-garden',
    name: 'Moon Garden',
    icon: '🌸',
    badgeColor: '#ec4899',
    coords: { x: 78, y: 74 },
    recipient: 'Luna Fireflies & Glow Moths',
    packageItem: 'Lavender Moon-Mist & Petal Pillows 🌸',
    flightTimeSec: 4.8,
    description: 'A glowing floral sanctuary where night-lilies and silver ferns bloom. The fireflies need gentle mist to dim their bright lamps.',
    arrivalMessage: 'The fireflies gently dimmed their lanterns, soothed by the lavender moon-mist! 🌸🌙'
  },
  {
    id: 'cloud-village',
    name: 'Cloud Village',
    icon: '☁️',
    badgeColor: '#38bdf8',
    coords: { x: 22, y: 24 },
    recipient: 'Baby Cloud Spirits & Star Sprites',
    packageItem: 'Warm Honey Milk & Marshmallow Clouds 🍯',
    flightTimeSec: 4.2,
    description: 'A cluster of puffy pastel cloud houses floating in the northern breeze. Baby cloud spirits gather for their evening honey milk.',
    arrivalMessage: 'Warm honey milk was delivered to the baby clouds, making them yawn and drift into peaceful sleep! ☁️💗'
  },
  {
    id: 'sleepy-forest',
    name: 'Sleepy Forest',
    icon: '🌲',
    badgeColor: '#10b981',
    coords: { x: 24, y: 76 },
    recipient: 'Sleeping Bear Cub & Forest Rabbits',
    packageItem: 'Brass Observatory Nightlight & Pine Lullaby 🏮',
    flightTimeSec: 4.6,
    description: 'A quiet mossy grove beneath ancient glowing trees. Pip delivers warm bedside lanterns to keep the shadows friendly.',
    arrivalMessage: 'The little bear cub hugged the warm starlight lantern and fell into a deep winter sleep! 🌲💤'
  }
];

export default function DreamDeliveryRoutesExperience({ onBack }) {
  const { isMuted } = useSite();
  const [selectedDestId, setSelectedDestId] = useState('star-cottage');
  const [deliveryState, setDeliveryState] = useState('idle'); // 'idle' | 'flying' | 'completed'
  const [deliveryProgress, setDeliveryProgress] = useState(0);
  const [stepText, setStepText] = useState('Ready for flight');
  const [deliveredCounts, setDeliveredCounts] = useState({
    'star-cottage': 1,
    'moon-garden': 0,
    'cloud-village': 1,
    'sleepy-forest': 0
  });

  const animTimerRef = useRef(null);
  const currentDest = DESTINATIONS.find((d) => d.id === selectedDestId) || DESTINATIONS[0];

  // Play gentle sound effects via Web Audio API
  const playSfx = (type) => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'liftoff') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'delivery-done') {
        // Double joyful chime
        const chime = (freq, delay) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'sine';
          o.frequency.setValueAtTime(freq, ctx.currentTime + delay);
          g.gain.setValueAtTime(0.001, ctx.currentTime + delay);
          g.gain.linearRampToValueAtTime(0.25, ctx.currentTime + delay + 0.03);
          g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 0.6);
          o.connect(g);
          g.connect(ctx.destination);
          o.start(ctx.currentTime + delay);
          o.stop(ctx.currentTime + delay + 0.6);
        };
        chime(659.25, 0);
        chime(880.00, 0.15);
        chime(1046.50, 0.3);
      }
    } catch {
      // Ignore
    }
  };

  // Start Delivery Journey
  const handleStartDelivery = () => {
    if (deliveryState === 'flying') return;

    playSfx('liftoff');
    setDeliveryState('flying');
    setDeliveryProgress(0);
    setStepText('1. Taking off from Midnight Observatory... 🎈');

    const totalDurationMs = currentDest.flightTimeSec * 1000;
    const intervalMs = 50;
    const increment = (intervalMs / totalDurationMs) * 100;
    let currentPct = 0;

    if (animTimerRef.current) clearInterval(animTimerRef.current);

    animTimerRef.current = setInterval(() => {
      currentPct += increment;

      if (currentPct >= 25 && currentPct < 55) {
        setStepText('2. Floating across starlit cloud paths... ☁️✨');
      } else if (currentPct >= 55 && currentPct < 90) {
        setStepText(`3. Approaching ${currentDest.name}... 🌙`);
      } else if (currentPct >= 90 && currentPct < 100) {
        setStepText('4. Descending with dream package... 🎁');
      }

      if (currentPct >= 100) {
        clearInterval(animTimerRef.current);
        animTimerRef.current = null;
        setDeliveryProgress(100);
        setDeliveryState('completed');
        setStepText('✨ Dream Delivered!');
        playSfx('delivery-done');

        setDeliveredCounts((prev) => ({
          ...prev,
          [currentDest.id]: (prev[currentDest.id] || 0) + 1
        }));
      } else {
        setDeliveryProgress(currentPct);
      }
    }, intervalMs);
  };

  // Reset or Switch
  const isButtonNavRef = useRef(false);
  const buttonNavTimerRef = useRef(null);
  const routesStackRef = useRef(null);

  const handleSelectDestination = (id) => {
    if (deliveryState === 'flying') return;
    isButtonNavRef.current = true;
    if (buttonNavTimerRef.current) clearTimeout(buttonNavTimerRef.current);
    buttonNavTimerRef.current = setTimeout(() => {
      isButtonNavRef.current = false;
    }, 1200);

    if (animTimerRef.current) clearInterval(animTimerRef.current);
    setSelectedDestId(id);
    setDeliveryState('idle');
    setDeliveryProgress(0);
    setStepText('Ready for flight');
  };

  // Reset Everything
  const handleResetMap = () => {
    if (animTimerRef.current) clearInterval(animTimerRef.current);
    setSelectedDestId('star-cottage');
    setDeliveryState('idle');
    setDeliveryProgress(0);
    setStepText('Ready for flight');
  };

  // Scroll synchronization for route steps
  useEffect(() => {
    const stackEl = routesStackRef.current;
    if (!stackEl) return;

    const handleRoutesScroll = () => {
      if (isButtonNavRef.current || deliveryState === 'flying') return;

      const scrollTop = stackEl.scrollTop;
      const scrollHeight = stackEl.scrollHeight - stackEl.clientHeight;
      if (scrollHeight <= 0) return;

      const scrollFraction = Math.max(0, Math.min(0.999, scrollTop / scrollHeight));
      const destIndex = Math.floor(scrollFraction * DESTINATIONS.length);
      const targetDest = DESTINATIONS[destIndex];

      if (targetDest && targetDest.id !== selectedDestId) {
        setSelectedDestId(targetDest.id);
        const subFraction = (scrollFraction * DESTINATIONS.length) % 1;
        setDeliveryProgress(Math.round(subFraction * 60));
        setStepText(`Cruising toward ${targetDest.name}...`);
      }
    };

    stackEl.addEventListener('scroll', handleRoutesScroll, { passive: true });
    return () => stackEl.removeEventListener('scroll', handleRoutesScroll);
  }, [deliveryState, selectedDestId]);

  useEffect(() => {
    return () => {
      if (animTimerRef.current) clearInterval(animTimerRef.current);
      if (buttonNavTimerRef.current) clearTimeout(buttonNavTimerRef.current);
    };
  }, []);

  // Compute position of flying Pip on the map (from center {50, 50} to destination coords)
  const centerCoord = { x: 50, y: 50 };
  const targetCoord = currentDest.coords;
  const currentPipX = centerCoord.x + (targetCoord.x - centerCoord.x) * (deliveryProgress / 100);
  const currentPipY = centerCoord.y + (targetCoord.y - centerCoord.y) * (deliveryProgress / 100);

  return (
    <div className="project-experience-container dream-delivery-experience" aria-label="Dream Delivery Routes Experience">
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

        <div className="experience-badge delivery-badge">
          <span className="badge-icon">📍</span> Project 03 · Full Experience
        </div>
      </div>

      {/* Main Experience Window */}
      <div className="delivery-window">
        {/* Header Hero */}
        <div className="delivery-header">
          <div className="delivery-header-text">
            <div className="delivery-title-row">
              <span className="delivery-icon" aria-hidden="true">📍</span>
              <h1 className="delivery-title">Dream Delivery Routes</h1>
              <span className="delivery-star" aria-hidden="true">⭐</span>
            </div>
            <p className="delivery-subtitle">
              Help Pip navigate the nocturnal dream world in a cozy hot-air balloon. Select a sleepy destination,
              prepare the dream package, and guide Pip safely along starry flight corridors!
            </p>
          </div>

          <div className="delivery-header-actions">
            <button
              type="button"
              onClick={handleResetMap}
              className="btn delivery-reset-btn"
              disabled={deliveryState === 'flying'}
              title="Reset routes and flight status"
            >
              <span>🔄</span> Reset Routes
            </button>
          </div>
        </div>

        {/* Interactive Delivery Layout */}
        <div className="delivery-layout-grid">
          {/* Left Column: Interactive Dream World Map Canvas */}
          <div className="delivery-map-card">
            <div className="map-canvas-container" role="region" aria-label="Interactive Dream Map">
              {/* Map SVG Flight Paths and Grid Decor */}
              <svg className="map-routes-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#93c5fd" />
                    <stop offset="100%" stopColor="#f472b6" />
                  </linearGradient>
                </defs>

                {/* Starry Flight Corridors connecting Observatory to Destinations */}
                {DESTINATIONS.map((dest) => {
                  const isCurrent = dest.id === selectedDestId;
                  return (
                    <line
                      key={dest.id}
                      x1={centerCoord.x}
                      y1={centerCoord.y}
                      x2={dest.coords.x}
                      y2={dest.coords.y}
                      className={`flight-route-line ${isCurrent ? 'is-active-route' : ''}`}
                      strokeDasharray={isCurrent ? '2, 2' : '3, 4'}
                    />
                  );
                })}
              </svg>

              {/* Central Launchpad: Midnight Observatory */}
              <div
                className="map-landmark observatory-landmark"
                style={{ left: `${centerCoord.x}%`, top: `${centerCoord.y}%` }}
                title="Midnight Nursery Observatory (Pip's Base)"
              >
                <div className="landmark-pulse-ring" />
                <div className="observatory-bubble">
                  <img src={observatoryImg} alt="Observatory" className="observatory-map-img" />
                  <span className="observatory-label">Nursery Base</span>
                </div>
              </div>

              {/* 4 Interactive Destination Pins */}
              {DESTINATIONS.map((dest) => {
                const isSelected = dest.id === selectedDestId;
                const count = deliveredCounts[dest.id] || 0;
                return (
                  <button
                    key={dest.id}
                    type="button"
                    onClick={() => handleSelectDestination(dest.id)}
                    disabled={deliveryState === 'flying'}
                    className={`map-destination-pin ${isSelected ? 'is-target' : ''}`}
                    style={{
                      left: `${dest.coords.x}%`,
                      top: `${dest.coords.y}%`,
                      '--dest-color': dest.badgeColor
                    }}
                    aria-label={`Select ${dest.name}`}
                  >
                    <div className="pin-marker">
                      <span className="pin-icon">{dest.icon}</span>
                      {count > 0 && <span className="pin-badge" title={`${count} dreams delivered`}>{count}</span>}
                    </div>
                    <span className="pin-label">{dest.name}</span>
                  </button>
                );
              })}

              {/* Animated Flying Pip Balloon Avatar */}
              {(deliveryState === 'flying' || deliveryState === 'completed') && (
                <div
                  className="flying-pip-avatar"
                  style={{
                    left: `${currentPipX}%`,
                    top: `${currentPipY}%`
                  }}
                  aria-hidden="true"
                >
                  <img
                    src={deliveryPipImg}
                    alt="Pip in hot air balloon"
                    className="flying-balloon-img"
                  />
                  <span className="flying-pip-trail">✨</span>
                </div>
              )}
            </div>

            {/* In-Flight Live Progress Indicator */}
            <div className="delivery-progress-strip">
              <div className="progress-info-row">
                <span className="progress-step-text">
                  <strong>Status:</strong> {stepText}
                </span>
                <span className="progress-pct-badge">{Math.round(deliveryProgress)}%</span>
              </div>
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${deliveryProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Destination Info, Flight Controls, and Completion Message */}
          <div className="delivery-sidebar-card">
            {/* 1. Destination Details Panel */}
            <div className="destination-details-card">
              <div className="details-header-row">
                <span className="destination-large-icon">{currentDest.icon}</span>
                <div className="destination-titles">
                  <span className="dest-tagline">Selected Delivery Destination</span>
                  <h3 className="dest-main-title">{currentDest.name}</h3>
                </div>
              </div>

              <p className="dest-desc-text">{currentDest.description}</p>

              <div className="dest-metadata-box">
                <div className="meta-row">
                  <span className="meta-label">Recipient:</span>
                  <strong className="meta-value">{currentDest.recipient}</strong>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Dream Package:</span>
                  <strong className="meta-value">{currentDest.packageItem}</strong>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Flight Distance:</span>
                  <span className="meta-value">{currentDest.flightTimeSec * 120} stardust miles</span>
                </div>
              </div>

              {/* Delivery Action Button */}
              {deliveryState !== 'completed' ? (
                <button
                  type="button"
                  onClick={handleStartDelivery}
                  disabled={deliveryState === 'flying'}
                  className={`btn delivery-start-btn ${deliveryState === 'flying' ? 'is-flying' : ''}`}
                >
                  {deliveryState === 'flying' ? (
                    <>
                      <span className="flying-spinner">🎈</span> Delivering Dream...
                    </>
                  ) : (
                    <>
                      <span>🚀</span> Start Delivery to {currentDest.name}
                    </>
                  )}
                </button>
              ) : (
                <div className="delivery-completion-card">
                  <div className="completion-badge">
                    <span>🎉</span> Package Safely Delivered!
                  </div>
                  <p className="completion-msg">{currentDest.arrivalMessage}</p>
                  <div className="completion-actions-row">
                    <button
                      type="button"
                      onClick={handleStartDelivery}
                      className="btn completion-replay-btn"
                    >
                      <span>🔄</span> Replay Flight
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const nextIndex = (DESTINATIONS.findIndex((d) => d.id === selectedDestId) + 1) % DESTINATIONS.length;
                        handleSelectDestination(DESTINATIONS[nextIndex].id);
                      }}
                      className="btn completion-next-btn"
                    >
                      <span>⭐</span> Next Destination →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Destination Selector List */}
            <div className="destinations-list-panel">
              <h4 className="routes-list-heading">
                <span>🗺️</span> All Dream Destinations ({DESTINATIONS.length})
              </h4>
              <div ref={routesStackRef} className="routes-buttons-stack">
                {DESTINATIONS.map((dest) => {
                  const isSelected = dest.id === selectedDestId;
                  const count = deliveredCounts[dest.id] || 0;
                  return (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => handleSelectDestination(dest.id)}
                      disabled={deliveryState === 'flying'}
                      className={`route-select-item ${isSelected ? 'is-selected' : ''}`}
                    >
                      <span className="route-item-icon">{dest.icon}</span>
                      <div className="route-item-meta">
                        <strong className="route-item-name">{dest.name}</strong>
                        <span className="route-item-recipient">{dest.recipient}</span>
                      </div>
                      <span className="route-item-deliveries">
                        {count > 0 ? `Delivered: ${count}` : 'Pending ⭐'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
