import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  // 1. Theme State (Day / Night)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('pip_theme') || 'day';
  });

  // 2. Sound & Global Mute State
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('pip_muted') === 'true';
  });

  // 3. Chaos Mode State
  const [isChaosMode, setIsChaosMode] = useState(false);

  // 4. Sparkle Cursor Trail State
  const [sparklesActive, setSparklesActive] = useState(() => {
    return localStorage.getItem('pip_sparkles') !== 'false';
  });

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

    localStorage.setItem('pip_theme', theme);
  }, [theme]);

  // Apply Chaos Mode class to body
  useEffect(() => {
    const body = document.body;
    if (isChaosMode) {
      body.classList.add('chaos-mode-active');
    } else {
      body.classList.remove('chaos-mode-active');
    }
    return () => {
      body.classList.remove('chaos-mode-active');
    };
  }, [isChaosMode]);

  // Persist Mute Preference
  useEffect(() => {
    localStorage.setItem('pip_muted', isMuted ? 'true' : 'false');
  }, [isMuted]);

  // Persist Sparkles Preference
  useEffect(() => {
    localStorage.setItem('pip_sparkles', sparklesActive ? 'true' : 'false');
  }, [sparklesActive]);

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
  const playSoundEffect = (type) => {
    if (isMuted) return;

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
        osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.06);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
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
        // Whimsical bounce sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(392.00, now);
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.25);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch {
      // Audio not permitted or supported
    }
  };

  // Toggle Theme Handler
  const toggleTheme = () => {
    playSoundEffect('toggle');
    setTheme((prev) => (prev === 'day' ? 'night' : 'day'));
  };

  // Toggle Mute Handler
  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (!next) {
        // Unmuting: play a subtle unmuted notification beep
        setTimeout(() => playSoundEffect('click'), 20);
      }
      return next;
    });
  };

  // Toggle Chaos Mode
  const toggleChaosMode = () => {
    playSoundEffect('chaos');
    setIsChaosMode((prev) => !prev);
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
    playSoundEffect
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
