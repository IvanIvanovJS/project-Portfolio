'use client';

import React from 'react';
import { CalendarWidgetProps } from '../types';
import { useCalendar } from '../hooks/useCalendar';
import styles from './CalendarWidget.module.css';

/**
 * CalendarWidget Component
 *
 * Displays current date information in iOS-style widget format.
 *
 * Features:
 * - Shows day of week in uppercase
 * - Displays day of month as large number
 * - Automatically updates at midnight
 * - Light glassmorphism design
 *
 * Requirements: 3.1, 3.2, 3.3, 8.1, 8.2, 8.3
 *
 * @param props - CalendarWidgetProps
 */
export const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  className = '',
}) => {
  const { dayOfWeek, dayOfMonth } = useCalendar();

  return (
    <div
      className={`${styles.calendarWidget} ${className}`}
      role="region"
      aria-label={`Calendar widget, ${dayOfWeek}, ${dayOfMonth}`}
    >
      <div className={styles.content}>
        <div className={styles.dayOfWeek}>{dayOfWeek.toUpperCase()}</div>
        <div className={styles.dayNumber}>{dayOfMonth}</div>
        <div className={styles.eventText}>No events today</div>
        <div className={styles.appName}>Calendar</div>
      </div>
    </div>
  );
};
