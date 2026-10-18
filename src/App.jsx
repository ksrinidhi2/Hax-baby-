import React from 'react';
import { SiteProvider, useSite } from './context/SiteContext';
import Navigation from './components/Navigation';
import HomeSection from './components/HomeSection';
import AboutSection from './components/AboutSection';
import ProjectsSection from './components/ProjectsSection';
import StorySection from './components/StorySection';
import GuestbookSection from './components/GuestbookSection';
import FooterCredits from './components/FooterCredits';
import CursorEffects from './components/CursorEffects';
import StarCatchMiniGame from './components/StarCatchMiniGame';

function AppContent() {
  const { isMiniGameOpen, closeMiniGame } = useSite();

  return (
    <div className="site-wrapper">
      {/* Global Cursor Effects: Nightlight Aura & Sparkle Trail */}
      <CursorEffects />

      {/* Main Top Navigation */}
      <Navigation />

      <main className="main-content">
        {/* 1. Home Section */}
        <HomeSection />

        {/* 2. About Section */}
        <AboutSection />

        {/* 3. Projects Section */}
        <ProjectsSection />

        {/* 4. Story Section */}
        <StorySection />

        {/* 5. Guestbook Section */}
        <GuestbookSection />
      </main>

      {/* Dedicated Credits Footer after all five sections */}
      <FooterCredits />

      {/* Catch the Falling Stars Mini-Game Modal */}
      <StarCatchMiniGame isOpen={isMiniGameOpen} onClose={closeMiniGame} />
    </div>
  );
}

export default function App() {
  return (
    <SiteProvider>
      <AppContent />
    </SiteProvider>
  );
}
