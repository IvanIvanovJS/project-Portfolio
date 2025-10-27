import React from 'react';
import styles from './ProjectsSection.module.css';

export const ProjectsSection: React.FC = () => {
  return (
    <section className={styles.projectsSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Projects</h2>
        <div className={styles.projectGrid}>
          {/* Project cards will be added later */}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
