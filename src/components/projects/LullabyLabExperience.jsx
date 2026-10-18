import React, { useState, useEffect, useRef } from 'react';
import './LullabyLabExperience.css';
import lullabyPipImg from '../../../assets/project_lullaby_lab.png';
import musicBoxImg from '../../../assets/pip_item_music_box.png';
import { useSite } from '../../context/SiteContext';

const LULLABY_TRACKS = [
  {
    id: 'twinkling-music-box',
    title: 'Twinkling Music Box',
    icon: '🎵',
    mood: 'Sweet & Nostalgic',
    description: 'Crisp celesta chimes playing a gentle pentatonic lullaby, like wind-up toy stars.',
    durationSec: 24,
    notes: [523.25, 587.33, 659.25, 783.99, 880.00, 783.99, 659.25, 587.33, 523.25, 659.25, 880.00, 1046.50, 880.00, 783.99, 659.25, 523.25],
    noteTimes: [0, 0.75, 1.5, 2.25, 3.0, 3.75, 4.5, 5.25, 6.0, 6.75, 7.5, 8.25, 9.0, 9.75, 10.5, 11.25]
  },
  {
    id: 'cloud-cradle',
    title: 'Cloud Cradle Lullaby',
    icon: '☁️',
    mood: 'Soft & Floating',
    description: 'Warm, slow sine chords drifting gently across moonlit sky cushions.',
    durationSec: 28,
    notes: [349.23, 440.00, 523.25, 659.25, 523.25, 440.00, 392.00, 493.88, 587.33, 493.88, 349.23, 440.00, 523.25, 698.46, 659.25, 523.25],
    noteTimes: [0, 1.0, 2.0, 3.0, 4.5, 5.5, 7.0, 8.0, 9.0, 10.5, 12.0, 13.0, 14.5, 16.0, 17.5, 19.0]
  },
  {
    id: 'moonlit-whispers',
    title: 'Moonlit Whispers',
    icon: '🌙',
    mood: 'Dreamy & Peaceful',
    description: 'Ethereal bells accompanied by quiet midnight resonance for the deepest sleep.',
    durationSec: 32,
    notes: [440.00, 554.37, 659.25, 880.00, 740.00, 659.25, 554.37, 440.00, 493.88, 622.25, 740.00, 659.25, 554.37, 440.00],
    noteTimes: [0, 1.2, 2.4, 3.8, 5.2, 6.6, 8.0, 9.6, 11.0, 12.5, 14.0, 15.6, 17.2, 19.0]
  },
  {
    id: 'stardust-rain',
    title: 'Stardust Rain & Ocean Breeze',
    icon: '🌧️',
    mood: 'Warm & Calming',
    description: 'Gentle water drops and sleepy filtered chimes cascading like gentle rain on the roof.',
    durationSec: 26,
    notes: [587.33, 659.25, 783.99, 987.77, 880.00, 783.99, 659.25, 587.33, 523.25, 659.25, 783.99, 659.25, 587.33, 440.00],
    noteTimes: [0, 0.8, 1.6, 2.6, 3.6, 4.6, 5.8, 7.0, 8.2, 9.4, 10.8, 12.0, 13.4, 15.0]
  },
  {
    id: 'midnight-nursery-song',
    title: 'Midnight Nursery Anthem',
    icon: '⭐',
    mood: 'Pip’s Favorite',
    description: 'Pip’s comforting goodnight lullaby played by the nursery’s magical golden clock.',
    durationSec: 30,
    notes: [523.25, 659.25, 783.99, 1046.50, 987.77, 783.99, 880.00, 659.25, 587.33, 523.25, 659.25, 783.99, 523.25],
    noteTimes: [0, 1.0, 2.0, 3.2, 4.5, 5.8, 7.0, 8.5, 10.0, 11.5, 13.0, 14.5, 16.5]
  }
];

