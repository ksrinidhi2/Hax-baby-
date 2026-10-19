import React, { useState } from 'react';
import './ProjectsSection.css';
import headerPipImg from '../../assets/project_header_pip.png';
import imgLullabyLab from '../../assets/project_lullaby_lab.png';
import imgNightlight from '../../assets/project_nightlight_collection.png';
import imgDreamDelivery from '../../assets/project_dream_delivery.png';
import imgStorybook from '../../assets/project_bedtime_storybook.png';

// 4 Full-Page Project Experiences
import LullabyLabExperience from './projects/LullabyLabExperience';
import NightlightCollectionExperience from './projects/NightlightCollectionExperience';
import DreamDeliveryRoutesExperience from './projects/DreamDeliveryRoutesExperience';
import BedtimeStorybookExperience from './projects/BedtimeStorybookExperience';
import { useSite } from '../context/SiteContext';

const PROJECTS_DATA = [
  {
    id: 'lullaby-lab',
    number: '01',
    icon: '🎵',
    title: 'The Lullaby Lab',
    description:
      'Create and play soothing lullabies with a magical music box. Pip composes melodies to bring comfort to all the sleepy friends.',
    tags: [
      { label: 'Soothing Melodies', icon: '🎵' },
      { label: 'Custom Tunes', icon: '💖' },
      { label: 'Sleep Sounds', icon: '🌙' }
    ],
    buttonText: 'Explore Lullaby Lab →',
    buttonTheme: 'pink',
    cardTheme: 'pink',
    image: imgLullabyLab,
    imageAlt: 'Pip with a glowing music box and floating notes'
  },
  {
    id: 'nightlight-collection',
    number: '02',
    icon: '💡',
    title: 'Nightlight Collection',
    description:
      'Explore a collection of glowing lamps and bedside lanterns. Pip designs each nightlight to make every night a little brighter.',
    tags: [
      { label: 'Unique Designs', icon: '⭐' },
      { label: 'Soft Glows', icon: '🌙' },
      { label: 'Cozy Ambience', icon: '☁️' }
    ],
    buttonText: 'Explore Nightlight Collection →',
    buttonTheme: 'blue',
    cardTheme: 'blue',
    image: imgNightlight,
    imageAlt: 'Pip sleeping beside a glowing star lantern jar'
  },
  {
    id: 'dream-delivery-routes',
    number: '03',
    icon: '📍',
    title: 'Dream Delivery Routes',
    description:
      'Help Pip fly across rooftops delivering dreams to little homes. Explore magical locations and spread happier sleep.',
    tags: [
      { label: 'Dream Routes', icon: '📖' },
      { label: 'Magical Locations', icon: '🏠' },
      { label: 'Special Deliveries', icon: '⭐' }
    ],
    buttonText: 'Explore Dream Delivery Routes →',
    buttonTheme: 'blue',
    cardTheme: 'blue',
    image: imgDreamDelivery,
    imageAlt: 'Pip in a hot air balloon basket soaring over dream village rooftops'
  },
  {
    id: 'bedtime-storybook',
    number: '04',
    icon: '📖',
    title: 'Bedtime Storybook',
    description:
      'Read a cozy bedtime story Pip wrote and illustrated. Turn the pages and explore gentle stories filled with friends, dreams and adventures.',
    tags: [
      { label: 'Short Stories', icon: '📖' },
      { label: 'Cute Illustrations', icon: '💖' },
      { label: 'Interactive Pages', icon: '🌙' }
    ],
    buttonText: 'Explore Bedtime Storybook →',
    buttonTheme: 'pink',
    cardTheme: 'pink',
    image: imgStorybook,
    imageAlt: 'Pip reading an open magical bedtime storybook with bunny'
  }
];

