'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { ProjectData } from '@/types/project';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  project: ProjectData;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <motion.div
      className={styles.projectCard}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      {/* Decorative background elements */}
      <div className={styles.cardBackground} />
      <div className={styles.cardBackgroundBlur} />

      {/* Glassmorphism hover effects */}
      <span className={styles.glassEffect}>
        <span className={styles.glassEffectBefore} />
        <span className={styles.glassEffectAfter} />
      </span>

      {/* Card content */}
      <div className={styles.content}>
        {/* Project image */}
        {project.image && (
          <div className={styles.imageContainer}>
            <img
              src={project.image}
              alt={project.title}
              className={styles.projectImage}
              loading="lazy"
            />
            <div className={styles.imageOverlay} />
          </div>
        )}

        {/* Project info */}
        <div className={styles.projectInfo}>
          <h3 className={styles.title}>{project.title}</h3>

          {/* Status badge */}
          <span className={`${styles.statusBadge} ${styles[project.status]}`}>
            {project.status === 'completed' && 'Completed'}
            {project.status === 'in-progress' && 'In Progress'}
            {project.status === 'planned' && 'Planned'}
          </span>

          <p className={styles.description}>{project.description}</p>

          {/* Technology tags */}
          <div className={styles.technologies}>
            {project.technologies.slice(0, 4).map((tech, idx) => (
              <span
                key={idx}
                className={styles.techTag}
                style={{
                  borderColor: tech.color || 'rgba(255, 255, 255, 0.2)',
                }}
              >
                {tech.name}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className={styles.techTag}>
                +{project.technologies.length - 4}
              </span>
            )}
          </div>

          {/* Action links */}
          <div className={styles.links}>
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
                aria-label={`View live demo of ${project.title}`}
              >
                <ExternalLink size={18} />
                <span>Live Demo</span>
              </a>
            )}
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
                aria-label={`View GitHub repository for ${project.title}`}
              >
                <Github size={18} />
                <span>GitHub</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
