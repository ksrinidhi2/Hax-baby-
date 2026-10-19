import React, { useEffect, useState, useRef } from 'react';
import './CursorEffects.css';
import { useSite } from '../context/SiteContext';

// 6 Exact Pastel Colors Requested by User
const PASTEL_PALETTE = [
  { color: '#FF9EC6', glow: 'rgba(255, 158, 198, 0.85)' }, // Pastel pink
  { color: '#CDA6FF', glow: 'rgba(205, 166, 255, 0.85)' }, // Lavender
  { color: '#8ED8FF', glow: 'rgba(142, 216, 255, 0.85)' }, // Baby blue
  { color: '#98E8C5', glow: 'rgba(152, 232, 197, 0.85)' }, // Mint green
  { color: '#FFC4A3', glow: 'rgba(255, 196, 163, 0.85)' }, // Soft peach
  { color: '#FFE58F', glow: 'rgba(255, 229, 143, 0.85)' }  // Butter yellow
];

// Pure SVG Vector Star Shapes: ✦ (diamond), ✧ (hollow), ★ (five-pointed)
// Completely immune to OS color emoji substitution
const STAR_TYPES = ['four-point', 'hollow', 'five-point'];

function StarSvg({ type, color, size, glow }) {
  if (type === 'hollow') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={{
          filter: `drop-shadow(0 0 3px ${glow}) drop-shadow(0 0 6px rgba(255,255,255,0.9))`
        }}
        aria-hidden="true"
      >
        <path
          d="M12 2 L14.8 9.2 L22 12 L14.8 14.8 L12 22 L9.2 14.8 L2 12 L9.2 9.2 Z"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === 'five-point') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={{
          filter: `drop-shadow(0 0 3px ${glow}) drop-shadow(0 0 6px rgba(255,255,255,0.9))`
        }}
        aria-hidden="true"
      >
        <path
          d="M12 1.5 L15.2 8.3 L22.5 9.2 L17.1 14.2 L18.6 21.5 L12 17.8 L5.4 21.5 L6.9 14.2 L1.5 9.2 L8.8 8.3 Z"
          fill={color}
        />
      </svg>
    );
  }

  // Four-pointed diamond star (✦)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{
        filter: `drop-shadow(0 0 3px ${glow}) drop-shadow(0 0 6px rgba(255,255,255,0.9))`
      }}
      aria-hidden="true"
    >
      <path
        d="M12 1 C12 7 7 12 1 12 C7 12 12 17 12 23 C12 17 17 12 23 12 C17 12 12 7 12 1 Z"
        fill={color}
      />
    </svg>
  );
}

export default function CursorEffects() {
  const { sparklesActive, nightlightCursor, theme } = useSite();
  const [pos, setPos] = useState({ x: -1000, y: -1000 });
  const [sparkles, setSparkles] = useState([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const lastSpawnPosRef = useRef({ x: -1000, y: -1000 });
  const lastSpawnTimeRef = useRef(0);
  const colorIndexRef = useRef(0);
  const starIdCounterRef = useRef(0);

  // Check reduced-motion preference
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);

    const handleMotionChange = (e) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handleMotionChange);

    return () => mql.removeEventListener('change', handleMotionChange);
  }, []);

  // Listen to pointer movement globally
  useEffect(() => {
    const handlePointerMove = (e) => {
      if (e.pointerType === 'touch') return;

      const x = e.clientX;
      const y = e.clientY;
      setPos({ x, y });

      if (sparklesActive && !prefersReducedMotion) {
        const now = performance.now();
        const dist = Math.hypot(x - lastSpawnPosRef.current.x, y - lastSpawnPosRef.current.y);

        // Spawn smoothly on distance (>= 8px) or time (>= 24ms)
        if (dist >= 8 || now - lastSpawnTimeRef.current >= 24) {
          lastSpawnTimeRef.current = now;
          lastSpawnPosRef.current = { x, y };

          // Strictly cycle sequentially through all 6 pastel colors
          const palette = PASTEL_PALETTE[colorIndexRef.current % PASTEL_PALETTE.length];
          colorIndexRef.current++;

          // Cycle or pick star shapes: ✦, ✧, ★
          const starType = STAR_TYPES[starIdCounterRef.current % STAR_TYPES.length];
          const size = Math.floor(Math.random() * 6) + 12; // 12px - 17px delicate size
          const offsetX = (Math.random() - 0.5) * 16;
          const offsetY = (Math.random() - 0.5) * 16;
          const rotation = Math.floor(Math.random() * 360);

          const newSparkle = {
            id: ++starIdCounterRef.current,
            x: x + offsetX,
            y: y + offsetY,
            starType,
            size,
            rotation,
            color: palette.color,
            glow: palette.glow,
            bornAt: now,
            lifetime: 680 // ms lifetime
          };

          setSparkles((prev) => {
            // Keep up to 45 active particles for a luscious, abundant trail
            const slice = prev.length >= 45 ? prev.slice(prev.length - 44) : prev;
            return [...slice, newSparkle];
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

  // Clean up expired sparkles smoothly on a 35ms heartbeat
  useEffect(() => {
    if (sparkles.length === 0) return;

    const interval = setInterval(() => {
      const now = performance.now();
      setSparkles((prev) => prev.filter((sp) => now - sp.bornAt < sp.lifetime));
    }, 35);

    return () => clearInterval(interval);
  }, [sparkles.length]);

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

      {/* 2. Sparkle Cursor Trail: Guaranteed Multi-Color Pastel Stars */}
      {sparklesActive &&
        sparkles.map((sp) => (
          <span
            key={sp.id}
            className="cursor-sparkle-star"
            style={{
              left: `${sp.x}px`,
              top: `${sp.y}px`,
              transform: `translate(-50%, -50%) rotate(${sp.rotation}deg)`
            }}
          >
            <StarSvg
              type={sp.starType}
              color={sp.color}
              size={sp.size}
              glow={sp.glow}
            />
          </span>
        ))}
    </div>
  );
}
