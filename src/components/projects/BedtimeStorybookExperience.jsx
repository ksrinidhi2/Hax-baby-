import React, { useState } from 'react';
import './BedtimeStorybookExperience.css';
import coverBookImg from '../../../assets/project_bedtime_storybook.png';
import ch1Img from '../../../assets/story_chapter_1.png';
import ch2Img from '../../../assets/story_chapter_2.png';
import ch3Img from '../../../assets/story_chapter_3.png';
import ch4Img from '../../../assets/story_chapter_4.png';
import pipPortraitImg from '../../../assets/pip_portrait.png';
import { useSite } from '../../context/SiteContext';

const STORIES = [
  {
    id: 'chapter-1',
    number: 1,
    title: 'The Lonely Starlight',
    subtitle: 'A Fallen Star Finds Its Family',
    badge: 'Chapter 01',
    icon: '⭐',
    image: ch1Img,
    imageAlt: 'Pip finding the little shivering star in the observatory garden',
    preview: 'High above the sleepy world, a tiny fallen star was lost in the evening fog until Pip found it in the nursery garden...',
    quote: '“Every star, no matter how small, has a home in the night sky.”',
    paragraphs: [
      'High above the Midnight Nursery, a tiny star named Twinkle slipped from its constellation and tumbled through the cool night air, landing softly with a quiet ping in Pip\'s observatory garden.',
      'Pip hurried outside in fluffy cloud slippers and knelt down beside the shimmering garden patch. Twinkle was shivering like a dewdrop in the evening breeze. "Don\'t worry, little star," Pip whispered tenderly, wrapping the frightened light in a soft velvet cloth. "No one stays lost in the Midnight Nursery."',
      'Pip brought Twinkle inside to the cozy fireplace, offered a warm droplet of moon-honey, and brought out the great brass telescope. Together, they looked up through the glass dome until they spotted Twinkle\'s constellation smiling down with wide, welcoming arms.',
      'With a gentle puff of golden stardust and a bedtime blessing from Pip, Twinkle floated gently back up into the starry canopy, shining brighter and warmer than ever before.'
    ]
  },
  {
    id: 'chapter-2',
    number: 2,
    title: 'The Bunny\'s Blanket',
    subtitle: 'A Cozy Quilt for Cold Paws',
    badge: 'Chapter 02',
    icon: '🐰',
    image: ch2Img,
    imageAlt: 'Pip tucking little Marshmallow the bunny into a warm dandelion fluff quilt',
    preview: 'Little Marshmallow the rabbit couldn\'t sleep because the autumn breeze was chilling the meadow grass...',
    quote: '“Warm blankets keep out the cold and bring dreams of sweet clover.”',
    paragraphs: [
      'In the quiet clover meadow behind the nursery tower, little Marshmallow the bunny was having trouble falling asleep. The evening autumn breeze blew through the tall grass, and his long ears were cold.',
      'From the observatory window, Pip saw the little bunny twitching his pink nose and searching for a warm hollow. Pip immediately fetched the special dream quilt—woven by hand from dandelion fluff, lavender threads, and sun-dried cotton.',
      'Pip tiptoed down the wooden steps, knelt quietly by the rabbit burrow, and tucked the soft blanket snugly around Marshmallow\'s paws. "This quilt keeps out the chill and holds dreams of sweet clover and warm sunshine," Pip promised with a gentle pat.',
      'Marshmallow gave a tiny, contented yawn, buried his nose into the lavender fluff, and closed heavy eyelids. As the night wind turned into a gentle hum, the little rabbit drifted off into the sweetest bedtime dream.'
    ]
  },
  {
    id: 'chapter-3',
    number: 3,
    title: 'The Whispering Cloud',
    subtitle: 'A Sleepy Traveler Finds a Bed',
    badge: 'Chapter 03',
    icon: '☁️',
    image: ch3Img,
    imageAlt: 'A sleepy pastel cloud resting gently on the nursery chimney',
    preview: 'A small pastel cloud drifted low over the nursery chimney, humming a lullaby to the sleeping birds...',
    quote: '“A gentle rain is nature’s softest bedtime lullaby.”',
    paragraphs: [
      'A tiny, puffy pastel cloud came floating low across the starlit sky, sighing with gentle exhaustion. It had traveled all day from the highest mountain peaks, singing soft lullabies to sleepy birds and tucking trees into evening fog.',
      '"You must be tired from carrying so many lullabies," Pip called out warmly from the nursery balcony, holding up a saucer of steaming chamomile mist.',
      'The little cloud drifted down with a happy flutter, sipping the soothing vapor until its edges glowed like warm peach cotton. Finding the warm nursery chimney irresistible, it curled around the brick top like a soft sleeping cap.',
      'Through the quiet night, the cloud breathed a rhythmic, whispering rain-song—not a loud storm, but a quiet, rhythmic patter that lulled the entire valley into peaceful rest.'
    ]
  },
  {
    id: 'chapter-4',
    number: 4,
    title: 'The Midnight Nursery Song',
    subtitle: 'When the Whole World Falls Asleep',
    badge: 'Chapter 04',
    icon: '🎵',
    image: ch4Img,
    imageAlt: 'Pip turning the great celestial music box atop the observatory tower',
    preview: 'When all the dreams were delivered and every creature was tucked in, Pip turned the magical celestial music box...',
    quote: '“Sleep tight, little world. You are safe, you are loved, and tomorrow holds wonders.”',
    paragraphs: [
      'The silver clock on the nursery wall chimed midnight. Every dream package had been safely delivered, every nightlight was glowing, and all the little creatures across the land were soundly asleep in their beds.',
      'Pip climbed up the spiral wooden staircase to the very highest turret of the observatory tower, where the great celestial music box stood gleaming under the skylight.',
      'Pip placed a tiny golden hand on the winding crank and gently turned it. Notes of pure starlight floated into the night breeze—melodies of soft chimes that drifted over rooftops, through open windows, and straight into every child\'s pillow.',
      '"Sleep tight, little world," Pip whispered out into the vast, beautiful night. "You are safe, you are loved, and tomorrow holds brand new wonders." Pip curled up on a cloud cushion with the little stuffed bunny, closed tired eyes, and fell asleep with a peaceful smile.'
    ]
  }
];

