'use client';

import React from 'react';
import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
  CloudFog,
} from 'lucide-react';
import { WeatherWidgetProps, WeatherIcon } from '../types';
import { useWeather } from '../hooks/useWeather';
import styles from './WeatherWidget.module.css';

/**
 * Map weather icon type to Lucide React component
 */
const WEATHER_ICON_MAP: Record<
  WeatherIcon,
  React.ComponentType<{
    size?: number;
    className?: string;
    style?: React.CSSProperties;
  }>
> = {
  sun: Sun,
  moon: Moon,
  cloud: Cloud,
  'cloud-sun': CloudSun,
  'cloud-moon': CloudMoon,
  'cloud-rain': CloudRain,
  'cloud-drizzle': CloudDrizzle,
  'cloud-snow': CloudSnow,
  'cloud-lightning': CloudLightning,
  fog: CloudFog,
};

/**
 * Get icon color based on weather type
 */
function getIconColor(icon: WeatherIcon): string {
  switch (icon) {
    case 'sun':
      return '#FFD700';
    case 'moon':
      return '#E0E0E0';
    case 'cloud-rain':
    case 'cloud-drizzle':
      return '#4A90E2';
    case 'cloud-snow':
      return '#B0E0E6';
    case 'cloud-lightning':
      return '#FFD700';
    case 'fog':
      return '#A0A0A0';
    default:
      return '#FFFFFF';
  }
}

/**
 * WeatherWidget Component
 *
 * Displays current weather conditions in iOS-style widget format.
 *
 * Features:
 * - Shows current temperature and conditions
 * - Displays high/low temperatures
 * - Shows weather icon
 * - Handles loading and error states
 * - Clickable to open full weather app
 *
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5
 *
 * @param props - WeatherWidgetProps
 */
export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  city,
  onWidgetClick,
  className = '',
}) => {
  const { weather, isLoading, error } = useWeather();

  const handleClick = () => {
    if (!isLoading && !error) {
      onWidgetClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`${styles.weatherWidget} ${className}`}>
        <div className={styles.content}>
          <div className={styles.loadingSkeleton}>
            <div className={styles.skeletonCity}></div>
            <div className={styles.skeletonTemp}></div>
            <div className={styles.skeletonCondition}></div>
            <div className={styles.skeletonHighLow}></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !weather) {
    return (
      <div
        className={`${styles.weatherWidget} ${styles.error} ${className}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Weather widget - error loading weather data"
      >
        <div className={styles.content}>
          <div className={styles.city}>{city}</div>
          <div className={styles.errorMessage}>
            <Cloud size={32} className={styles.errorIcon} />
            <div className={styles.errorText}>
              {error || 'Unable to load weather'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get the appropriate icon component
  const IconComponent = WEATHER_ICON_MAP[weather.icon];
  const iconColor = getIconColor(weather.icon);

  return (
    <div
      className={`${styles.weatherWidget} ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Weather widget for ${city}, ${weather.temperature} degrees, ${weather.condition}. High ${weather.high} degrees, low ${weather.low} degrees. Click to open weather forecast.`}
      aria-expanded="false"
    >
      <div className={styles.content}>
        <div className={styles.city} aria-hidden="true">
          {city}
        </div>

        <div className={styles.temperature} aria-hidden="true">
          {weather.temperature}°
        </div>

        <div className={styles.conditionRow}>
          <IconComponent
            size={20}
            className={styles.weatherIcon}
            style={{ color: iconColor }}
            aria-hidden="true"
          />
          <span className={styles.condition} aria-hidden="true">
            {weather.condition}
          </span>
        </div>

        <div className={styles.highLow} aria-hidden="true">
          H:{weather.high}° L:{weather.low}°
        </div>
      </div>
    </div>
  );
};
