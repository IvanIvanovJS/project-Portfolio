'use client';

import React from 'react';
import { Phone, ArrowLeft } from 'lucide-react';
import { PersonalInfo } from '../types';
import styles from './PhoneApp.module.css';

/**
 * PhoneApp Component
 *
 * Displays an iOS-style phone dialer interface with contact information.
 *
 * Features:
 * - Large phone number display prominently at the top
 * - Contact card with name and profile placeholder
 * - Call button that triggers tel: link
 * - Decorative keypad (1-9, *, 0, #) with glassmorphism buttons
 * - iOS phone app color scheme (green for call button)
 *
 * @param props - PhoneApp props
 */
export interface PhoneAppProps {
  personalInfo: PersonalInfo;
}

const KEYPAD_BUTTONS = [
  { digit: '1', letters: '' },
  { digit: '2', letters: 'ABC' },
  { digit: '3', letters: 'DEF' },
  { digit: '4', letters: 'GHI' },
  { digit: '5', letters: 'JKL' },
  { digit: '6', letters: 'MNO' },
  { digit: '7', letters: 'PQRS' },
  { digit: '8', letters: 'TUV' },
  { digit: '9', letters: 'WXYZ' },
  { digit: '*', letters: '' },
  { digit: '0', letters: '+' },
  { digit: '#', letters: '' },
];

export const PhoneApp: React.FC<PhoneAppProps> = ({ personalInfo }) => {
  const { name, phone } = personalInfo;

  const handleCall = () => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className={styles.phoneApp}>
      {/* Contact Card */}
      <div className={styles.contactCard}>
        {/* Profile Avatar */}
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}>
            <Phone size={40} strokeWidth={1.5} />
          </div>
        </div>

        {/* Contact Name */}
        <h1 className={styles.contactName}>{name}</h1>

        {/* Phone Number */}
        <p className={styles.phoneNumber}>{phone}</p>
      </div>

      {/* Call Button */}
      <div className={styles.callButtonContainer}>
        <button
          className={styles.callButton}
          onClick={handleCall}
          aria-label={`Call ${phone}`}
        >
          <div className={styles.callIcon}>
            <Phone size={28} strokeWidth={2} />
          </div>
          <span className={styles.callLabel}>Call</span>
        </button>
      </div>

      {/* Decorative Keypad */}
      <div className={styles.keypad}>
        {KEYPAD_BUTTONS.map((button) => (
          <button
            key={button.digit}
            className={styles.keypadButton}
            aria-label={`Keypad ${button.digit}`}
            disabled
          >
            <span className={styles.keypadDigit}>{button.digit}</span>
            {button.letters && (
              <span className={styles.keypadLetters}>{button.letters}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