export default function BedtimeStorybookExperience({ onBack }) {
  const { isMuted } = useSite();
  const [viewMode, setViewMode] = useState('chapters'); // 'chapters' | 'reading' | 'ending'
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  const currentChapter = STORIES[activeChapterIndex] || STORIES[0];
  const totalChapters = STORIES.length;

  // Sound effect helper
  const playPageTurnSound = () => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      // Soft gentle page flutter
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(540, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // Ignore
    }
  };

  // Open Chapter
  const handleOpenChapter = (index) => {
    playPageTurnSound();
    setActiveChapterIndex(index);
    setViewMode('reading');
  };

  // Previous Chapter
  const handlePrevChapter = () => {
    if (activeChapterIndex > 0) {
      playPageTurnSound();
      setActiveChapterIndex((prev) => prev - 1);
    }
  };

  // Next Chapter
  const handleNextChapter = () => {
    if (activeChapterIndex < totalChapters - 1) {
      playPageTurnSound();
      setActiveChapterIndex((prev) => prev + 1);
    } else {
      // Finished all chapters
      playPageTurnSound();
      setViewMode('ending');
    }
  };

  // Keyboard Arrow Navigation for storybook pages
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      // Do not intercept if user is typing in an input or textarea
      const targetTag = e.target.tagName;
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA' || e.target.isContentEditable) {
        return;
      }

      if (e.key === 'ArrowRight') {
        if (viewMode === 'chapters') {
          handleOpenChapter(0);
        } else if (viewMode === 'reading') {
          handleNextChapter();
        }
      } else if (e.key === 'ArrowLeft') {
        if (viewMode === 'reading') {
          if (activeChapterIndex > 0) {
            handlePrevChapter();
          } else {
            handleBackToChapters();
          }
        } else if (viewMode === 'ending') {
          setActiveChapterIndex(totalChapters - 1);
          setViewMode('reading');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, activeChapterIndex, totalChapters]);

  // Back to Chapters
  const handleBackToChapters = () => {
    playPageTurnSound();
    setViewMode('chapters');
  };

  // Restart Storybook
  const handleRestart = () => {
    playPageTurnSound();
    setActiveChapterIndex(0);
    setViewMode('reading');
  };

  return (
    <div className="project-experience-container storybook-experience" aria-label="Bedtime Storybook Experience">
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

        <div className="experience-badge storybook-badge">
          <span className="badge-icon">📖</span> Project 04 · Interactive Storybook
        </div>
      </div>

      {/* Main Experience Window */}
      <div className="storybook-window">
        {/* ==============================================================
            MODE 1: CHAPTER SELECTION / STORYBOOK COVER
            ============================================================== */}
        {viewMode === 'chapters' && (
          <div className="storybook-cover-view">
            {/* Storybook Header */}
            <div className="storybook-header">
              <div className="storybook-header-text">
                <div className="storybook-title-row">
                  <span className="storybook-icon" aria-hidden="true">📖</span>
                  <h1 className="storybook-title">Pip’s Bedtime Storybook</h1>
                  <span className="storybook-star" aria-hidden="true">⭐</span>
                </div>
                <p className="storybook-subtitle">
                  Tales from the Midnight Nursery written and illustrated by Pip.
                  Choose a bedtime story below to turn the pages and read together!
                </p>
              </div>

              <div className="storybook-header-art">
                <img
                  src={coverBookImg}
                  alt="Pip reading magical bedtime storybook"
                  className="storybook-cover-art-img"
                />
              </div>
            </div>

            {/* Chapters Table of Contents Grid */}
            <div className="chapters-selection-grid">
              {STORIES.map((chapter, idx) => (
                <article
                  key={chapter.id}
                  className="chapter-select-card"
                  onClick={() => handleOpenChapter(idx)}
                >
                  <div className="chapter-card-thumbnail-wrapper">
                    <img
                      src={chapter.image}
                      alt={chapter.imageAlt}
                      className="chapter-card-thumbnail"
                    />
                    <span className="chapter-number-pill">{chapter.badge}</span>
                  </div>

                  <div className="chapter-card-body">
                    <div className="chapter-title-meta">
                      <span className="chapter-icon">{chapter.icon}</span>
                      <h2 className="chapter-card-title">{chapter.title}</h2>
                    </div>
                    <span className="chapter-card-subtitle">{chapter.subtitle}</span>
                    <p className="chapter-card-preview">{chapter.preview}</p>

                    <div className="chapter-card-footer">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenChapter(idx);
                        }}
                        className="btn chapter-open-btn"
                      >
                        Read Story →
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* ==============================================================
            MODE 2: OPEN BOOK READING VIEW
            ============================================================== */}
        {viewMode === 'reading' && (
          <div className="storybook-reading-view">
            {/* Storybook In-Book Header Navigation */}
            <div className="book-top-navigation">
              <button
                type="button"
                onClick={handleBackToChapters}
                className="btn book-nav-btn book-back-chapters-btn"
              >
                <span className="nav-arrow">←</span> Table of Contents
              </button>

              <div className="book-reading-progress">
                <span className="progress-chapter-label">
                  Chapter {currentChapter.number} of {totalChapters}
                </span>
                <div className="book-progress-bar">
                  <div
                    className="book-progress-fill"
                    style={{ width: `${(currentChapter.number / totalChapters) * 100}%` }}
                  />
                </div>
                <span className="progress-percentage">
                  {Math.round((currentChapter.number / totalChapters) * 100)}% Complete
                </span>
              </div>
            </div>

            {/* Open Book Spread (Two-Page Aesthetic) */}
            <div className="open-book-spread">
              <div className="book-spine-crease" aria-hidden="true" />

              {/* Left Page: Artwork, Title, Quote Banner */}
              <div className="book-page book-page-left">
                <div className="page-header-ribbon">
                  <span className="page-chapter-tag">{currentChapter.badge}</span>
                  <span className="page-icon-tag">{currentChapter.icon}</span>
                </div>

                <div className="page-artwork-container">
                  <img
                    src={currentChapter.image}
                    alt={currentChapter.imageAlt}
                    className="book-illustration-img"
                  />
                </div>

                <div className="page-quote-card">
                  <p className="page-quote-text">{currentChapter.quote}</p>
                </div>

                <div className="page-number-footer left-footer">
                  Page {currentChapter.number * 2 - 1}
                </div>
              </div>

              {/* Right Page: Full Story Text Paragraphs */}
              <div className="book-page book-page-right">
                <div className="story-content-header">
                  <h2 className="story-heading">{currentChapter.title}</h2>
                  <span className="story-subheading">{currentChapter.subtitle}</span>
                </div>

                <div className="story-body-paragraphs">
                  {currentChapter.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className={`story-paragraph ${pIdx === 0 ? 'first-paragraph' : ''}`}>
                      {p}
                    </p>
                  ))}
                </div>

                <div className="page-number-footer right-footer">
                  Page {currentChapter.number * 2}
                </div>
              </div>
            </div>

            {/* Bottom Book Navigation Bar */}
            <div className="book-bottom-navigation">
              <button
                type="button"
                onClick={handlePrevChapter}
                disabled={activeChapterIndex === 0}
                className="btn book-nav-btn book-prev-btn"
              >
                <span className="nav-arrow">←</span> Previous Story
              </button>

              <div className="current-story-indicator">
                <span>📖</span> <strong>{currentChapter.title}</strong>
              </div>

              {activeChapterIndex < totalChapters - 1 ? (
                <button
                  type="button"
                  onClick={handleNextChapter}
                  className="btn book-nav-btn book-next-btn"
                >
                  Next Story <span className="nav-arrow">→</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextChapter}
                  className="btn book-nav-btn book-finish-btn"
                >
                  Finish Storybook ✨ <span className="nav-arrow">→</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ==============================================================
            MODE 3: SWEET ENDING MESSAGE VIEW
            ============================================================== */}
        {viewMode === 'ending' && (
          <div className="storybook-ending-view">
            <div className="ending-plaque-card">
              <div className="ending-avatar-bubble">
                <img src={pipPortraitImg} alt="Pip" className="ending-pip-img" />
                <span className="ending-star-badge">✨</span>
              </div>

              <span className="ending-overtitle">The End</span>
              <h2 className="ending-main-title">Sweet Dreams, Little Friend! 🌙</h2>

              <p className="ending-whisper-message">
                “Goodnight little star. You've read all the bedtime stories from the Midnight Nursery.
                May your blankets be warm, your pillows be soft, and your dreams be filled with wonder.”
              </p>

              <div className="ending-stars-ribbon" aria-hidden="true">
                <span>⭐</span>
                <span>☁️</span>
                <span>🐰</span>
                <span>🌙</span>
                <span>⭐</span>
              </div>

              <div className="ending-actions-row">
                <button
                  type="button"
                  onClick={handleBackToChapters}
                  className="btn ending-btn ending-chapters-btn"
                >
                  <span>📖</span> Back to Chapter Selection
                </button>

                <button
                  type="button"
                  onClick={handleRestart}
                  className="btn ending-btn ending-restart-btn"
                >
                  <span>🌟</span> Read From Beginning
                </button>

                <button
                  type="button"
                  onClick={onBack}
                  className="btn ending-btn ending-projects-btn"
                >
                  <span>📁</span> Back to Projects
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
