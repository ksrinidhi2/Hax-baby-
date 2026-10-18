import React from 'react';

export default function SectionContainer({
  id,
  title,
  icon,
  tagline,
  children
}) {
  return (
    <section id={id} className="dream-section" aria-label={title}>
      <div className="dream-window">
        <header className="dream-window-header">
          <h2 className="dream-window-title">
            <span>{icon}</span>
            <span>{title}</span>
          </h2>
          {tagline && <span className="dream-window-tagline">{tagline}</span>}
        </header>

        <div className="dream-window-body">
          {children}
        </div>
      </div>
    </section>
  );
}
