import React, { useMemo } from 'react';
import './ChaosDecorations.css';

const PASTEL_COLORS = [
  '#FF9EC6', // pastel pink
  '#CDA6FF', // lavender
  '#8ED8FF', // baby blue
  '#98E8C5', // mint green
  '#FFC4A3', // soft peach
  '#FFE58F'  // butter yellow
];

const STAR_SHAPES = ['✦', '★', '✧', '✨', '⭐'];

export default function ChaosDecorations() {
  // Generate a stable set of 20 floating pastel stars across the screen
  const stars = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => {
      const color = PASTEL_COLORS[i % PASTEL_COLORS.length];
      const shape = STAR_SHAPES[i % STAR_SHAPES.length];
      const left = Math.round(5 + (i * 4.7) % 90);
      const top = Math.round(8 + (i * 7.3) % 84);
      const size = 12 + (i % 4) * 4;
      const duration = 3.5 + (i % 5) * 0.7;
      const delay = (i % 6) * 0.4;
      const rotate = (i % 8) * 45;

      return {
        id: i,
        shape,
        color,
        left,
        top,
        size,
        duration,
        delay,
        rotate
      };
    });
  }, []);

  return (
    <div className="chaos-decorations-layer" aria-hidden="true">
      {stars.map((star) => (
        <span
          key={star.id}
          className="chaos-floating-star"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            fontSize: `${star.size}px`,
            color: star.color,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
            transform: `rotate(${star.rotate}deg)`
          }}
        >
          {star.shape}
        </span>
      ))}
    </div>
  );
}
