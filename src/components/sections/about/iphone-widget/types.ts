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
  | 'linkedin';

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
  onAppClick: (appType: AppType | string) => void;
  apps: AppConfig[];
}

/**
 * App icon component props
 */
export interface AppIconProps {
  app: AppConfig;
  onClick: () => void;
  size?: 'normal' | 'dock';
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
