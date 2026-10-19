import React, { useEffect, useState, useRef } from 'react';
import './CursorEffects.css';
import { useSite } from '../context/SiteContext';

// Balanced mix of pastel pink, lavender, sky blue, mint green, soft gold, and occasional peach
const PASTEL_PALETTE = [
  { color: '#ff9ec6', glow: 'rgba(255, 158, 198, 0.95)' }, // Pastel Pink
  { color: '#cda6ff', glow: 'rgba(205, 166, 255, 0.95)' }, // Lavender
  { color: '#7cd4ff', glow: 'rgba(124, 212, 255, 0.95)' }, // Sky Blue
  { color: '#88ecc4', glow: 'rgba(136, 236, 196, 0.95)' }, // Mint Green
  { color: '#ffd66b', glow: 'rgba(255, 214, 107, 0.95)' }, // Soft Gold
  { color: '#ffbe99', glow: 'rgba(255, 190, 153, 0.95)' }, // Occasional Peach
  { color: '#ffa8d8', glow: 'rgba(255, 168, 216, 0.95)' }, // Baby Rose Pink
  { color: '#a8d8ff', glow: 'rgba(168, 216, 255, 0.95)' }, // Powder Blue
  { color: '#dfb8ff', glow: 'rgba(223, 184, 255, 0.95)' }, // Soft Lilac
  { color: '#ffe27d', glow: 'rgba(255, 226, 125, 0.95)' }  // Warm Butter Gold
];

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

          // Sequentially cycle through the pastel rainbow for smooth gradient variation
          const paletteIndex = sparkleIdCounterRef.current % PASTEL_PALETTE.length;
          const pickedPalette = PASTEL_PALETTE[paletteIndex];

          const newSparkle = {
            id: ++sparkleIdCounterRef.current,
            x: x + offsetX,
            y: y + offsetY,
            symbol,
            size,
            rotation,
            color: pickedPalette.color,
            glow: pickedPalette.glow
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

      {/* 2. Sparkle Cursor Trail - Pastel Pink, Lavender, Sky Blue, Mint, Gold, Peach */}
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
              textShadow: `0 0 6px ${sp.glow}, 0 0 12px rgba(255, 255, 255, 0.95)`,
              transform: `translate(-50%, -50%) rotate(${sp.rotation}deg)`
            }}
          >
            {sp.symbol}
          </span>
        ))}
    </div>
  );
}
