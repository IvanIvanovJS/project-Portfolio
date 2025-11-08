'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin, Mail, Phone } from 'lucide-react';
import { PersonalInfo } from '../types';
import styles from './AboutApp.module.css';

/**
 * AboutApp Component
 *
 * Displays personal information and bio in an iOS-style app interface.
 *
 * Features:
 * - Profile section with name and title
 * - Bio text with proper typography
 * - Contact information (location, email, phone)
 * - Glassmorphism card styling
 * - Scrollable content if it exceeds viewport
 *
 * @param props - AboutApp props
 */
export interface AboutAppProps {
  personalInfo: PersonalInfo;
}

export const AboutApp: React.FC<AboutAppProps> = ({ personalInfo }) => {
  const { name, title, bio, location, email, phone } = personalInfo;

  return (
    <div className={styles.aboutApp}>
      {/* Profile Section */}
      <div className={styles.profileSection}>
        <div className={styles.avatarContainer}>
          <Image
            src="/images/iconProfilePicture.png"
            alt={name}
            width={96}
            height={96}
            className={styles.profilePicture}
            priority
          />
        </div>

        <h1 className={styles.name}>{name}</h1>
        <p className={styles.title}>{title}</p>
      </div>

      {/* Bio Section */}
      <div className={styles.bioSection}>
        <h2 className={styles.sectionTitle}>About</h2>
        <div className={styles.bioCard}>
          <p className={styles.bioText}>{bio}</p>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className={styles.contactSection}>
        <h2 className={styles.sectionTitle}>Contact</h2>

        <div className={styles.contactCard}>
          {/* Location */}
          <div className={styles.contactItem}>
            <div className={styles.contactIcon}>
              <MapPin size={20} strokeWidth={2} />
            </div>
            <div className={styles.contactInfo}>
              <span className={styles.contactLabel}>Location</span>
              <span className={styles.contactValue}>{location}</span>
            </div>
          </div>

          {/* Email */}
          <div className={styles.contactItem}>
            <div className={styles.contactIcon}>
              <Mail size={20} strokeWidth={2} />
            </div>
            <div className={styles.contactInfo}>
              <span className={styles.contactLabel}>Email</span>
              <a
                href={`mailto:${email}`}
                className={styles.contactLink}
                aria-label={`Send email to ${email}`}
              >
                {email}
              </a>
            </div>
          </div>

          {/* Phone */}
          <div className={styles.contactItem}>
            <div className={styles.contactIcon}>
              <Phone size={20} strokeWidth={2} />
            </div>
            <div className={styles.contactInfo}>
              <span className={styles.contactLabel}>Phone</span>
              <a
                href={`tel:${phone}`}
                className={styles.contactLink}
                aria-label={`Call ${phone}`}
              >
                {phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
