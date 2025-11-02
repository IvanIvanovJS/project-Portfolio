'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Image as ImageIcon, Info } from 'lucide-react';
import { ProjectData } from '@/types/project';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  project: ProjectData;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const [imageError, setImageError] = useState(false);
  const [showImageOnMobile, setShowImageOnMobile] = useState(false);

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

  const handleMobileToggle = () => {
    setShowImageOnMobile(!showImageOnMobile);
  };

  return (
    <motion.div
      className={`${styles.projectCard} ${showImageOnMobile ? styles.mobileShowImage : ''}`}
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
        {/* Mobile toggle button */}
        <button
          className={styles.mobileToggle}
          onClick={handleMobileToggle}
          aria-label={
            showImageOnMobile ? 'Show project info' : 'Show project image'
          }
        >
          {showImageOnMobile ? <Info size={20} /> : <ImageIcon size={20} />}
        </button>

        {/* Content wrapper for layered content */}
        <div className={styles.contentWrapper}>
          {/* Image Layer - Hidden by default, shown on hover */}
          <div className={styles.imageLayer}>
            {/* Project image */}
            {project.image && !imageError ? (
              <div className={styles.imageContainer}>
                <Image
                  src={project.image}
                  alt={`${project.title} project screenshot`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                  className={styles.projectImage}
                  style={{ objectFit: 'cover' }}
                  loading="lazy"
                  onError={() => setImageError(true)}
                  quality={85}
                />
                <div className={styles.imageOverlay} />
              </div>
            ) : (
              <div className={styles.imagePlaceholder} />
            )}

            {/* Action buttons overlay - shown on desktop hover */}
            <div className={styles.actionButtonsDesktop}>
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
              <p className={styles.description}>{project.description}</p>
            </div>
          </div>

          {/* Action buttons for mobile - always visible at bottom */}
          <div className={styles.actionButtonsMobile}>
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
      </div>
    </motion.div>
  );
};
