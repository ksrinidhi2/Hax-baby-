import React, { useState, useEffect, useRef } from 'react';
import './StarCatchMiniGame.css';
import { useSite } from '../context/SiteContext';

export default function StarCatchMiniGame({ isOpen, onClose }) {
  const { playSoundEffect } = useSite();
  const [gameState, setGameState] = useState('ready'); // 'ready' | 'playing' | 'gameover'
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [basketX, setBasketX] = useState(50); // percentage 0 - 100
  const [fallingStars, setFallingStars] = useState([]);

  const gameAreaRef = useRef(null);
  const starsRef = useRef([]);
  const starIdCounterRef = useRef(0);
  const requestRef = useRef(null);
  const lastStarSpawnRef = useRef(0);
  const basketXRef = useRef(50);

  basketXRef.current = basketX;

  // Key navigation
  useEffect(() => {
    if (!isOpen || gameState !== 'playing') return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setBasketX((prev) => Math.max(8, prev - 7));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setBasketX((prev) => Math.min(92, prev + 7));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, gameState, onClose]);

  // Touch / Mouse move over game area
  const handlePointerMove = (e) => {
    if (gameState !== 'playing' || !gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(8, Math.min(92, pct)));
  };

  // Timer countdown
  useEffect(() => {
    if (!isOpen || gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState('gameover');
          playSoundEffect('star');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, gameState, playSoundEffect]);

  // Main game loop for falling stars
  useEffect(() => {
    if (!isOpen || gameState !== 'playing') return;

    let lastTime = performance.now();

    const loop = (time) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Spawn stars every 650ms
      if (time - lastStarSpawnRef.current > 650) {
        lastStarSpawnRef.current = time;
        const newStar = {
          id: ++starIdCounterRef.current,
          x: Math.random() * 80 + 10, // 10% - 90%
          y: -5,
          speed: Math.random() * 25 + 30, // % per second
          symbol: Math.random() > 0.3 ? '⭐' : '🌟',
          points: 1
        };
        starsRef.current.push(newStar);
      }

      // Update positions & check collision with basket (basket at y: 88%)
      const updated = [];
      const currentBasket = basketXRef.current;

      for (const st of starsRef.current) {
        st.y += st.speed * delta;

        // Collision check
        if (st.y >= 82 && st.y <= 92 && Math.abs(st.x - currentBasket) < 14) {
          setScore((s) => s + st.points);
          playSoundEffect('click');
          // Star caught! Don't push to updated
          continue;
        }

        // Missed bottom of screen
        if (st.y < 105) {
          updated.push(st);
        }
      }

      starsRef.current = updated;
      setFallingStars([...updated]);

      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isOpen, gameState, playSoundEffect]);

  const startGame = () => {
    playSoundEffect('click');
    setScore(0);
    setTimeLeft(25);
    setBasketX(50);
    starsRef.current = [];
    setFallingStars([]);
    lastStarSpawnRef.current = performance.now();
    setGameState('playing');
  };

  if (!isOpen) return null;

  return (
    <div className="minigame-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Catch the Falling Stars Mini-Game">
      <div className="minigame-window" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="minigame-header">
          <div className="minigame-title">
            <span>⭐</span>
            <h3>Catch the Falling Stars!</h3>
            <span>☁️</span>
          </div>
          <button
            type="button"
            className="minigame-close-btn"
            onClick={onClose}
            aria-label="Close Mini-Game"
          >
            ✕
          </button>
        </div>

        {/* Score & Timer Bar */}
        <div className="minigame-stats-bar">
          <div className="minigame-stat">
            <span className="stat-label">Stars Caught:</span>
            <span className="stat-value">{score} ⭐</span>
          </div>
          <div className="minigame-stat">
            <span className="stat-label">Time Remaining:</span>
            <span className={`stat-value ${timeLeft <= 5 ? 'stat-urgent' : ''}`}>
              {timeLeft}s ⏳
            </span>
          </div>
        </div>

        {/* Game Canvas Area */}
        <div
          ref={gameAreaRef}
          className="minigame-stage"
          onMouseMove={handlePointerMove}
          onTouchMove={handlePointerMove}
        >
          {gameState === 'ready' && (
            <div className="minigame-overlay">
              <h4>Help Pip Gather Starlight!</h4>
              <p>Move Pip's fluffy cloud basket using your mouse, touch, or Left/Right arrow keys to catch twinkling stars for the Midnight Nursery!</p>
              <button type="button" className="btn btn-primary" onClick={startGame}>
                Start Star Catching ✨
              </button>
            </div>
          )}

          {gameState === 'playing' && (
            <>
              {/* Falling Stars */}
              {fallingStars.map((st) => (
                <div
                  key={st.id}
                  className="minigame-star"
                  style={{
                    left: `${st.x}%`,
                    top: `${st.y}%`
                  }}
                >
                  {st.symbol}
                </div>
              ))}

              {/* Pip's Cloud Basket */}
              <div
                className="minigame-basket"
                style={{
                  left: `${basketX}%`
                }}
              >
                <span className="basket-pip-icon">👶</span>
                <span className="basket-cloud">☁️</span>
              </div>
            </>
          )}

          {gameState === 'gameover' && (
            <div className="minigame-overlay">
              <h4>Sweet Dreams! ⭐</h4>
              <p>
                You caught <strong>{score} glowing stars</strong> for Pip's nursery!
                {score >= 12
                  ? ' Amazing job! The Midnight Nursery is shining so brightly!'
                  : ' Thank you for helping keep the night skies cozy and safe!'}
              </p>
              <div className="minigame-action-row">
                <button type="button" className="btn btn-primary" onClick={startGame}>
                  Play Again 🔄
                </button>
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Back to Workshop 🌙
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="minigame-footer-note">
          <span>Controls: Use <strong>← / →</strong> Arrow Keys, Mouse, or Touch to slide</span>
        </div>
      </div>
    </div>
  );
}