const INTERACTIVE_BELLS = [
  { note: 'C5', freq: 523.25, label: 'Do', color: '#ffb3c6' },
  { note: 'D5', freq: 587.33, label: 'Re', color: '#ffcbf2' },
  { note: 'E5', freq: 659.25, label: 'Mi', color: '#e2afff' },
  { note: 'F5', freq: 698.46, label: 'Fa', color: '#b9fbc0' },
  { note: 'G5', freq: 783.99, label: 'Sol', color: '#98f5e1' },
  { note: 'A5', freq: 880.00, label: 'La', color: '#8eecf5' },
  { note: 'B5', freq: 987.77, label: 'Ti', color: '#90dbf4' },
  { note: 'C6', freq: 1046.50, label: 'High Do', color: '#fde4cf' }
];

export default function LullabyLabExperience({ onBack }) {
  const { isMuted } = useSite();
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [activeBell, setActiveBell] = useState(null);

  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const scheduledTimeoutsRef = useRef([]);
  const progressTimerRef = useRef(null);
  const trackStartTimeRef = useRef(0);
  const pauseOffsetRef = useRef(0);

  const currentTrack = LULLABY_TRACKS[selectedTrackIndex];

  // Synchronize master gain with global mute state and local volume slider
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      const targetGain = isMuted ? 0 : volume;
      masterGainRef.current.gain.setValueAtTime(targetGain, audioCtxRef.current.currentTime);
    }
  }, [isMuted, volume]);

  // Initialize or get Web Audio Context
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
        const masterGain = audioCtxRef.current.createGain();
        const initialGain = isMuted ? 0 : volume;
        masterGain.gain.setValueAtTime(initialGain, audioCtxRef.current.currentTime);
        masterGain.connect(audioCtxRef.current.destination);
        masterGainRef.current = masterGain;
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Play a single soft music-box note
  const playChimeNote = (freq, duration = 1.2, customVolume = 0.5) => {
    const ctx = getAudioContext();
    if (!ctx || !masterGainRef.current) return;

    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Warm music box celesta: sine with slight harmonic overtone
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Warm low-pass filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 3.5, ctx.currentTime);

    // Envelope: quick attack, natural exponential chime decay
    const now = ctx.currentTime;
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(customVolume, now + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(masterGainRef.current);

    osc.start(now);
    osc.stop(now + duration);
  };

  // Clear all scheduled melody timeouts
  const clearScheduledNotes = () => {
    scheduledTimeoutsRef.current.forEach((t) => clearTimeout(t));
    scheduledTimeoutsRef.current = [];
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };

  // Schedule a melody loop
  const scheduleTrackLoop = (track, startOffset = 0) => {
    clearScheduledNotes();
    const ctx = getAudioContext();
    if (!ctx) return;

    const totalDuration = track.durationSec * 1000;
    const notesCount = track.notes.length;

    // Schedule all notes relative to startOffset
    for (let i = 0; i < notesCount; i++) {
      const noteDelayMs = track.noteTimes[i] * 1000 - startOffset;
      if (noteDelayMs >= 0) {
        const tId = setTimeout(() => {
          playChimeNote(track.notes[i], 1.5, 0.45);
        }, noteDelayMs);
        scheduledTimeoutsRef.current.push(tId);
      }
    }

    // Schedule loop continuation
    const remainingTrackMs = totalDuration - startOffset;
    const loopTimeout = setTimeout(() => {
      pauseOffsetRef.current = 0;
      trackStartTimeRef.current = Date.now();
      scheduleTrackLoop(track, 0);
    }, remainingTrackMs);
    scheduledTimeoutsRef.current.push(loopTimeout);

    // Progress counter timer
    progressTimerRef.current = setInterval(() => {
      const elapsed = (Date.now() - trackStartTimeRef.current) / 1000;
      setPlaybackTime(elapsed % track.durationSec);
    }, 150);
  };

  // Start Playing
  const handlePlay = () => {
    getAudioContext();
    setIsPlaying(true);
    setIsPaused(false);
    trackStartTimeRef.current = Date.now() - pauseOffsetRef.current * 1000;
    scheduleTrackLoop(currentTrack, pauseOffsetRef.current * 1000);
  };

  // Pause
  const handlePause = () => {
    clearScheduledNotes();
    setIsPlaying(false);
    setIsPaused(true);
    const elapsed = (Date.now() - trackStartTimeRef.current) / 1000;
    pauseOffsetRef.current = elapsed % currentTrack.durationSec;
    setPlaybackTime(pauseOffsetRef.current);
  };

  // Stop
  const handleStop = () => {
    clearScheduledNotes();
    setIsPlaying(false);
    setIsPaused(false);
    pauseOffsetRef.current = 0;
    setPlaybackTime(0);
  };

  // Switch Track
  const handleSelectTrack = (index) => {
    if (index === selectedTrackIndex && (isPlaying || isPaused)) return;
    clearScheduledNotes();
    setSelectedTrackIndex(index);
    pauseOffsetRef.current = 0;
    setPlaybackTime(0);

    if (isPlaying) {
      trackStartTimeRef.current = Date.now();
      scheduleTrackLoop(LULLABY_TRACKS[index], 0);
    }
  };

  // Volume Change
  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(newVol, audioCtxRef.current.currentTime);
    }
  };

  // Interactive Bell Click
  const handleBellClick = (bell) => {
    playChimeNote(bell.freq, 1.8, 0.6);
    setActiveBell(bell.note);
    setTimeout(() => setActiveBell(null), 300);
  };

  // Format time MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      clearScheduledNotes();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try {
          audioCtxRef.current.close();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  return (
    <div className="project-experience-container lullaby-lab-experience" aria-label="The Lullaby Lab Experience">
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

        <div className="experience-badge">
          <span className="badge-icon">🎵</span> Project 01 · Full Experience
        </div>
      </div>

      {/* Main Experience Window */}
      <div className="lullaby-window">
        {/* Header Hero */}
        <div className="lullaby-header">
          <div className="lullaby-header-text">
            <div className="lullaby-title-row">
              <span className="lullaby-icon" aria-hidden="true">🎵</span>
              <h1 className="lullaby-title">The Lullaby Lab</h1>
              <span className="lullaby-star-sparkle" aria-hidden="true">✨</span>
            </div>
            <p className="lullaby-subtitle">
              Step inside Pip’s cozy music workshop! Compose, play, and blend soothing lullabies generated live
              with warm synthesized music-box chimes.
            </p>
          </div>

          <div className="lullaby-header-art">
            <img
              src={lullabyPipImg}
              alt="Pip with magical glowing music box"
              className="lullaby-header-pip"
            />
          </div>
        </div>

        {/* Player Stage Layout */}
        <div className="lullaby-player-grid">
          {/* Left Column: Player Console & Visualizer */}
          <div className="lullaby-player-card">
            <div className="player-deck-header">
              <div className="turntable-disc-wrapper">
                <div className={`music-box-disc ${isPlaying ? 'is-spinning' : ''}`}>
                  <img src={musicBoxImg} alt="Magic Music Box" className="music-box-center-icon" />
                </div>
                {isPlaying && (
                  <div className="floating-musical-notes" aria-hidden="true">
                    <span className="floating-note note-1">♪</span>
                    <span className="floating-note note-2">♫</span>
                    <span className="floating-note note-3">♩</span>
                    <span className="floating-note note-4">✨</span>
                  </div>
                )}
              </div>

              <div className="now-playing-meta">
                <span className="now-playing-tag">
                  {isPlaying ? 'Now Playing 🎶' : isPaused ? 'Paused ⏸️' : 'Ready to Play ⭐'}
                </span>
                <h2 className="now-playing-title">{currentTrack.title}</h2>
                <span className="now-playing-mood">{currentTrack.mood}</span>
                <p className="now-playing-desc">{currentTrack.description}</p>
              </div>
            </div>

            {/* Live Waveform Equalizer Visualizer */}
            <div className="lullaby-visualizer-bar" aria-hidden="true">
              {[40, 75, 50, 90, 60, 85, 45, 100, 65, 80, 55, 95, 70, 50, 85, 60, 40].map((h, i) => (
                <span
                  key={i}
                  className={`eq-bar ${isPlaying ? 'is-animating' : ''}`}
                  style={{
                    '--base-height': `${h}%`,
                    animationDelay: `${(i * 0.08).toFixed(2)}s`
                  }}
                />
              ))}
            </div>

            {/* Time / Progress Bar */}
            <div className="playback-scrubber-row">
              <span className="scrubber-time">{formatTime(playbackTime)}</span>
              <div className="scrubber-track">
                <div
                  className="scrubber-fill"
                  style={{ width: `${(playbackTime / currentTrack.durationSec) * 100}%` }}
                />
              </div>
              <span className="scrubber-time">{formatTime(currentTrack.durationSec)}</span>
            </div>

            {/* Transport Buttons: Play, Pause, Resume, Stop */}
            <div className="player-transport-controls">
              {!isPlaying ? (
                <button
                  type="button"
                  onClick={handlePlay}
                  className="btn transport-btn transport-btn-play"
                  aria-label={isPaused ? 'Resume Lullaby' : 'Play Lullaby'}
                >
                  <span className="btn-icon">▶</span> {isPaused ? 'Resume' : 'Play Lullaby'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePause}
                  className="btn transport-btn transport-btn-pause"
                  aria-label="Pause Lullaby"
                >
                  <span className="btn-icon">⏸</span> Pause
                </button>
              )}

              <button
                type="button"
                onClick={handleStop}
                disabled={!isPlaying && !isPaused && playbackTime === 0}
                className="btn transport-btn transport-btn-stop"
                aria-label="Stop Lullaby"
              >
                <span className="btn-icon">⏹</span> Stop
              </button>
            </div>

            {/* Volume Control */}
            <div className="volume-control-panel">
              <span className="volume-icon" aria-hidden="true">
                {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
              </span>
              <label htmlFor="lullaby-volume-slider" className="volume-label">
                Volume: <strong>{Math.round(volume * 100)}%</strong>
              </label>
              <input
                id="lullaby-volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
                aria-label="Adjust lullaby volume"
              />
            </div>
          </div>

          {/* Right Column: Track Playlist & Interactive Bells */}
          <div className="lullaby-sidebar-card">
            {/* Track Selector List */}
            <div className="playlist-panel">
              <h3 className="playlist-heading">
                <span>🎵</span> Selectable Lullabies ({LULLABY_TRACKS.length})
              </h3>
              <div className="playlist-items">
                {LULLABY_TRACKS.map((t, idx) => {
                  const isCurrent = idx === selectedTrackIndex;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleSelectTrack(idx)}
                      className={`playlist-item-btn ${isCurrent ? 'is-selected' : ''}`}
                      aria-label={`Select track ${t.title}`}
                    >
                      <span className="track-list-icon">{t.icon}</span>
                      <div className="track-list-info">
                        <strong className="track-list-name">{t.title}</strong>
                        <span className="track-list-desc">{t.mood}</span>
                      </div>
                      <div className="track-list-status">
                        {isCurrent && isPlaying ? (
                          <span className="playing-pulse-badge">Playing 🎶</span>
                        ) : (
                          <span className="duration-pill">{t.durationSec}s</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Music Box Bells */}
            <div className="interactive-bells-card">
              <div className="bells-header">
                <span className="bells-icon" aria-hidden="true">🔔</span>
                <div>
                  <h4 className="bells-title">Play Your Own Chimes</h4>
                  <p className="bells-desc">Click or tap any chime to synthesize gentle celesta notes!</p>
                </div>
              </div>

              <div className="bells-grid" role="group" aria-label="Interactive Celesta Chimes">
                {INTERACTIVE_BELLS.map((bell) => (
                  <button
                    key={bell.note}
                    type="button"
                    onClick={() => handleBellClick(bell)}
                    className={`bell-key ${activeBell === bell.note ? 'is-active' : ''}`}
                    style={{ '--bell-color': bell.color }}
                    aria-label={`Play chime ${bell.note} (${bell.label})`}
                  >
                    <span className="bell-symbol">⭐</span>
                    <strong className="bell-note-name">{bell.note}</strong>
                    <span className="bell-solfege">{bell.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
