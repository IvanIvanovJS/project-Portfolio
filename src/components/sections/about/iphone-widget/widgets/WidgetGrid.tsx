'use client';

import React from 'react';
import { WeatherWidget } from './WeatherWidget';
import { CalendarWidget } from './CalendarWidget';
import styles from './WidgetGrid.module.css';

/**
 * WidgetGrid Component Props
 */
interface WidgetGridProps {
  /** Handler for when weather widget is clicked */
  onWeatherClick: () => void;
  /** Default city for weather widget */
  city?: string;
  /** Additional CSS class */
  className?: string;
}

/**
 * WidgetGrid Component
 *
 * Layout container for iOS-style widgets above app icons.
 *
 * Features:
 * - CSS Grid layout with 2 columns
 * - Contains WeatherWidget and CalendarWidget
 * - Responsive: stacks vertically on mobile
 * - Proper spacing from app icons below
 *
 * Requirements: 10.1, 10.2
 *
 * @param props - WidgetGridProps
 */
export const WidgetGrid: React.FC<WidgetGridProps> = ({
  onWeatherClick,
  city = 'Sofia',
  className = '',
}) => {
  return (
    <div className={`${styles.widgetGrid} ${className}`}>
      <WeatherWidget city={city} onWidgetClick={onWeatherClick} />
      <CalendarWidget />
    </div>
  );
};
