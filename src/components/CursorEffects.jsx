import React, { useEffect, useState, useRef } from 'react';
import './CursorEffects.css';
import { useSite } from '../context/SiteContext';

export default function CursorEffects() {
  const { sparklesActive, nightlightCursor, theme } = useSite();
  const [pos, setPos] = useState({ x: -1000, y: -1000 });
  const [sparkles, setSparkles] = useState([]);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const lastSpawnTimeRef = useRef(0);
  const sparkleIdCounterRef = useRef(0);

  // Check touch & reduced-motion
  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);

    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);

    const handleMotionChange = (e) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handleMotionChange);

    return () => mql.removeEventListener('change', handleMotionChange);
  }, []);

  // Mouse move listener
  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;
      setPos({ x, y });

      if (sparklesActive && !prefersReducedMotion) {
        const now = performance.now();
        // Throttle sparkle creation to every 45ms
        if (now - lastSpawnTimeRef.current > 45) {
          lastSpawnTimeRef.current = now;

          const symbols = ['✦', '⭐', '✧', '⋆', '･'];
          const symbol = symbols[Math.floor(Math.random() * symbols.length)];
          const size = Math.floor(Math.random() * 8) + 10; // 10px - 18px
          const offsetX = (Math.random() - 0.5) * 16;
          const offsetY = (Math.random() - 0.5) * 16;
          const rotation = Math.floor(Math.random() * 360);
          const colorVariants = ['#ffc837', '#ffd66b', '#ffb5cb', '#c4e2ff', '#ffffff'];
          const color = colorVariants[Math.floor(Math.random() * colorVariants.length)];

          const newSparkle = {
            id: ++sparkleIdCounterRef.current,
            x: x + offsetX,
            y: y + offsetY,
            symbol,
            size,
            rotation,
            color
          };

          setSparkles((prev) => {
            // Keep at most 24 active sparkles
            const updated = prev.length > 24 ? prev.slice(prev.length - 23) : [...prev];
            return [...updated, newSparkle];
          });
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [sparklesActive, prefersReducedMotion, isTouchDevice]);

  // Clean up sparkles automatically after lifetime (650ms)
  useEffect(() => {
    if (sparkles.length === 0) return;

    const timer = setTimeout(() => {
      setSparkles((prev) => prev.slice(1));
    }, 650);

    return () => clearTimeout(timer);
  }, [sparkles]);

  if (isTouchDevice) {
    return null;
  }

  const isNight = theme === 'night';

  return (
    <div className="cursor-effects-layer" aria-hidden="true">
      {/* 1. Subtle Nightlight Flashlight Cursor Glow */}
      {nightlightCursor && pos.x >= 0 && (
        <div
          className={`nightlight-cursor-glow ${isNight ? 'is-night' : 'is-day'}`}
          style={{
            transform: `translate(${pos.x}px, ${pos.y}px)`
          }}
        />
      )}

      {/* 2. Sparkle Cursor Trail */}
      {sparklesActive &&
        sparkles.map((sp) => (
          <span
            key={sp.id}
            className="cursor-sparkle-star"
            style={{
              left: `${sp.x}px`,
              top: `${sp.y}px`,
              fontSize: `${sp.size}px`,
              color: sp.color,
              transform: `translate(-50%, -50%) rotate(${sp.rotation}deg)`
            }}
          >
            {sp.symbol}
          </span>
        ))}
    </div>
  );
}
