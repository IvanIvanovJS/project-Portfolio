import React from 'react';
import Image from 'next/image';
import styles from './ProjectCard.module.css';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index: _index,
}) => {
  return (
    <div className={styles.projectCard}>
      <div className={styles.imageContainer}>
        <Image
          src={project.image}
          alt={project.title}
          className={styles.image}
          width={400}
          height={200}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.description}>{project.description}</p>
        <div className={styles.technologies}>
          {project.technologies.map((tech) => (
            <span key={tech} className={styles.tech}>
              {tech}
            </span>
          ))}
        </div>
        <div className={styles.links}>
          {project.liveUrl && (
            <a href={project.liveUrl} className={styles.link}>
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} className={styles.link}>
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
