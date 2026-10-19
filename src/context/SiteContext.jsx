import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  // 1. Theme State (Day / Night)
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('pip_theme') || 'day';
    } catch {
      return 'day';
    }
  });

  // 2. Sound & Global Mute State
  const [isMuted, setIsMuted] = useState(() => {
    try {
      return localStorage.getItem('pip_muted') === 'true';
    } catch {
      return false;
    }
  });
  const isMutedRef = useRef(isMuted);

  useEffect(() => {
    isMutedRef.current = isMuted;
    try {
      localStorage.setItem('pip_muted', isMuted ? 'true' : 'false');
    } catch {
      // ignore
    }
  }, [isMuted]);

  // 3. Chaos Mode State
  const [isChaosMode, setIsChaosMode] = useState(false);

  // 4. Sparkle Cursor Trail State
  const [sparklesActive, setSparklesActive] = useState(true);

  // 5. Nightlight Cursor Glow State
  const [nightlightCursor, setNightlightCursor] = useState(true);

  // 6. Returning Visitor State
  const [isReturningVisitor, setIsReturningVisitor] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);

  // 7. Ticklish Bow Easter Egg State
  const [bowTickled, setBowTickled] = useState(false);
  const bowTimeoutRef = useRef(null);

  // 8. Mini-game modal state
  const [isMiniGameOpen, setIsMiniGameOpen] = useState(false);

  // Audio Context Ref for global sound effects
  const globalAudioCtxRef = useRef(null);

  // Apply Theme to document root & body
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (theme === 'night') {
      root.classList.add('theme-night');
      body.classList.add('theme-night');
      root.classList.remove('theme-day');
      body.classList.remove('theme-day');
    } else {
      root.classList.add('theme-day');
      body.classList.add('theme-day');
      root.classList.remove('theme-night');
      body.classList.remove('theme-night');
    }

    try {
      localStorage.setItem('pip_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  // Apply Chaos Mode class to body and documentElement
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (isChaosMode) {
      root.classList.add('chaos-mode-active');
      body.classList.add('chaos-mode-active');
    } else {
      root.classList.remove('chaos-mode-active');
      body.classList.remove('chaos-mode-active');
    }
    return () => {
      root.classList.remove('chaos-mode-active');
      body.classList.remove('chaos-mode-active');
    };
  }, [isChaosMode]);

  // Returning visitor check
  useEffect(() => {
    try {
      const visited = localStorage.getItem('pip_has_visited');
      if (visited) {
        setIsReturningVisitor(true);
        setShowGreeting(true);
      } else {
        localStorage.setItem('pip_has_visited', 'true');
        setIsReturningVisitor(false);
        setShowGreeting(true);
      }
    } catch {
      // Ignore if localStorage unavailable
    }
  }, []);

  // Web Audio Synthesizer for UI sound effects (respects global mute)
  const playSoundEffect = (type, forcePlay = false) => {
    if (isMutedRef.current && !forcePlay) return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (!globalAudioCtxRef.current) {
        globalAudioCtxRef.current = new AudioCtx();
      }
      const ctx = globalAudioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      if (type === 'tickle') {
        // Playful giggling chime arpeggio: C6, E6, G6, C7
        const freqs = [1046.50, 1318.51, 1567.98, 2093.00, 1567.98, 2093.00];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);

          gain.gain.setValueAtTime(0.0001, now + idx * 0.08);
          gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.16);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.17);
        });
      } else if (type === 'click' || type === 'toggle') {
        // Soft bubble pop / toggle click
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.07);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'unmute') {
        // Joyful two-tone rising chime to clearly confirm audio unmuted
        const notes = [659.25, 880.00];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);

          gain.gain.setValueAtTime(0.001, now + idx * 0.1);
          gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.1 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 0.22);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.23);
        });
      } else if (type === 'star') {
        // Magical twinkle chime
        const freqs = [783.99, 1046.50, 1318.51];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);

          gain.gain.setValueAtTime(0.001, now + idx * 0.07);
          gain.gain.linearRampToValueAtTime(0.14, now + idx * 0.07 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.35);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.36);
        });
      } else if (type === 'chaos') {
        // Whimsical playful chime arpeggio: G4, C5, E5, G5, C6
        const freqs = [392.00, 523.25, 659.25, 783.99, 1046.50];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.05);

          gain.gain.setValueAtTime(0.001, now + idx * 0.05);
          gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.05 + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.22);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.05);
          osc.stop(now + idx * 0.05 + 0.23);
        });
      }
    } catch {
      // Audio not permitted or supported
    }
  };

  // Toggle Theme Handler
  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'day' ? 'night' : 'day';
      try {
        localStorage.setItem('pip_theme', next);
      } catch {
        // ignore
      }
      playSoundEffect('toggle');
      return next;
    });
  };

  // Toggle Mute Handler
  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      isMutedRef.current = next;
      try {
        localStorage.setItem('pip_muted', next ? 'true' : 'false');
      } catch {
        // ignore
      }
      if (!next) {
        // Play clear chime confirming unmuted sound
        setTimeout(() => playSoundEffect('unmute', true), 20);
      }
      return next;
    });
  };

  // Toggle Chaos Mode
  const toggleChaosMode = () => {
    setIsChaosMode((prev) => {
      const next = !prev;
      if (next) {
        playSoundEffect('chaos');
      } else {
        playSoundEffect('click');
      }
      return next;
    });
  };

  // Toggle Sparkles
  const toggleSparkles = () => {
    playSoundEffect('star');
    setSparklesActive((prev) => !prev);
  };

  // Trigger Tickle Bow Easter Egg
  const triggerTickleBow = () => {
    playSoundEffect('tickle');
    setBowTickled(true);

    if (bowTimeoutRef.current) {
      clearTimeout(bowTimeoutRef.current);
    }
    bowTimeoutRef.current = setTimeout(() => {
      setBowTickled(false);
    }, 2800);
  };

  const openMiniGame = () => {
    playSoundEffect('star');
    setIsMiniGameOpen(true);
  };

  const closeMiniGame = () => {
    playSoundEffect('click');
    setIsMiniGameOpen(false);
  };

  const value = {
    theme,
    toggleTheme,
    isMuted,
    toggleMute,
    isChaosMode,
    toggleChaosMode,
    sparklesActive,
    toggleSparkles,
    nightlightCursor,
    setNightlightCursor,
    isReturningVisitor,
    showGreeting,
    setShowGreeting,
    bowTickled,
    triggerTickleBow,
    isMiniGameOpen,
    openMiniGame,
    closeMiniGame,
    playSoundEffect,
    playSound: playSoundEffect
  };

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
}
