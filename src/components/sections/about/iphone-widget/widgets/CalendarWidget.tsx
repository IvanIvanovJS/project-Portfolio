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

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const currentDate = new Date();
  const monthName = monthNames[currentDate.getMonth()];

  return (
    <div
      className={`${styles.calendarWidget} ${className}`}
      role="region"
      aria-label={`Calendar widget, ${dayOfWeek} ${monthName} ${dayOfMonth}. No events today.`}
    >
      <div className={styles.content}>
        <div className={styles.dayOfWeek} aria-hidden="true">
          {dayOfWeek.toUpperCase()}
        </div>
        <div className={styles.dayNumber} aria-hidden="true">
          {dayOfMonth}
        </div>
        <div className={styles.eventText} aria-hidden="true">
          No events today
        </div>
        <div className={styles.appName} aria-hidden="true">
          Calendar
        </div>
      </div>
    </div>
  );
};
