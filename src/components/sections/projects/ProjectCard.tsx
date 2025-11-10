'use client';

import React, { useState } from 'react';
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
  const [imageError, setImageError] = useState(false);

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
    <motion.article
      className={styles.projectCard}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      aria-label={`${project.title} project card`}
    >
      <div className={styles.cardBackground} aria-hidden="true" />

      <div className={styles.content}>
        <div className={styles.contentWrapper}>
          <div className={styles.backgroundImageLayer} aria-hidden="true">
            {project.image && !imageError ? (
              <div className={styles.imageContainer}>
                <Image
                  src={project.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                  className={styles.projectImage}
                  style={{ objectFit: 'cover' }}
                  loading="lazy"
                  onError={() => setImageError(true)}
                  quality={85}
                />
              </div>
            ) : (
              <div className={styles.imagePlaceholder} />
            )}
          </div>

          <div className={styles.infoLayer}>
            <div className={styles.projectInfo}>
              <h3 className={styles.title}>{project.title}</h3>
              <span className={styles.visuallyHidden}>
                {project.status === 'completed' &&
                  'Project status: Completed. '}
                {project.status === 'in-progress' &&
                  'Project status: In Progress. '}
                {project.status === 'planned' && 'Project status: Planned. '}
                {project.links.github && 'GitHub repository available. '}
                {project.links.live && 'Live demo available. '}
              </span>
              <p className={styles.description}>{project.description}</p>

              {project.technologies && project.technologies.length > 0 && (
                <div className={styles.technologies}>
                  {project.technologies.map((tech, index) => (
                    <span key={index} className={styles.techTag}>
                      {tech.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

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
      </div>
    </motion.article>
  );
};
