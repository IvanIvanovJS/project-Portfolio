import React from 'react';
import styles from './AboutSection.module.css';

export const AboutSection: React.FC = () => {
  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>About Me</h2>
        <div className={styles.content}>
          <div className={styles.info}>
            <p className={styles.bio}>
              {/* Personal information will be added later */}
              Software engineer passionate about creating amazing digital
              experiences.
            </p>
          </div>
          <div className={styles.carousel}>
            {/* Image carousel will be added later */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
