'use client';

import React from 'react';
import Image from 'next/image';
import { Phone } from 'lucide-react';
import { PersonalInfo } from '../types';
import styles from './PhoneApp.module.css';

/**
 * PhoneApp Component
 *
 * Displays an iOS-style phone dialer interface with contact information.
 *
 * Features:
 * - Profile picture display
 * - Contact name
 * - Phone number display
 * - Call button that triggers tel: link
 * - iOS phone app color scheme (green for call button)
 *
 * @param props - PhoneApp props
 */
export interface PhoneAppProps {
  personalInfo: PersonalInfo;
}

export const PhoneApp: React.FC<PhoneAppProps> = ({ personalInfo }) => {
  const { name } = personalInfo;

  const handleCall = () => {
    window.location.href = 'tel:+359898573056';
  };

  return (
    <div className={styles.phoneApp}>
      {/* Contact Card */}
      <div className={styles.contactCard}>
        {/* Profile Picture */}
        <div className={styles.avatarContainer}>
          <Image
            src="/images/iconProfilePicture.png"
            alt={name}
            width={120}
            height={120}
            className={styles.profilePicture}
            priority
          />
        </div>

        {/* Contact Name */}
        <h1 className={styles.contactName}>{name}</h1>
      </div>

      {/* Phone Number Display */}
      <div className={styles.phoneNumberDisplay}>
        <p className={styles.phoneNumber}>+359 898 573 056</p>
      </div>

      {/* Call Button */}
      <div className={styles.callButtonContainer}>
        <button
          className={styles.callButton}
          onClick={handleCall}
          aria-label="Call +359 898 573 056"
        >
          <div className={styles.callIcon}>
            <Phone size={28} strokeWidth={2} fill="white" />
          </div>
        </button>
      </div>
    </div>
  );
};
