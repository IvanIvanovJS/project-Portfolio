import React from 'react';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  onCtaClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  ctaText,
  onCtaClick,
}) => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
          <button className={styles.ctaButton} onClick={onCtaClick}>
            {ctaText}
          </button>
        </div>
        <div className={styles.threeScene}>
          {/* Three.js scene will be added later */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
