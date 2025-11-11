/**
 * Type definitions for iPhone Widget components
 */

import { ReactNode } from 'react';

/**
 * Personal information displayed in the About app
 */
export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  phone: string;
  email: string;
  location: string;
}

/**
 * Project data structure for Projects app
 */
export interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  liveUrl?: string;
  repoUrl?: string;
}

/**
 * App types available in the iPhone widget
 */
export type AppType =
  | 'about'
  | 'projects'
  | 'resume'
  | 'phone'
  | 'email'
  | 'github'
  | 'linkedin'
  | 'weather';

/**
 * Configuration for individual app icons
 */
export interface AppConfig {
  id: string;
  name: string;
  icon: ReactNode | string;
  color: string;
  colorDark?: string;
  functional: boolean;
  externalUrl?: string;
  badge?: number;
}

/**
 * Main iPhone widget props
 */
export interface IPhoneWidgetProps {
  personalInfo: PersonalInfo;
  projects: Project[];
  resumeUrl?: string;
  githubUrl: string;
  linkedinUrl: string;
  className?: string;
}

/**
 * iPhone widget state management
 */
export interface IPhoneWidgetState {
  isExpanded: boolean;
  activeApp: AppType | null;
  currentTime: Date;
}

/**
 * iPhone frame component props
 */
export interface IPhoneFrameProps {
  isExpanded: boolean;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

/**
 * System bar component props
 */
export interface SystemBarProps {
  currentTime: Date;
  showNotch?: boolean;
}

/**
 * Home screen component props
 */
export interface HomeScreenProps {
  onAppClick: (
    appType: AppType | string,
    position?: { x: number; y: number }
  ) => void;
  apps: AppConfig[];
  highlightedApp?: string | null;
}

/**
 * App icon component props
 */
export interface AppIconProps {
  app: AppConfig;
  onClick: (position?: { x: number; y: number }) => void;
  size?: 'normal' | 'dock';
  isHighlighted?: boolean;
}

/**
 * App container component props
 */
export interface AppContainerProps {
  app: AppType | null;
  onClose: () => void;
  children: ReactNode;
}

/**
 * System state information
 */
export interface SystemState {
  time: Date;
  battery: number;
  signal: number;
  wifi: boolean;
}

/**
 * Email form data structure
 */
export interface EmailFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Error state for form validation and network errors
 */
export interface ErrorState {
  type: 'validation' | 'network' | 'permission';
  message: string;
  field?: string;
  recoverable: boolean;
}

/**
 * Weather icon types based on weather conditions
 */
export type WeatherIcon =
  | 'sun'
  | 'moon'
  | 'cloud'
  | 'cloud-sun'
  | 'cloud-moon'
  | 'cloud-rain'
  | 'cloud-drizzle'
  | 'cloud-snow'
  | 'cloud-lightning'
  | 'fog';

/**
 * Current weather data structure
 */
export interface CurrentWeather {
  temperature: number;
  condition: string;
  icon: WeatherIcon;
  high: number;
  low: number;
  humidity: number;
  windSpeed: number;
}

/**
 * Daily forecast data structure
 */
export interface DailyForecast {
  date: Date;
  dayName: string;
  high: number;
  low: number;
  condition: string;
  icon: WeatherIcon;
  precipitationChance: number;
}

/**
 * City information for geocoding
 */
export interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

/**
 * Geographic coordinates
 */
export interface Coordinates {
  lat: number;
  lon: number;
}

/**
 * Weather widget component props
 */
export interface WeatherWidgetProps {
  city: string;
  onWidgetClick: () => void;
  className?: string;
}

/**
 * Calendar widget component props
 */
export interface CalendarWidgetProps {
  className?: string;
}

/**
 * Open-Meteo API current weather response
 */
export interface OpenMeteoCurrentResponse {
  current: {
    time: string;
    temperature_2m: number;
    weathercode: number;
    windspeed_10m: number;
    relativehumidity_2m: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

/**
 * Open-Meteo API forecast response
 */
export interface OpenMeteoForecastResponse {
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
}

/**
 * Open-Meteo API geocoding response
 */
export interface OpenMeteoGeocodingResponse {
  results?: Array<{
    name: string;
    country: string;
    latitude: number;
    longitude: number;
    admin1?: string;
  }>;
}
