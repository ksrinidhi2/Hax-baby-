import React, { useState, useEffect } from 'react';
import './GuestbookSection.css';
import headerPipImg from '../../assets/guestbook_header_pip.png';
import visitorsOdometerImg from '../../assets/guestbook_visitors_odometer.png';
import specialPipImg from '../../assets/guestbook_special_pip.png';

const ICON_BADGES = [
  { id: 'star', symbol: '⭐', label: 'Star' },
  { id: 'moon', symbol: '🌙', label: 'Moon' },
  { id: 'cloud', symbol: '☁️', label: 'Cloud' },
  { id: 'bunny', symbol: '🐰', label: 'Bunny' },
  { id: 'heart', symbol: '💗', label: 'Heart' },
  { id: 'flower', symbol: '🌼', label: 'Flower' }
];

const INITIAL_WISHES = [
  {
    id: 1,
    name: 'Luna Dreamer',
    badge: '🌙',
    message: 'Thank you Pip for making the night so gentle and cozy! Keep shining high above!',
    time: 'A little while ago'
  },
  {
    id: 2,
    name: 'Stardust Friend',
    badge: '⭐',
    message: 'I hope every lonely star in the sky finds a warm home at the Midnight Nursery! 💖',
    time: 'Today'
  },
  {
    id: 3,
    name: 'Sleepy Bunny',
    badge: '🐰',
    message: 'The lullabies and nightlights make our bedtime so peaceful. We love you Pip! ☁️',
    time: 'Yesterday'
  }
];

