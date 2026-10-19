import React, { useState } from 'react';
import './StorySection.css';
import headerPipImg from '../../assets/story_header_pip.png';
import imgChapter1 from '../../assets/story_chapter_1.png';
import imgChapter2 from '../../assets/story_chapter_2.png';
import imgChapter3 from '../../assets/story_chapter_3.png';
import imgChapter4 from '../../assets/story_chapter_4.png';
import { useSite } from '../context/SiteContext';

const CHAPTERS_DATA = [
  {
    id: 1,
    number: '01',
    title: 'A Lonely Star',
    subtitle: 'A tiny star has lost its way.',
    storyTitle: 'A tiny star has lost its way.',
    storyParagraphs: [
      'One quiet night, Pip notices a little star floating alone in the sky. It looks confused and a bit sad, separated from its constellation.',
      'Pip feels a gentle tug in its heart. What if this star, and many others like it, need help finding a place to shine? This is where Pip’s journey begins...'
    ],
    image: imgChapter1,
    imageAlt: 'Pip sitting on a stone balcony watching a glowing smiling star in the night sky'
  },
  {
    id: 2,
    number: '02',
    title: 'A Special Idea',
    subtitle: 'Pip realises he can create dreams.',
    storyTitle: 'Pip realises he can create dreams.',
    storyParagraphs: [
      'Pip wonders, what if this star could become a dream?',
      'With a little creativity, a lot of curiosity, and a sprinkle of stardust, Pip creates a soft, glowing dream inside a tiny lantern.',
      'The star is no longer alone — it has a new purpose, and so does Pip.'
    ],
    image: imgChapter2,
    imageAlt: 'Pip working at a wooden desk with a glowing star and open notebook'
  },
  {
    id: 3,
    number: '03',
    title: 'The Observatory',
    subtitle: 'Pip builds a cozy home at the Midnight Nursery.',
    storyTitle: 'Pip builds a cozy home at the Midnight Nursery.',
    storyParagraphs: [
      'Pip finds a special place high above the town — the Midnight Nursery.',
      'Here, Pip builds a cozy observatory and workshop to design dreams, collect starlight, and prepare for dream deliveries.',
      'Surrounded by clouds, twinkling stars and new friends, Pip finally feels at home.'
    ],
    image: imgChapter3,
    imageAlt: 'Pip and bunny outside a magical domed celestial observatory'
  },
  {
    id: 4,
    number: '04',
    title: 'The First Delivery',
    subtitle: 'Pip delivers his first dream and begins his journey.',
    storyTitle: 'Pip delivers his first dream and begins his journey.',
    storyParagraphs: [
      'With the dream safely inside a glowing lantern, Pip sets off on its first delivery.',
      'Flying over rooftops and through clouds, Pip brings the dream to a little home, filling the night with a little more light, comfort and hope.',
      'From that day on, Pip continues to create and deliver dreams, becoming the Junior Dream Engineer of the Midnight Nursery.'
    ],
    image: imgChapter4,
    imageAlt: 'Pip flying in a hot air balloon over sleeping village rooftops holding a shining star'
  }
];

