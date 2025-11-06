import React, { useEffect, useRef, useState } from 'react';
import { ThreeScene } from './ThreeScene';
import { useTheme } from '../../../hooks/useTheme';
import styles from './HeroSection.module.css';

export const HeroSection: React.FC = () => {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      aria-label="Hero section"
    >
      {/* Content container */}
      <div className={styles.container}>
        {/* Left side - 3D Sphere */}
        <div className={styles.sphereContainer}>
          <ThreeScene theme={theme} isVisible={isVisible} />
        </div>

        {/* Right side - Content */}
        <div className={styles.contentContainer}>
          <div className={styles.textContent}>
            <h1 className={styles.name}>Ivan Ivanov</h1>
            <h2 className={styles.title}>FRONT-END AND UI/UX DEVELOPER</h2>
            <p className={styles.tagline}>
              Keen to create and inspire with passion!
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
          onClick={scrollToProjects}
          aria-label="Scroll to projects section"
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