export default function GuestbookSection() {
  const [wishes, setWishes] = useState(() => {
    try {
      const saved = localStorage.getItem('pip_dream_guestbook_wishes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback to default
    }
    return INITIAL_WISHES;
  });

  const [visitorCount, setVisitorCount] = useState(() => {
    try {
      const saved = localStorage.getItem('pip_dream_visitor_count');
      if (saved) {
        const num = parseInt(saved, 10);
        if (!isNaN(num)) return num;
      }
    } catch {
      // Fallback
    }
    return 1234;
  });

  const [name, setName] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('star');
  const [message, setMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', text: string }
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Increment visitor count once per session
  useEffect(() => {
    try {
      const sessionCounted = sessionStorage.getItem('pip_visitor_counted');
      if (!sessionCounted) {
        sessionStorage.setItem('pip_visitor_counted', 'true');
        setVisitorCount((prev) => {
          const nextCount = prev + 1;
          localStorage.setItem('pip_dream_visitor_count', nextCount.toString());
          return nextCount;
        });
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Save wishes to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('pip_dream_guestbook_wishes', JSON.stringify(wishes));
    } catch {
      // Ignore
    }
  }, [wishes]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const trimmedMsg = message.trim();
    if (!trimmedMsg) {
      setStatusMessage({
        type: 'error',
        text: 'Please write a little wish or kind note for Pip! ⭐'
      });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    setTimeout(() => {
      const selectedIcon = ICON_BADGES.find((b) => b.id === selectedBadge) || ICON_BADGES[0];
      const newWish = {
        id: Date.now(),
        name: name.trim() || 'A Gentle Dreamer',
        badge: selectedIcon.symbol,
        message: trimmedMsg,
        time: 'Just now'
      };

      setWishes((prev) => [newWish, ...prev]);
      setMessage('');
      setName('');
      setSelectedBadge('star');
      setIsSubmitting(false);
      setStatusMessage({
        type: 'success',
        text: 'Your wish has reached Pip! Thank you for making the night a little brighter! ⭐'
      });
    }, 300);
  };

  const digits = String(visitorCount).padStart(4, '0').split('');

  return (
    <section id="guestbook" className="guestbook-section" aria-label="Dream Guestbook">
      {/* 1. Main Dream Guestbook Window */}
      <div className="guestbook-window">
        {/* Header Bar */}
        <div className="guestbook-window-header">
          <div className="guestbook-header-left">
            <div className="guestbook-title-row">
              <span className="guestbook-envelope-icon" aria-hidden="true">💌</span>
              <h2 className="guestbook-title">Dream Guestbook</h2>
              <span className="guestbook-star-icon" aria-hidden="true">⭐</span>
            </div>
            <p className="guestbook-subtitle">
              Leave a little wish, a kind message, or a dream for Pip!<br />
              Your words become a part of the Midnight Nursery and help keep the stars shining.
            </p>
          </div>

          <div className="guestbook-header-right">
            <img
              src={headerPipImg}
              alt="Pip with bunny holding a letter on clouds: Every wish makes the night a little brighter!"
              className="guestbook-header-pip-img"
            />
          </div>
        </div>

        {/* Main Two-Column Layout */}
        <div className="guestbook-main-layout">
          {/* Left Column: Leave a Dream Wish Form */}
          <div className="guestbook-card guestbook-form-card">
            <div className="card-title-row">
              <span className="card-pencil-icon" aria-hidden="true">✏️</span>
              <h3 className="card-heading">Leave a Dream Wish</h3>
              <span className="card-star-icon" aria-hidden="true">⭐</span>
            </div>

            <form onSubmit={handleSubmit} className="guestbook-form" noValidate>
              {/* Optional Name Input */}
              <div className="form-group">
                <label htmlFor="guestbook-name" className="form-label">
                  Your Name (optional)
                </label>
                <input
                  id="guestbook-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dreamer"
                  maxLength={50}
                  className="form-input"
                  disabled={isSubmitting}
                />
              </div>

              {/* 6 Selectable Icon Badges */}
              <div className="form-group">
                <span className="form-label" id="badge-select-label">Choose a little icon</span>
                <div
                  className="icon-badges-row"
                  role="radiogroup"
                  aria-labelledby="badge-select-label"
                >
                  {ICON_BADGES.map((b) => {
                    const isSelected = selectedBadge === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={b.label}
                        onClick={() => setSelectedBadge(b.id)}
                        className={`badge-btn badge-${b.id} ${isSelected ? 'is-selected' : ''}`}
                        disabled={isSubmitting}
                      >
                        <span className="badge-symbol">{b.symbol}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message Textarea with 200 char limit */}
              <div className="form-group">
                <label htmlFor="guestbook-msg" className="form-label">
                  Your Wish for Pip
                </label>
                <textarea
                  id="guestbook-msg"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a kind message, a dream, or a little note...&#10;(Keep it kind and positive! 💙)"
                  maxLength={200}
                  className="form-textarea"
                  disabled={isSubmitting}
                />
                <div className="char-counter-row">
                  <span className="char-counter" aria-live="polite">
                    {message.length}/200
                  </span>
                </div>
              </div>

              {/* Status feedback */}
              {statusMessage && (
                <div
                  className={`status-message status-${statusMessage.type}`}
                  role={statusMessage.type === 'error' ? 'alert' : 'status'}
                >
                  {statusMessage.text}
                </div>
              )}

              {/* Submit Button */}
              <div className="form-submit-row">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn guestbook-submit-btn"
                >
                  {isSubmitting ? 'Posting Wish... ✨' : 'Post Wish ⭐'}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Dream Visitors & Your Wish is Special */}
          <div className="guestbook-right-column">
            {/* 1. Dream Visitors Panel */}
            <div className="guestbook-card guestbook-visitors-card">
              <div className="card-title-row">
                <span className="card-chart-icon" aria-hidden="true">📊</span>
                <h3 className="card-heading">Dream Visitors</h3>
                <span className="card-star-icon" aria-hidden="true">⭐</span>
              </div>
              <p className="visitors-subtitle">
                So many kind dreamers have visited Pip's world!
              </p>

              {/* Odometer Display */}
              <div className="odometer-container">
                <div className="odometer-artwork-wrapper">
                  <img
                    src={visitorsOdometerImg}
                    alt="Dream visitors counter frame with bunny and clouds"
                    className="odometer-bg-img"
                  />
                  {/* Live Animated Digits overlay perfectly over the 4 frame cards */}
                  <div className="odometer-digits-container" aria-label={`Visitor count: ${visitorCount}`}>
                    {digits.map((digit, idx) => (
                      <div key={idx} className={`odometer-digit-slot odometer-slot-${idx}`}>
                        <span className="odometer-digit-text">{digit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Your Wish is Special Panel */}
            <div className="guestbook-card guestbook-special-card">
              <div className="card-title-row">
                <span className="card-mail-icon" aria-hidden="true">💌</span>
                <h3 className="card-heading">Your Wish is Special</h3>
                <span className="card-star-icon" aria-hidden="true">⭐</span>
              </div>

              <div className="special-card-body">
                <div className="special-pip-media">
                  <img
                    src={specialPipImg}
                    alt="Pip sleeping warmly holding a glowing star"
                    className="special-pip-img"
                  />
                </div>
                <div className="special-pip-text-col">
                  <h4 className="special-callout-title">Your wish has reached Pip!</h4>
                  <p className="special-callout-desc">
                    Thank you for sharing your dream and being a part of the Midnight Nursery. Sweet dreams! 💗
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submitted Wishes Cards List */}
        {wishes.length > 0 && (
          <div className="submitted-wishes-section">
            <div className="submitted-wishes-header">
              <h4 className="submitted-wishes-title">✨ Community Dream Wishes ({wishes.length})</h4>
            </div>
            <div className="submitted-wishes-grid">
              {wishes.slice(0, 6).map((item) => (
                <div key={item.id} className="wish-card">
                  <div className="wish-card-top">
                    <span className="wish-card-badge">{item.badge}</span>
                    <strong className="wish-card-name">{item.name}</strong>
                    <span className="wish-card-time">{item.time}</span>
                  </div>
                  <p className="wish-card-msg">{item.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inspirational Quote */}
        <div className="guestbook-inspirational-quote">
          “A kinder world begins with brighter dreams.”
        </div>
      </div>
    </section>
  );
}
