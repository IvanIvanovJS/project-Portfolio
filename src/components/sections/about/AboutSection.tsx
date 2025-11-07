'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import styles from './AboutSection.module.css';
import { ImageCarousel } from './ImageCarousel';
import type { AboutData } from '@/types';

interface AboutSectionProps {
  data?: AboutData;
}

// Icon mapping configuration for Simple Icons slugs
const SKILL_ICON_MAP: Record<string, string> = {
  React: 'react',
  TypeScript: 'typescript',
  'Next.js': 'nextdotjs',
  'Node.js': 'nodedotjs',
  'Three.js': 'threedotjs',
  'CSS/SCSS': 'css3',
};

// SkillIcon component with error handling and fallback
interface SkillIconProps {
  name: string;
  size?: number;
}

const SkillIcon: React.FC<SkillIconProps> = ({ name, size = 24 }) => {
  const [hasError, setHasError] = useState(false);
  const iconSlug = SKILL_ICON_MAP[name] || name.toLowerCase();
  const iconPath = `/icons/skills/${iconSlug}.svg`;

  if (hasError) {
    return (
      <div className={styles.skillIconFallback}>
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <Image
      src={iconPath}
      alt={`${name} icon`}
      width={size}
      height={size}
      className={styles.skillIcon}
      onError={() => setHasError(true)}
    />
  );
};

const defaultData: AboutData = {
  personalInfo: {
    name: 'Ivan D. Ivanov',
    title: 'Full Stack Developer',
    bio: 'Passionate software engineer with expertise in modern web technologies. I specialize in creating beautiful, performant, and accessible web applications using React, TypeScript, and Next.js. With a keen eye for design and a commitment to clean code, I bring ideas to life through elegant solutions.',
    location: 'Varna, Bulgaria',
    email: 'john.doe@example.com',
    phone: '+359 898 573 056',
  },
  skills: [
    { name: 'React', level: 95, category: 'frontend' },
    { name: 'TypeScript', level: 90, category: 'frontend' },
    { name: 'Next.js', level: 88, category: 'frontend' },
    { name: 'Node.js', level: 75, category: 'backend' },
    { name: 'Three.js', level: 85, category: 'frontend' },
    { name: 'CSS/SCSS', level: 92, category: 'frontend' },
  ],
  experience: [
    {
      company: 'Front End Developer',
      position: 'Personal Pprojects',
      startDate: '2025-08',
      endDate: undefined,
      description:
        'Developing front-end applications as part of my personal portfolio',
      technologies: ['React', 'TypeScript', 'Next.js', 'CSS', 'UI/UX'],
    },
    {
      company: 'Full Javascript/React Curriculum',
      position: 'SoftUni Education',
      startDate: '2024-09',
      endDate: undefined,
      description:
        'Completed modules in JS Fundamentals, Advanced JS, Node.js Back-End, TypeScript, ReactJS, and HTML/CSS',
      technologies: [
        'React',
        'Node.js',
        'MongoDB',
        'TypeScript',
        'JavaScript',
        'CSS',
      ],
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
      src: '/images/mainPicture1.png',
      alt: 'My profile picture',
      caption: "👋 Hey, it's me! I'm glad you're here!",
      subCaption:
        'Coding is my passion — feel free to reach out for a collaboration',
    },
    {
      id: '2',
      src: '/images/gardeningHobby.jpg',
      alt: 'Bell pepper garden',
      caption: '🌱 This is one of my hobbies - growing my own natural veggies',
      subCaption:
        'I love my garden, and I enjoy sharing my gardening knowledge with others',
    },
    {
      id: '3',
      src: '/images/familyBrunch.jpg',
      alt: 'Family moments - brunch time',
      caption:
        "❤️ One of my favorite things to do for my family — it's brunch time!",
      subCaption:
        'The best part of the week — preparing Sunday brunch for my family',
    },
    {
      id: '4',
      src: '/images/dubaiSunraise.png',
      alt: 'Sunraise on Palm Jumeirah',
      caption: '🛫 When a 5 AM sunrise makes you smile!',
      subCaption:
        "Some people say money can't buy happiness — they've clearly never traveled",
    },
  ],
};

export const AboutSection: React.FC<AboutSectionProps> = ({
  data = defaultData,
}) => {
  const { personalInfo, skills, experience, images } = data;
  const personalInfoRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [carouselHeight, setCarouselHeight] = useState<number | undefined>(
    undefined
  );
  const [isCarouselVisible, setIsCarouselVisible] = useState(false);
  const hasBeenVisible = useRef(false);

  useEffect(() => {
    const updateCarouselHeight = () => {
      if (personalInfoRef.current) {
        const height = personalInfoRef.current.offsetHeight;
        setCarouselHeight(height);
      }
    };

    updateCarouselHeight();
    window.addEventListener('resize', updateCarouselHeight);

    return () => window.removeEventListener('resize', updateCarouselHeight);
  }, []);

  // Intersection Observer to start autoplay when carousel becomes visible
  useEffect(() => {
    if (!carouselRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasBeenVisible.current) {
            setIsCarouselVisible(true);
            hasBeenVisible.current = true;
          }
        });
      },
      {
        threshold: 0.3, // Start when 30% of carousel is visible
      }
    );

    observer.observe(carouselRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

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
            <div ref={personalInfoRef} className={styles.personalInfoCard}>
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
            <motion.div
              className={styles.experienceSection}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
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
            </motion.div>
          </motion.div>

          {/* Image Carousel Column */}
          <motion.div
            ref={carouselRef}
            className={styles.carouselColumn}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div
              ref={carouselRef}
              className={styles.carouselWrapper}
              style={{
                height: carouselHeight ? `${carouselHeight}px` : 'auto',
              }}
            >
              <ImageCarousel
                images={images}
                autoPlay={isCarouselVisible}
                interval={7000}
              />
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
                      <SkillIcon name={skill.name} size={24} />
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
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
