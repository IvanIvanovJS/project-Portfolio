import React, { useEffect, useRef, useState } from 'react';
import { GlassContainer } from '../../ui/glass-container/GlassContainer';
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

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator}>
        <GlassContainer variant="button" className={styles.scrollButton}>
          <div className={styles.scrollArrow} />
        </GlassContainer>
      </div>
    </section>
  );
};

export default HeroSection;
