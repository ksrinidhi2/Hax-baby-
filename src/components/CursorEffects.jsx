import React, { useEffect, useState, useRef } from 'react';
import './CursorEffects.css';
import { useSite } from '../context/SiteContext';

export default function CursorEffects() {
  const { sparklesActive, nightlightCursor, theme } = useSite();
  const [pos, setPos] = useState({ x: -1000, y: -1000 });
  const [sparkles, setSparkles] = useState([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const lastSpawnTimeRef = useRef(0);
  const sparkleIdCounterRef = useRef(0);

  // Check reduced-motion preference only
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);

    const handleMotionChange = (e) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handleMotionChange);

    return () => mql.removeEventListener('change', handleMotionChange);
  }, []);

  // Listen to pointer movement globally (works with mouse, trackpad, pen)
  useEffect(() => {
    const handlePointerMove = (e) => {
      // If event explicitly comes from pure touch contact, skip
      if (e.pointerType === 'touch') return;

      const x = e.clientX;
      const y = e.clientY;
      setPos({ x, y });

      if (sparklesActive && !prefersReducedMotion) {
        const now = performance.now();
        // Throttle sparkle creation to every 38ms for buttery-smooth trail
        if (now - lastSpawnTimeRef.current > 38) {
          lastSpawnTimeRef.current = now;

          const symbols = ['✦', '⭐', '✧', '⋆', '･', '✨'];
          const symbol = symbols[Math.floor(Math.random() * symbols.length)];
          const size = Math.floor(Math.random() * 8) + 12; // 12px - 20px
          const offsetX = (Math.random() - 0.5) * 20;
          const offsetY = (Math.random() - 0.5) * 20;
          const rotation = Math.floor(Math.random() * 360);
          const colorVariants = ['#ffc837', '#ffd66b', '#ffb5cb', '#c4e2ff', '#ffffff', '#ffe785'];
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
            const updated = prev.length > 28 ? prev.slice(prev.length - 27) : [...prev];
            return [...updated, newSparkle];
          });
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('mousemove', handlePointerMove);
    };
  }, [sparklesActive, prefersReducedMotion]);

  // Clean up expired sparkles automatically
  useEffect(() => {
    if (sparkles.length === 0) return;

    const timer = setTimeout(() => {
      setSparkles((prev) => prev.slice(1));
    }, 700);

    return () => clearTimeout(timer);
  }, [sparkles]);

  const isNight = theme === 'night';

  return (
    <div className="cursor-effects-layer" aria-hidden="true">
      {/* 1. Subtle Nightlight Flashlight Cursor Glow */}
      {nightlightCursor && pos.x >= 0 && (
        <div
          className={`nightlight-cursor-glow ${isNight ? 'is-night' : 'is-day'}`}
          style={{
            transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`
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
