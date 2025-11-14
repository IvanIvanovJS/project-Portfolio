'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Github, FileText } from 'lucide-react';
import styles from './AboutSection.module.css';
import { ImageCarousel } from './ImageCarousel';
import { IPhoneWidget } from './iphone-widget/IPhoneWidget';
import { ResumeViewer } from './ResumeViewer';
import { getAllProjects } from '@/utils/projectData';
import type { AboutData } from '@/types';
import type { Project } from './iphone-widget/types';

interface AboutSectionProps {
  data?: AboutData;
}

const defaultData: AboutData = {
  personalInfo: {
    name: 'Ivan D. Ivanov',
    title: 'Full Stack Developer',
    bio: 'React software engineer with expertise in modern web technologies. I specialize in creating beautiful, performant, and accessible web applications using React, TypeScript, and Next.js. With a keen eye for design and a commitment to clean code, I bring ideas to life through elegant solutions.',
    location: 'Varna, Bulgaria',
    email: 'ivanov@webmorphism.com',
    phone: '+359 898 573 056',
  },

  experience: [
    {
      company: 'Full Stack Developer',
      position: 'Personal Pprojects',
      startDate: '2025-08',
      endDate: undefined,
      description:
        'Developing web applications as part of my personal portfolio',
      technologies: ['React', 'TypeScript', 'Next.js', 'CSS', 'UI/UX'],
    },
    {
      company: 'Software Engeener with JavaScript',
      position: 'Software University, Sofia',
      startDate: '2024-09',
      endDate: undefined,
      description:
        'Completed modules in ReactJS, TypeScript, Node.js Back-End, HTML/CSS, JS Application and JS Fundamentals',
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
  images: [
    {
      id: '1',
      src: 'gardeningHobby',
      alt: 'My main hobby',
      caption: "👋 Hey, it's me! I'm glad you're here!",
      subCaption:
        'Coding is my passion - feel free to reach out for a collaboration',
    },
    {
      id: '2',
      src: 'mainHobby-min',
      alt: 'Bell pepper garden',
      caption: '🌱 This is one of my hobbies - growing my own natural veggies',
      subCaption:
        'I love my garden, and I enjoy sharing my gardening knowledge with others',
    },
    {
      id: '3',
      src: 'familyBrunch',
      alt: 'Family moments - brunch time',
      caption:
        "❤️ One of my favorite things to do for my family - it's brunch time!",
      subCaption:
        'The best part of the week - preparing Sunday brunch for my family',
    },
    {
      id: '4',
      src: 'dubaiSunraise',
      alt: 'Sunraise on Palm Jumeirah',
      caption: '🛫 When a 5 AM sunrise makes you smile!',
      subCaption:
        "Some people say money can't buy happiness - they've clearly never traveled",
    },
  ],
};

export const AboutSection: React.FC<AboutSectionProps> = ({
  data = defaultData,
}) => {
  const { personalInfo, experience, images } = data;
  const personalInfoRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [carouselHeight, setCarouselHeight] = useState<number | undefined>(
    undefined
  );
  const [isCarouselVisible, setIsCarouselVisible] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
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
    <section
      id="about"
      className={styles.aboutSection}
      aria-labelledby="about-heading"
    >
      <div className={styles.container}>
        <motion.h2
          id="about-heading"
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
              <div className={styles.nameHeader}>
                <h3 className={styles.sectionHeadingName}>
                  {personalInfo.name}
                </h3>
                <a
                  href="https://github.com/IvanIvanovJS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.githubLink}
                  aria-label="Visit GitHub profile"
                >
                  <Github size={24} />
                  <span>GitHub</span>
                </a>
              </div>
              <div className={styles.jobTitleRow}>
                <p className={styles.jobTitle}>{personalInfo.title}</p>
                <button
                  onClick={() => setIsResumeOpen(true)}
                  className={styles.resumeButton}
                  aria-label="View resume"
                  title="View Resume"
                >
                  <FileText size={22} />
                  <span>Resume</span>
                </button>
              </div>
              <p className={styles.bio}>{personalInfo.bio}</p>

              <div className={styles.contactInfo} role="list">
                <div className={styles.contactItem} role="listitem">
                  <MapPin
                    className={styles.icon}
                    size={18}
                    aria-hidden="true"
                  />
                  <span>{personalInfo.location}</span>
                </div>
                <div className={styles.contactItem} role="listitem">
                  <Mail className={styles.icon} size={18} aria-hidden="true" />
                  <a
                    href={`mailto:${personalInfo.email}`}
                    aria-label={`Email ${personalInfo.email}`}
                  >
                    {personalInfo.email}
                  </a>
                </div>
                {personalInfo.phone && (
                  <div className={styles.contactItem} role="listitem">
                    <Phone
                      className={styles.icon}
                      size={18}
                      aria-hidden="true"
                    />
                    <a
                      href={`tel:${personalInfo.phone}`}
                      aria-label={`Call ${personalInfo.phone}`}
                    >
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

            {/* iPhone Widget - Interactive Mobile Solution */}
            <motion.div
              className={styles.iphoneWidgetSection}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className={styles.sectionHeading}>Mobile Solution</h3>
              <p className={styles.widgetParagraph}>Tap to explore!</p>

              <IPhoneWidget
                personalInfo={{
                  name: personalInfo.name,
                  title: personalInfo.title,
                  bio: personalInfo.bio,
                  phone: personalInfo.phone || '',
                  email: personalInfo.email,
                  location: personalInfo.location,
                }}
                projects={getAllProjects().map(
                  (project): Project => ({
                    id: project.id,
                    title: project.title,
                    description: project.description,
                    image: project.image,
                    technologies: project.technologies.map((tech) => tech.name),
                    liveUrl: project.links.live,
                    repoUrl: project.links.github,
                  })
                )}
                githubUrl="https://github.com/IvanIvanovJS"
                linkedinUrl="https://linkedin.com/in/ivanov-webmorphism"
                className={styles.iphoneWidget}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Resume Viewer Modal */}
      <ResumeViewer
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </section>
  );
};

export default AboutSection;