export default function StorySection() {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const { playSound } = useSite();

  const currentChapter = CHAPTERS_DATA[activeChapterIndex] || CHAPTERS_DATA[0];
  const isFirstChapter = activeChapterIndex === 0;
  const isLastChapter = activeChapterIndex === CHAPTERS_DATA.length - 1;

  const handleSelectChapter = (idx) => {
    if (idx >= 0 && idx < CHAPTERS_DATA.length) {
      setActiveChapterIndex(idx);
      if (playSound) playSound('click');
    }
  };

  const goToPrev = () => {
    if (activeChapterIndex > 0) {
      setActiveChapterIndex((prev) => prev - 1);
      if (playSound) playSound('click');
    }
  };

  const goToNext = () => {
    if (activeChapterIndex < CHAPTERS_DATA.length - 1) {
      setActiveChapterIndex((prev) => prev + 1);
      if (playSound) playSound('click');
    }
  };

  const handleFinalAction = () => {
    if (playSound) playSound('click');
    // Scroll smoothly to guestbook
    const guestbookEl = document.getElementById('guestbook');
    if (guestbookEl) {
      guestbookEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="story" className="story-section" aria-label="Pip's Story">
      {/* Main Storybook Window */}
      <div className="story-window retro-window">
        {/* Retro Window Titlebar */}
        <div className="retro-window-titlebar">
          <div className="retro-titlebar-left">
            <span className="retro-titlebar-icon" aria-hidden="true">📖</span>
            <span className="retro-titlebar-text">Story (story.exe)</span>
            <span className="retro-titlebar-star" aria-hidden="true">⭐</span>
          </div>
          <div className="retro-window-controls" aria-hidden="true">
            <button
              type="button"
              className="retro-win-btn"
              onClick={() => playSound && playSound('click')}
              title="Minimize"
              aria-label="Minimize Story window"
              tabIndex="-1"
            >
              —
            </button>
            <button
              type="button"
              className="retro-win-btn"
              onClick={() => playSound && playSound('click')}
              title="Maximize"
              aria-label="Maximize Story window"
              tabIndex="-1"
            >
              □
            </button>
            <button
              type="button"
              className="retro-win-btn retro-win-btn-close"
              onClick={() => playSound && playSound('click')}
              title="Close"
              aria-label="Close Story window"
              tabIndex="-1"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="story-window-body">
          {/* Header Bar */}
          <div className="story-window-header">
            <div className="story-header-left">
              <div className="story-title-row">
                <span className="story-book-icon" aria-hidden="true">📖</span>
                <h2 className="story-title">Pip's Story</h2>
                <span className="story-star-icon" aria-hidden="true">⭐</span>
              </div>
              <p className="story-subtitle">
                A little journey filled with stars, friendship and dreams.<br />
                Explore how Pip found its purpose and became a Junior Dream Engineer.
              </p>
            </div>

            <div className="story-header-right">
              <img
                src={headerPipImg}
                alt="Pip with bunny plushie on clouds: Every big dream starts with a small star!"
                className="story-header-pip-img"
              />
            </div>
          </div>

        {/* 2-Column Storybook Layout */}
        <div className="story-main-layout">
          {/* Left Column: Chapters Navigation List */}
          <aside className="story-sidebar" aria-label="Chapter selection">
            <div className="story-sidebar-header">
              <span className="sidebar-cloud-icon" aria-hidden="true">☁️</span>
              <h3 className="sidebar-heading">Chapters</h3>
              <span className="sidebar-star-icon" aria-hidden="true">⭐</span>
            </div>

            <nav className="story-chapters-list" aria-label="Chapters">
              {CHAPTERS_DATA.map((ch, idx) => {
                const isActive = idx === activeChapterIndex;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => handleSelectChapter(idx)}
                    className={`story-chapter-card ${isActive ? 'is-active' : ''}`}
                    aria-current={isActive ? 'step' : undefined}
                  >
                    <span className="chapter-card-number">{ch.number}</span>
                    <div className="chapter-card-thumbnail">
                      <img src={ch.image} alt="" aria-hidden="true" />
                    </div>
                    <div className="chapter-card-info">
                      <h4 className="chapter-card-title">{ch.title}</h4>
                      <p className="chapter-card-desc">{ch.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Right Column: Active Chapter Reading Area */}
          <main className="story-reading-panel">
            {/* Top Bar: Chapter Pill & Title + Page Counter & Arrows */}
            <div className="story-panel-header">
              <div className="story-panel-header-left">
                <span className="story-panel-pill">{currentChapter.number}</span>
                <h3 className="story-panel-title">{currentChapter.title}</h3>
              </div>

              <div className="story-panel-header-right">
                <span className="story-page-counter" aria-live="polite">
                  {currentChapter.id}/{CHAPTERS_DATA.length}
                </span>
                <div className="story-nav-arrows">
                  <button
                    type="button"
                    onClick={goToPrev}
                    disabled={isFirstChapter}
                    className="story-arrow-btn"
                    aria-label="Previous Chapter"
                  >
                    &lt;
                  </button>
                  <button
                    type="button"
                    onClick={goToNext}
                    disabled={isLastChapter}
                    className="story-arrow-btn"
                    aria-label="Next Chapter"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>

            {/* Reading Progress Indicator */}
            <div
              className="story-progress-bar-track"
              role="progressbar"
              aria-valuenow={activeChapterIndex + 1}
              aria-valuemin="1"
              aria-valuemax={CHAPTERS_DATA.length}
              aria-label={`Chapter ${activeChapterIndex + 1} of ${CHAPTERS_DATA.length}`}
            >
              <div
                className="story-progress-bar-fill"
                style={{ width: `${((activeChapterIndex + 1) / CHAPTERS_DATA.length) * 100}%` }}
              />
            </div>

            {/* Inner Content: Left Illustration + Right Story Prose & Navigation Button */}
            <div className="story-panel-body">
              {/* Left Side: Large Illustration */}
              <div className="story-artwork-container">
                <img
                  key={currentChapter.id}
                  src={currentChapter.image}
                  alt={currentChapter.imageAlt}
                  className="story-artwork-img"
                />
              </div>

              {/* Right Side: Chapter Headline & Story Text & Next Button */}
              <div className="story-prose-container">
                <div className="story-prose-header">
                  <h4 className="story-prose-title">{currentChapter.storyTitle}</h4>
                  <div className="story-prose-decorations" aria-hidden="true">
                    <span className="story-star-sparkle">⭐</span>
                    <span className="story-cloud-sparkle">☁️</span>
                  </div>
                </div>

                <div className="story-prose-paragraphs">
                  {currentChapter.storyParagraphs.map((para, pIdx) => (
                    <p key={pIdx} className="story-paragraph">{para}</p>
                  ))}
                </div>

                <div className="story-prose-action">
                  {!isLastChapter ? (
                    <button
                      type="button"
                      onClick={goToNext}
                      className="btn story-action-btn story-btn-next"
                    >
                      Next Chapter →
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleFinalAction}
                      className="btn story-action-btn story-btn-adventure"
                    >
                      Start the Adventure! →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
        </div>
      </div>
    </section>
  );
}
