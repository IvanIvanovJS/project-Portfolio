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

  return (
    <section
      ref={sectionRef}
      className={styles.heroSection}
      id="hero"
      aria-label="Hero section"
    >
      {/* ThreeScene as full background */}
      <div className={styles.sceneBackground}>
        <ThreeScene theme={theme} isVisible={isVisible} />
      </div>

      {/* Content overlay */}
      <div className={styles.container}>
        {/* Content will be added later */}
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
