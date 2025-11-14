/**
 * App configuration constants for iPhone widget
 */

import { AppConfig } from '../types';

/**
 * Standard iOS app grid configuration
 * 4 columns × 6 rows with dock at bottom
 */
export const APPS: AppConfig[] = [
  // Row 1 - Functional apps
  {
    id: 'about',
    name: 'About',
    icon: 'User',
    color: '#007AFF',
    colorDark: '#0A84FF',
    functional: true,
  },
  {
    id: 'projects',
    name: 'Projects',
    icon: 'FolderGit2',
    color: '#5856D6',
    colorDark: '#5E5CE6',
    functional: true,
  },
  {
    id: 'resume',
    name: 'Resume',
    icon: 'FileText',
    color: '#FF9500',
    colorDark: '#FF9F0A',
    functional: true,
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: 'Github',
    color: '#000000',
    colorDark: '#FFFFFF',
    functional: true,
  },

  // Row 2 - Communication apps
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'Linkedin',
    color: '#0A66C2',
    colorDark: '#0A66C2',
    functional: true,
  },
  {
    id: 'phone',
    name: 'Phone',
    icon: 'Phone',
    color: '#34C759',
    colorDark: '#30D158',
    functional: true,
  },
  {
    id: 'email',
    name: 'Mail',
    icon: 'Mail',
    color: '#007AFF',
    colorDark: '#0A84FF',
    functional: true,
  },

  // Row 3 - More functional apps
  {
    id: 'weather',
    name: 'Weather',
    icon: 'Cloud',
    color: '#007AFF',
    colorDark: '#0A84FF',
    functional: true,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: 'Youtube',
    color: '#FF0000',
    colorDark: '#FF0000',
    functional: false,
  },
  {
    id: 'safari',
    name: 'Safari',
    icon: 'Compass',
    color: '#007AFF',
    colorDark: '#0A84FF',
    functional: false,
  },
  {
    id: 'photos',
    name: 'Photos',
    icon: 'Image',
    color: '#FF3B30',
    colorDark: '#FF453A',
    functional: false,
  },
  {
    id: 'camera',
    name: 'Camera',
    icon: 'Camera',
    color: '#8E8E93',
    colorDark: '#8E8E93',
    functional: false,
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: 'Settings',
    color: '#8E8E93',
    colorDark: '#8E8E93',
    functional: false,
  },

  // Row 4 - More decorative apps
  {
    id: 'maps',
    name: 'Maps',
    icon: 'Map',
    color: '#007AFF',
    colorDark: '#0A84FF',
    functional: false,
  },
  {
    id: 'calendar',
    name: 'Calendar',
    icon: 'Calendar',
    color: '#FF3B30',
    colorDark: '#FF453A',
    functional: false,
  },
];

/**
 * Dock apps (bottom row)
 */
export const DOCK_APPS: AppConfig[] = [
  {
    id: 'phone',
    name: 'Phone',
    icon: 'Phone',
    color: '#34C759',
    colorDark: '#30D158',
    functional: true,
  },
  {
    id: 'email',
    name: 'Mail',
    icon: 'Mail',
    color: '#007AFF',
    colorDark: '#0A84FF',
    functional: true,
  },
  {
    id: 'safari',
    name: 'Safari',
    icon: 'Compass',
    color: '#007AFF',
    colorDark: '#0A84FF',
    functional: false,
  },
  {
    id: 'music',
    name: 'Music',
    icon: 'Music',
    color: '#FF2D55',
    colorDark: '#FF375F',
    functional: false,
  },
];

/**
 * iPhone 14 Pro dimensions (logical pixels)
 */
export const IPHONE_DIMENSIONS = {
  width: 393,
  height: 852,
  aspectRatio: 393 / 852,
  notchWidth: 126,
  notchHeight: 37,
  cornerRadius: 55,
  screenInset: 14,
  screenRadius: 45,
} as const;

/**
 * Grid layout configuration
 */
export const GRID_CONFIG = {
  columns: 4,
  rows: 6,
  gap: 16,
  iconSize: 60,
  iconRadius: 13,
  labelFontSize: 12,
  dockHeight: 96,
} as const;

/**
 * Decorative app click message
 */
export const DECORATIVE_APP_MESSAGE = 'This app is for visual purposes only';

/**
 * External link security attributes
 */
export const EXTERNAL_LINK_ATTRS = {
  target: '_blank',
  rel: 'noopener noreferrer',
} as const;
