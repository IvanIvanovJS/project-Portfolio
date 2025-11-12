'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ProjectCard } from './ProjectCard';
import { GlassSwitcher } from '@/components/ui/glass-switcher';
import { getAllProjects, getProjectCategories } from '@/utils/projectData';
import styles from './ProjectsSection.module.css';

export const ProjectsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get all projects and categories
  const allProjects = useMemo(() => getAllProjects(), []);
  const categories = useMemo(() => getProjectCategories(), []);

  // Filter projects based on selected category
  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'all') {
      return allProjects;
    }
    return allProjects.filter(
      (project) => project.category === selectedCategory
    );
  }, [allProjects, selectedCategory]);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setIsLoading(true);
    setSelectedCategory(category);

    // Simulate loading state for smooth transition
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <section
      id="projects"
      className={styles.projectsSection}
      aria-labelledby="projects-heading"
    >
      <div className={styles.container}>
        {/* Section header */}
        <motion.div
          className={styles.header}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={titleVariants}
        >
          <h2 id="projects-heading" className={styles.title}>
            Featured Projects
          </h2>
          <p className={styles.subtitle}>
            A showcase of my recent work and personal projects
          </p>
        </motion.div>

        {/* Category filters */}
        <motion.div
          className={styles.filters}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <GlassSwitcher
            options={[
              { value: 'all', label: 'All' },
              ...categories.map((cat) => ({
                value: cat,
                label: cat.charAt(0).toUpperCase() + cat.slice(1),
              })),
            ]}
            value={selectedCategory}
            onChange={handleCategoryChange}
            legend="Project category filter"
          />
        </motion.div>

        {/* Error state */}
        {error && (
          <div className={styles.errorState} role="alert" aria-live="assertive">
            <p className={styles.errorMessage}>{error}</p>
            <button
              className={styles.retryButton}
              onClick={() => {
                setError(null);
                setIsLoading(false);
              }}
              aria-label="Retry loading projects"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className={styles.loadingState} role="status" aria-live="polite">
            <div className={styles.spinner} aria-hidden="true" />
            <p>Loading projects...</p>
          </div>
        )}

        {/* Projects grid */}
        {!isLoading && !error && (
          <motion.div
            className={styles.projectsGrid}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            role="list"
            aria-label="Projects list"
          >
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))
            ) : (
              <div className={styles.emptyState}>
                <p>No projects found in this category.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Project count */}
        {!isLoading && !error && filteredProjects.length > 0 && (
          <motion.div
            className={styles.projectCount}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <p>
              Showing {filteredProjects.length} of {allProjects.length} projects
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};
