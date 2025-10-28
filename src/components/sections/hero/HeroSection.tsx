import React, { useEffect, useRef, useState } from 'react';
import { GlassContainer } from '../../ui/glass-container/GlassContainer';
import { GlassButton } from '../../ui/glass-button/GlassButton';
import { ThreeScene } from './ThreeScene';
import { useTheme } from '../../../hooks/useTheme';
import { scrollToSection } from '../../../utils/scroll';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  secondaryCtaText?: string;
  onCtaClick?: () => void;
  onSecondaryCtaClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title = 'Creative Developer',
  subtitle = 'Building modern web experiences with cutting-edge technologies and glassmorphism design',
  ctaText = 'View My Work',
  secondaryCtaText = 'Get In Touch',
  onCtaClick = () => scrollToSection('projects'),
  onSecondaryCtaClick = () => scrollToSection('contact'),
}) => {
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
      <div className={styles.container}>
        <div className={styles.content}>
          <GlassContainer
            variant="card"
            className={styles.contentCard}
            blur={15}
            highlightOpacity={0.3}
          >
            <h1 className={styles.title}>
              <span className={styles.titleGradient}>{title}</span>
            </h1>
            <p className={styles.subtitle}>{subtitle}</p>
            <div className={styles.ctaContainer}>
              <GlassButton
                variant="cta"
                size="lg"
                onClick={onCtaClick}
                className={styles.ctaButton}
                aria-label={`${ctaText} - Navigate to projects section`}
              >
                {ctaText}
              </GlassButton>
              <GlassButton
                variant="secondary"
                size="lg"
                onClick={onSecondaryCtaClick}
                className={styles.secondaryCtaButton}
                aria-label={`${secondaryCtaText} - Navigate to contact section`}
              >
                {secondaryCtaText}
              </GlassButton>
            </div>
          </GlassContainer>
        </div>

        <div className={styles.sceneContainer}>
          <GlassContainer
            variant="panel"
            className={styles.sceneWrapper}
            blur={20}
            highlightOpacity={0.2}
          >
            <ThreeScene theme={theme} isVisible={isVisible} />
          </GlassContainer>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator}>
        <GlassContainer variant="button" className={styles.scrollButton}>
          <div className={styles.scrollArrow} />
        </GlassContainer>
      </div>

      {/* Background elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.glowOrb} />
        <div className={styles.glowOrb} />
        <div className={styles.glowOrb} />
      </div>
    </section>
  );
};

export default HeroSection;
