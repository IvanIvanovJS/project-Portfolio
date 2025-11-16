import React, { useEffect, useRef, useState } from 'react';
import { ThreeScene } from './ThreeScene';
import { useTheme } from '../../../hooks/useTheme';
import type { PreloadedAssets } from '@/utils/assetPreloader';
import styles from './HeroSection.module.css';

export interface HeroSectionProps {
  preloadedAssets?: PreloadedAssets | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  preloadedAssets,
}) => {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Compute loading state based on preloaded assets
  const loadingState = (() => {
    if (preloadedAssets) {
      return 'ready';
    }

    // Check if WebGL is supported
    if (typeof window === 'undefined') {
      return 'loading';
    }

    try {
      const canvas = document.createElement('canvas');
      const hasWebGL = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
      return hasWebGL ? 'loading' : 'error';
    } catch {
      return 'error';
    }
  })();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToAbout = () => {
    const projectsAbout = document.getElementById('about');
    if (projectsAbout) {
      projectsAbout.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      ref={sectionRef}
      className={styles.heroSection}
      id="hero"
      aria-labelledby="hero-heading"
    >
      {/* Loading state announcement for screen readers */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={styles.srOnly}
      >
        {loadingState === 'loading' && 'Loading 3D scene and technology stack'}
        {loadingState === 'ready' && '3D scene loaded and ready'}
        {loadingState === 'error' &&
          'Scene unavailable, showing alternative content'}
      </div>

      {/* Full-width 3D Scene Background */}
      <div className={styles.sceneBackground}>
        <ThreeScene
          theme={theme}
          isVisible={isVisible}
          preloadedAssets={preloadedAssets}
        />
      </div>

      {/* Screen reader only technology list as keyboard alternative */}
      <div className={styles.srOnly}>
        <h2>Technology Stack</h2>
        <ul>
          <li>React - JavaScript library for building user interfaces</li>
          <li>TypeScript - Typed superset of JavaScript</li>
          <li>Next.js - React framework for production</li>
          <li>Node.js - JavaScript runtime environment</li>
          <li>Three.js - 3D graphics library</li>
          <li>CSS3 - Styling and animations</li>
          <li>HTML5 - Semantic markup</li>
          <li>Git - Version control system</li>
          <li>Docker - Containerization platform</li>
          <li>PostgreSQL - Relational database</li>
          <li>MongoDB - NoSQL database</li>
          <li>GraphQL - Query language for APIs</li>
          <li>REST APIs - Web service architecture</li>
          <li>Webpack - Module bundler</li>
          <li>Jest - Testing framework</li>
          <li>Figma - Design and prototyping tool</li>
        </ul>
      </div>

      {/* Content container */}
      <div className={styles.container}>
        {/* Left side - Spacer for sphere (60%) */}
        <div className={styles.sphereSpacer} />

        {/* Right side - Content (40%) */}
        <div className={styles.contentContainer}>
          <div className={styles.textContent}>
            <h1 id="hero-heading" className={styles.name}>
              Ivan Ivanov
            </h1>
            <h2 className={styles.title}>FULL STACK AND UI/UX DEVELOPER</h2>
            <p className={styles.tagline}>
              <span className={styles.blinkingDot} aria-hidden="true"></span>
              Accepting full-time or freelance job offers
            </p>
          </div>

          <button
            className={styles.ctaButton}
            onClick={scrollToContact}
            aria-label="Contact me"
            type="button"
          >
            Let&apos;s Talk
          </button>
        </div>
      </div>

      {/* Scroll indicator with shadow */}
      <div className={styles.scrollIndicator}>
        <div className={styles.scrollShadow} />
        <button
          className={styles.scrollButton}
          onClick={scrollToAbout}
          aria-label="Scroll to about section"
          type="button"
        >
          <svg
            className={styles.scrollArrow}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5V19M12 19L19 12M12 19L5 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
