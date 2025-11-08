'use client';

import React from 'react';
import { SystemBarProps } from './types';
import { useSystemTime } from './hooks/useSystemTime';
import styles from './SystemBar.module.css';

/**
 * SystemBar Component
 *
 * Displays iOS-style status bar with:
 * - Current time in HH:MM format
 * - Current day and date
 * - Status icons (signal, WiFi, battery)
 * - Glassmorphism styling
 * - Real-time updates every minute
 */
export const SystemBar: React.FC<SystemBarProps> = ({
  currentTime: externalTime,
  showNotch = true,
}) => {
  // Use internal hook if no external time provided
  const internalTime = useSystemTime();
  const currentTime = externalTime || internalTime;

  // Format time as HH:MM
  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Format day and date (e.g., "Mon, Nov 8")
  const formatDate = (date: Date): string => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const dayNum = date.getDate();

    return `${dayName}, ${monthName} ${dayNum}`;
  };

  return (
    <div className={styles.systemBar} role="status" aria-live="polite">
      {/* Left section - Time */}
      <div className={styles.leftSection}>
        <time
          className={styles.time}
          dateTime={currentTime.toISOString()}
          aria-label={`Current time: ${formatTime(currentTime)}`}
        >
          {formatTime(currentTime)}
        </time>
      </div>

      {/* Center section - Date (below notch area) */}
      {showNotch && (
        <div className={styles.centerSection}>
          <span
            className={styles.date}
            aria-label={`Current date: ${formatDate(currentTime)}`}
          >
            {formatDate(currentTime)}
          </span>
        </div>
      )}

      {/* Right section - Status icons */}
      <div className={styles.rightSection}>
        {/* Signal strength indicator */}
        <div
          className={styles.signalIcon}
          aria-label="Signal strength: full"
          role="img"
        >
          <div className={styles.signalBar} />
          <div className={styles.signalBar} />
          <div className={styles.signalBar} />
          <div className={styles.signalBar} />
        </div>

        {/* WiFi indicator */}
        <div
          className={styles.wifiIcon}
          aria-label="WiFi: connected"
          role="img"
        >
          <svg
            width="16"
            height="12"
            viewBox="0 0 16 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 12C8.55228 12 9 11.5523 9 11C9 10.4477 8.55228 10 8 10C7.44772 10 7 10.4477 7 11C7 11.5523 7.44772 12 8 12Z"
              fill="currentColor"
            />
            <path
              d="M8 8C9.10457 8 10 8.89543 10 10H6C6 8.89543 6.89543 8 8 8Z"
              fill="currentColor"
              opacity="0.8"
            />
            <path
              d="M8 5C10.2091 5 12 6.79086 12 9H4C4 6.79086 5.79086 5 8 5Z"
              fill="currentColor"
              opacity="0.6"
            />
            <path
              d="M8 2C11.3137 2 14 4.68629 14 8H2C2 4.68629 4.68629 2 8 2Z"
              fill="currentColor"
              opacity="0.4"
            />
          </svg>
        </div>

        {/* Battery indicator */}
        <div
          className={styles.batteryIcon}
          aria-label="Battery: 100%"
          role="img"
        >
          <div className={styles.batteryBody}>
            <div className={styles.batteryLevel} />
          </div>
          <div className={styles.batteryTip} />
          <span className={styles.batteryPercent}>100%</span>
        </div>
      </div>
    </div>
  );
};