export default function ProjectsSection() {
  const [activeProject, setActiveProject] = useState(null);
  const { playSound } = useSite();

  const handleOpenProject = (id) => {
    setActiveProject(id);
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBackToProjects = () => {
    setActiveProject(null);
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="projects" className="projects-section" aria-label="Projects">
      {/* If a Project is selected, render its full-page experience */}
      {activeProject === 'lullaby-lab' && (
        <LullabyLabExperience onBack={handleBackToProjects} />
      )}

      {activeProject === 'nightlight-collection' && (
        <NightlightCollectionExperience onBack={handleBackToProjects} />
      )}

      {activeProject === 'dream-delivery-routes' && (
        <DreamDeliveryRoutesExperience onBack={handleBackToProjects} />
      )}

      {activeProject === 'bedtime-storybook' && (
        <BedtimeStorybookExperience onBack={handleBackToProjects} />
      )}

      {/* When no project is active, display the original approved 2x2 projects gallery */}
      {!activeProject && (
        <div className="projects-window retro-window">
          {/* Retro Window Titlebar */}
          <div className="retro-window-titlebar">
            <div className="retro-titlebar-left">
              <span className="retro-titlebar-icon" aria-hidden="true">📁</span>
              <span className="retro-titlebar-text">Projects (projects.exe)</span>
              <span className="retro-titlebar-star" aria-hidden="true">⭐</span>
            </div>
            <div className="retro-window-controls" aria-hidden="true">
              <button
                type="button"
                className="retro-win-btn"
                onClick={() => playSound && playSound('click')}
                title="Minimize"
                aria-label="Minimize Projects window"
                tabIndex="-1"
              >
                —
              </button>
              <button
                type="button"
                className="retro-win-btn"
                onClick={() => playSound && playSound('click')}
                title="Maximize"
                aria-label="Maximize Projects window"
                tabIndex="-1"
              >
                □
              </button>
              <button
                type="button"
                className="retro-win-btn retro-win-btn-close"
                onClick={() => playSound && playSound('click')}
                title="Close"
                aria-label="Close Projects window"
                tabIndex="-1"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="projects-window-body">
            {/* Header Section */}
            <div className="projects-window-header">
              <div className="projects-header-left">
                <div className="projects-title-row">
                  <span className="projects-folder-icon" aria-hidden="true">📁</span>
                  <h2 className="projects-title">Projects</h2>
                  <span className="projects-star-icon" aria-hidden="true">⭐</span>
                </div>
                <p className="projects-subtitle">
                  Pip works on tiny magical projects at the Midnight Nursery to help the neighbourhood's little ghosts
                  and creatures fall asleep. Each project is a piece of love, curiosity and a little bit of stardust!
                </p>
              </div>

            <div className="projects-header-right">
              <img
                src={headerPipImg}
                alt="Pip with bunny plushie on clouds: Little things for sweeter dreams!"
                className="projects-header-pip-img"
              />
            </div>
          </div>

          {/* 2 × 2 Projects Cards Grid */}
          <div className="projects-grid">
            {PROJECTS_DATA.map((project) => (
              <article
                key={project.id}
                className={`project-card project-card-${project.cardTheme}`}
                onClick={() => handleOpenProject(project.id)}
                style={{ cursor: 'pointer' }}
              >
                {/* Left Column: Information, Tags & Action Button */}
                <div className="project-card-content">
                  <div className="project-card-header">
                    <span className={`project-number-badge badge-${project.cardTheme}`}>
                      {project.number}
                    </span>
                    <span className="project-icon" aria-hidden="true">{project.icon}</span>
                    <h3 className="project-card-title">{project.title}</h3>
                  </div>

                  <p className="project-card-description">{project.description}</p>

                  <div className="project-card-tags">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`project-tag project-tag-${project.cardTheme}`}
                      >
                        <span className="project-tag-icon" aria-hidden="true">{tag.icon}</span>
                        <span>{tag.label}</span>
                      </span>
                    ))}
                  </div>

                  <div className="project-card-action">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenProject(project.id);
                      }}
                      className={`btn project-btn project-btn-${project.buttonTheme}`}
                      aria-label={project.buttonText}
                    >
                      {project.buttonText}
                    </button>
                  </div>
                </div>

                {/* Right Column: Project Artwork */}
                <div className="project-card-media">
                  <img
                    src={project.image}
                    alt={project.imageAlt}
                    className="project-card-img"
                  />
                </div>
              </article>
            ))}
          </div>
          </div>
        </div>
      )}
    </section>
  );
}
