'use client';

import { HeroSection } from '../components/sections/hero/HeroSection';

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* Placeholder sections for navigation targets */}
      <section
        id="projects"
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
          Projects Section
        </h2>
        <p
          style={{
            fontSize: 'var(--font-size-xl)',
            color: 'var(--fg-secondary)',
          }}
        >
          This is where the projects gallery will be implemented.
        </p>
      </section>

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
