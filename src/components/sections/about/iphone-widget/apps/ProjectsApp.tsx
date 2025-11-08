'use client';

import React from 'react';
import Image from 'next/image';
import { ExternalLink, Github } from 'lucide-react';
import { Project } from '../types';
import styles from './ProjectsApp.module.css';

/**
 * ProjectsApp Component
 *
 * Displays portfolio projects in a scrollable list with iOS-style interface.
 *
 * Features:
 * - Scrollable project list
 * - Project cards with images using Next.js Image component
 * - Project titles, descriptions, and technology tags
 * - Links to live demos and repositories
 * - Glassmorphism card styling
 * - Smooth scroll behavior and proper spacing
 *
 * @param props - ProjectsApp props
 */
export interface ProjectsAppProps {
  projects: Project[];
}

export const ProjectsApp: React.FC<ProjectsAppProps> = ({ projects }) => {
  return (
    <div className={styles.projectsApp}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Projects</h1>
        <p className={styles.subtitle}>
          {projects.length} {projects.length === 1 ? 'project' : 'projects'}
        </p>
      </div>

      {/* Projects List */}
      <div className={styles.projectsList}>
        {projects.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>No projects to display</p>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className={styles.projectCard}>
              {/* Project Image */}
              {project.image && (
                <div className={styles.imageContainer}>
                  <Image
                    src={project.image}
                    alt={`${project.title} screenshot`}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 393px) 100vw, 393px"
                    className={styles.projectImage}
                  />
                  <div className={styles.imageOverlay} />
                </div>
              )}

              {/* Project Content */}
              <div className={styles.projectContent}>
                {/* Title */}
                <h2 className={styles.projectTitle}>{project.title}</h2>

                {/* Description */}
                <p className={styles.projectDescription}>
                  {project.description}
                </p>

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className={styles.technologiesContainer}>
                    <div className={styles.technologies}>
                      {project.technologies.map((tech, index) => (
                        <span key={index} className={styles.techTag}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                {(project.liveUrl || project.repoUrl) && (
                  <div className={styles.linksContainer}>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.projectLink}
                        aria-label={`View live demo of ${project.title}`}
                      >
                        <ExternalLink size={16} strokeWidth={2} />
                        <span>Live Demo</span>
                      </a>
                    )}
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.projectLink}
                        aria-label={`View ${project.title} repository on GitHub`}
                      >
                        <Github size={16} strokeWidth={2} />
                        <span>Repository</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
