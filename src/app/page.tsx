'use client';

import { HeroSection } from '../components/sections/hero/HeroSection';
import { ProjectsSection } from '../components/sections/projects/ProjectsSection';

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* Projects Gallery Section */}
      <ProjectsSection />

      <section
        id="contact"
        style={{
          minHeight: '100vh',
          padding: '4rem 2rem',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontSize: 'var(--font-size-5xl)',
            marginBottom: '2rem',
            color: 'var(--fg-primary)',
          }}
        >
          Contact Section
        </h2>
        <p
          style={{
            fontSize: 'var(--font-size-xl)',
            color: 'var(--fg-secondary)',
          }}
        >
          This is where the contact form will be implemented.
        </p>
      </section>
    </>
  );
}
