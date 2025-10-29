'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';
import styles from './AboutSection.module.css';
import { ImageCarousel } from './ImageCarousel';
import type { AboutData } from '@/types';

interface AboutSectionProps {
  data?: AboutData;
}

const defaultData: AboutData = {
  personalInfo: {
    name: 'John Doe',
    title: 'Full Stack Developer',
    bio: 'Passionate software engineer with expertise in modern web technologies. I specialize in creating beautiful, performant, and accessible web applications using React, TypeScript, and Next.js. With a keen eye for design and a commitment to clean code, I bring ideas to life through elegant solutions.',
    location: 'Sofia, Bulgaria',
    email: 'john.doe@example.com',
    phone: '+359 123 456 789',
  },
  skills: [
    { name: 'React', level: 95, category: 'frontend', icon: '⚛️' },
    { name: 'TypeScript', level: 90, category: 'frontend', icon: '📘' },
    { name: 'Next.js', level: 88, category: 'frontend', icon: '▲' },
    { name: 'Three.js', level: 75, category: 'frontend', icon: '🎨' },
    { name: 'Node.js', level: 85, category: 'backend', icon: '🟢' },
    { name: 'CSS/SCSS', level: 92, category: 'frontend', icon: '🎨' },
  ],
  experience: [
    {
      company: 'Tech Company',
      position: 'Senior Frontend Developer',
      startDate: '2021-01',
      endDate: undefined,
      description: 'Leading frontend development for enterprise applications',
      technologies: ['React', 'TypeScript', 'Next.js', 'GraphQL'],
    },
    {
      company: 'Startup Inc',
      position: 'Full Stack Developer',
      startDate: '2019-06',
      endDate: '2020-12',
      description: 'Built and maintained full-stack web applications',
      technologies: ['React', 'Node.js', 'MongoDB', 'AWS'],
    },
  ],
  education: [
    {
      institution: 'Technical University',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2015-09',
      endDate: '2019-06',
      description: 'Focus on software engineering and web technologies',
    },
  ],
  images: [
    {
      id: '1',
      src: '/images/about/profile-1.jpg',
      alt: 'Profile photo 1',
      caption: 'Working on projects',
    },
    {
      id: '2',
      src: '/images/about/profile-2.jpg',
      alt: 'Profile photo 2',
      caption: 'At a tech conference',
    },
    {
      id: '3',
      src: '/images/about/profile-3.jpg',
      alt: 'Profile photo 3',
      caption: 'Team collaboration',
    },
  ],
};

export const AboutSection: React.FC<AboutSectionProps> = ({
  data = defaultData,
}) => {
  const { personalInfo, skills, experience, images } = data;

  return (
    <section id="about" className={styles.aboutSection}>
      <div className={styles.container}>
        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          About Me
        </motion.h2>

        <div className={styles.content}>
          {/* Personal Information Column */}
          <motion.div
            className={styles.infoColumn}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className={styles.glassCard}>
              <h3 className={styles.sectionHeading}>{personalInfo.name}</h3>
              <p className={styles.jobTitle}>{personalInfo.title}</p>
              <p className={styles.bio}>{personalInfo.bio}</p>

              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <MapPin className={styles.icon} size={18} />
                  <span>{personalInfo.location}</span>
                </div>
                <div className={styles.contactItem}>
                  <Mail className={styles.icon} size={18} />
                  <a href={`mailto:${personalInfo.email}`}>
                    {personalInfo.email}
                  </a>
                </div>
                {personalInfo.phone && (
                  <div className={styles.contactItem}>
                    <Phone className={styles.icon} size={18} />
                    <a href={`tel:${personalInfo.phone}`}>
                      {personalInfo.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Skills Section */}
            <div className={styles.glassCard}>
              <h3 className={styles.sectionHeading}>Skills</h3>
              <div className={styles.skillsGrid}>
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    className={styles.skillItem}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <div className={styles.skillHeader}>
                      {skill.icon && (
                        <span className={styles.skillIcon}>{skill.icon}</span>
                      )}
                      <span className={styles.skillName}>{skill.name}</span>
                      <span className={styles.skillLevel}>{skill.level}%</span>
                    </div>
                    <div className={styles.skillBar}>
                      <motion.div
                        className={styles.skillProgress}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.05 + 0.2 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Experience Timeline */}
            <div className={styles.glassCard}>
              <h3 className={styles.sectionHeading}>Experience</h3>
              <div className={styles.timeline}>
                {experience.map((exp, index) => (
                  <motion.div
                    key={`${exp.company}-${exp.startDate}`}
                    className={styles.timelineItem}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className={styles.timelineDot} />
                    <div className={styles.timelineContent}>
                      <h4 className={styles.experiencePosition}>
                        {exp.position}
                      </h4>
                      <p className={styles.experienceCompany}>{exp.company}</p>
                      <p className={styles.experiencePeriod}>
                        {new Date(exp.startDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                        })}{' '}
                        -{' '}
                        {exp.endDate
                          ? new Date(exp.endDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                            })
                          : 'Present'}
                      </p>
                      <p className={styles.experienceDescription}>
                        {exp.description}
                      </p>
                      <div className={styles.experienceTech}>
                        {exp.technologies.map((tech) => (
                          <span key={tech} className={styles.techTag}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Image Carousel Column */}
          <motion.div
            className={styles.carouselColumn}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ImageCarousel images={images} autoPlay={true} interval={5000} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
