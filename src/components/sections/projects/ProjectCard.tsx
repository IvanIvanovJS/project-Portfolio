'use client';

import React from 'react';
import Image from 'next/image';
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

      {/* Card content */}
      <div className={styles.content}>
        {/* Content wrapper for layered content */}
        <div className={styles.contentWrapper}>
          {/* Image Layer - Hidden by default, shown on hover */}
          <div className={styles.imageLayer}>
            {/* Project image */}
            {project.image ? (
              <div className={styles.imageContainer}>
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                  className={styles.projectImage}
                  style={{ objectFit: 'cover' }}
                />
                <div className={styles.imageOverlay} />
              </div>
            ) : (
              <div className={styles.imagePlaceholder} />
            )}

            {/* Action buttons overlay */}
            <div className={styles.actionButtons}>
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.actionButton}
                  aria-label={`View GitHub repository for ${project.title}`}
                >
                  <Github size={20} />
                  <span>GitHub</span>
                </a>
              )}
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.actionButton}
                  aria-label={`View live demo of ${project.title}`}
                >
                  <ExternalLink size={20} />
                  <span>Live Demo</span>
                </a>
              )}
              {!project.links.github && !project.links.live && (
                <div className={styles.comingSoon}>Coming Soon</div>
              )}
            </div>
          </div>

          {/* Info Layer - Visible by default, hidden on hover */}
          <div className={styles.infoLayer}>
            <div className={styles.projectInfo}>
              <h3 className={styles.title}>{project.title}</h3>

              {/* Status badge */}
              <span
                className={`${styles.statusBadge} ${styles[project.status]}`}
              >
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
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
