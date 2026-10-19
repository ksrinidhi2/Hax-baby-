import React from 'react';
import './AboutSection.css';
import pipPortraitFrame from '../../assets/pip_portrait_frame.png';
import pipCrawling from '../../assets/pip_crawling_illustration.png';
import iconMusicBox from '../../assets/pip_item_music_box.png';
import iconHoneyMilk from '../../assets/pip_item_honey_milk.png';
import iconNursery from '../../assets/pip_item_nursery.png';
import { useSite } from '../context/SiteContext';

export default function AboutSection() {
  const { bowTickled, triggerTickleBow, playSound } = useSite();

  return (
    <section id="about" className="about-section" aria-label="About Pip">
      {/* 1. Main Dreamy About Window */}
      <div className="about-window retro-window">
        {/* Retro Window Titlebar */}
        <div className="retro-window-titlebar">
          <div className="retro-titlebar-left">
            <span className="retro-titlebar-icon" aria-hidden="true">☁️</span>
            <span className="retro-titlebar-text">About (about.exe)</span>
            <span className="retro-titlebar-star" aria-hidden="true">⭐</span>
          </div>
          <div className="retro-window-controls" aria-hidden="true">
            <button
              type="button"
              className="retro-win-btn"
              onClick={() => playSound && playSound('click')}
              title="Minimize"
              aria-label="Minimize About window"
              tabIndex="-1"
            >
              —
            </button>
            <button
              type="button"
              className="retro-win-btn"
              onClick={() => playSound && playSound('click')}
              title="Maximize"
              aria-label="Maximize About window"
              tabIndex="-1"
            >
              □
            </button>
            <button
              type="button"
              className="retro-win-btn retro-win-btn-close"
              onClick={() => playSound && playSound('click')}
              title="Close"
              aria-label="Close About window"
              tabIndex="-1"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="about-window-body">
          {/* Window Header */}
          <div className="about-window-header">
            <div className="about-header-left">
              <span className="about-header-icon" aria-hidden="true">☁️</span>
              <h2 className="about-header-title">About Pip</h2>
              <span className="about-header-star" aria-hidden="true">⭐</span>
            </div>
            <div className="about-header-right">
              <span className="about-tagline-text">A tiny dreamer with a big heart!</span>
              <span className="about-header-star-small" aria-hidden="true">⭐</span>
              <span className="about-header-moon" aria-hidden="true">🌙</span>
            </div>
          </div>

        {/* 3-Column Content Layout */}
        <div className="about-content-grid">
          {/* Column 1: Left - Framed Polaroid Portrait */}
          <div className="about-col-portrait">
            <div
              className={`polaroid-wrapper ${bowTickled ? 'bow-wiggle' : ''}`}
              onClick={triggerTickleBow}
              title="psst... Pip's bow is ticklish! (Click to tickle ✨)"
              style={{ cursor: 'pointer' }}
            >
              <img
                src={pipPortraitFrame}
                alt="Pip holding a glowing star on a cloud"
                className="polaroid-frame-img"
              />
            </div>
          </div>

          {/* Column 2: Center - Character Description, Tags & Favourite Things */}
          <div className="about-col-center">
            <div className="meet-pip-heading">
              <span className="cloud-symbol" aria-hidden="true">☁️</span>
              <h3 className="meet-pip-title">Meet Pip</h3>
              <span className="star-symbol" aria-hidden="true">⭐</span>
            </div>
            <p className="meet-pip-role">Junior Dream Engineer</p>

            <div className="pip-speech-row">
              <p className="pip-bio-text">
                A tiny dreamer who builds, collects and delivers dreams to sleepy hearts across the world.
                Always curious, always kind, and always dreaming of new friends to share stories with!
              </p>
              <div className="pip-speech-bubble-group">
                <div className="pip-speech-bubble">
                  {bowTickled ? 'Teehee! That tickles! ✨' : "Hi! I'm Pip! Let's be friends! ⭐"}
                </div>
                <img
                  src={pipCrawling}
                  alt="Pip crawling playfully"
                  className={`pip-crawling-img ${bowTickled ? 'bow-wiggle' : ''}`}
                  onClick={triggerTickleBow}
                  title="psst... Pip's bow is ticklish! (Click to tickle ✨)"
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* 4 Personality Tags */}
            <div className="personality-tags-row">
              <span className="personality-tag tag-curious">🔍 Curious</span>
              <span className="personality-tag tag-kind">💖 Kind</span>
              <span className="personality-tag tag-creative">⭐ Creative</span>
              <span className="personality-tag tag-dreaming">☁️ Always Dreaming</span>
            </div>

            {/* Pip's Favourite Things Sub-panel */}
            <div className="fav-things-container">
              <div className="fav-things-header">
                <span className="fav-star" aria-hidden="true">⭐</span>
                <span className="fav-title">Pip's Favourite Things</span>
              </div>
              <div className="fav-things-grid">
                <div className="fav-card">
                  <div className="fav-icon-wrapper">
                    <img src={iconMusicBox} alt="Unicorn Music Box" />
                  </div>
                  <h4 className="fav-card-title">Unicorn Music Box</h4>
                  <p className="fav-card-desc">Plays the sweetest lullabies.</p>
                </div>
                <div className="fav-card">
                  <div className="fav-icon-wrapper">
                    <img src={iconHoneyMilk} alt="Warm Honey Milk" />
                  </div>
                  <h4 className="fav-card-title">Warm Honey Milk</h4>
                  <p className="fav-card-desc">Gives cozy energy for dreamwork.</p>
                </div>
                <div className="fav-card">
                  <div className="fav-icon-wrapper">
                    <img src={iconNursery} alt="Midnight Nursery" />
                  </div>
                  <h4 className="fav-card-title">Midnight Nursery</h4>
                  <p className="fav-card-desc">Pip's home</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Right - Complete Pip's Profile Window */}
          <div className="about-col-profile">
            <div className="profile-retro-window">
              <div className="profile-window-header">
                <div className="profile-header-left">
                  <span className="profile-cloud-icon" aria-hidden="true">☁️</span>
                  <span className="profile-window-title">Pip's Profile</span>
                </div>
                <div className="profile-window-controls" aria-hidden="true">
                  <button type="button" className="win-btn" tabIndex="-1">—</button>
                  <button type="button" className="win-btn" tabIndex="-1">□</button>
                  <button type="button" className="win-btn win-btn-close" tabIndex="-1">✕</button>
                </div>
              </div>

              <dl className="profile-list">
                <div className="profile-row">
                  <dt className="profile-label">
                    <span className="profile-icon">🐻</span>
                    <span>Name:</span>
                  </dt>
                  <dd className="profile-val">Pip</dd>
                </div>

                <div className="profile-row">
                  <dt className="profile-label">
                    <span className="profile-icon">🌙</span>
                    <span>What Pip Is:</span>
                  </dt>
                  <dd className="profile-val">
                    A cute baby with a smooth, round skull face, huge soft eye sockets with cozy glowing
                    pinpricks of light, a tiny crooked smile, and a bedtime nightcap with stars and a little pink bow.
                  </dd>
                </div>

                <div className="profile-row">
                  <dt className="profile-label">
                    <span className="profile-icon">⭐</span>
                    <span>Personality:</span>
                  </dt>
                  <dd className="profile-val">
                    Curious, sleepy, a little clumsy, easily delighted. Giggles at everything and hates silence.
                  </dd>
                </div>

                <div className="profile-row">
                  <dt className="profile-label">
                    <span className="profile-icon">📖</span>
                    <span>Profession:</span>
                  </dt>
                  <dd className="profile-val">
                    Junior Dream Engineer at the Midnight Nursery. Pip designs the dreams, lullabies,
                    nightlights, and bedtime stories that help the neighbourhood's little ghosts and creatures fall asleep.
                  </dd>
                </div>

                <div className="profile-row profile-row-tagline">
                  <dt className="profile-label">
                    <span className="profile-icon">💖</span>
                    <span>Tagline:</span>
                  </dt>
                  <dd className="profile-val profile-tagline-val">
                    “I build the dreams you fall asleep inside.”
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Inspirational Quote */}
        <div className="about-inspirational-quote">
          “Every dream, no matter how small, makes the world a little brighter.”
        </div>
        </div>
      </div>
    </section>
  );
}
