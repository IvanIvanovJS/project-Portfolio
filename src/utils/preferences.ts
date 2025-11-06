/**
 * Preference Management Constants
 *
 * This file defines constants for managing user preferences (theme and navigation mode)
 * across the application. These constants are used by:
 * - The blocking script in layout.tsx (prevents FOUC)
 * - ThemeProvider (manages theme state)
 * - NavigationProvider (manages navigation state)
 *
 * IMPORTANT: Keep these values in sync with the blocking script in src/app/layout.tsx
 */

import { ThemeMode } from '@/types/theme';
import { NavigationMode } from '@/providers/NavigationProvider';

/**
 * localStorage keys for persisting user preferences
 *
 * These keys are used to store and retrieve user preferences from localStorage.
 * They must match the keys used in the blocking script to ensure consistency.
 */
export const STORAGE_KEYS = {
  /** Key for storing theme preference (light/dark) */
  THEME: 'portfolio-theme',
  /** Key for storing navigation mode preference (horizontal/vertical) */
  NAVIGATION: 'portfolio-navigation',
} as const;

/**
 * Default preference values
 *
 * These defaults are applied when:
 * - User visits the site for the first time (no saved preferences)
 * - localStorage is unavailable or disabled
 * - Stored values are invalid or corrupted
 *
 * Design Decision: Dark theme and vertical navigation provide the best
 * initial experience for the glassmorphism design aesthetic.
 */
export const DEFAULTS = {
  /** Default theme mode - dark theme for optimal glassmorphism effect */
  THEME: 'dark' as ThemeMode,
  /** Default navigation mode - vertical sidebar for better content focus */
  NAVIGATION: 'vertical' as NavigationMode,
} as const;

/**
 * Valid theme mode values
 * Used for runtime validation of stored preferences
 */
export const VALID_THEMES: readonly ThemeMode[] = ['light', 'dark'] as const;

/**
 * Valid navigation mode values
 * Used for runtime validation of stored preferences
 */
export const VALID_NAVIGATION_MODES: readonly NavigationMode[] = [
  'horizontal',
  'vertical',
] as const;

/**
 * Type guard to check if a value is a valid ThemeMode
 *
 * @param value - The value to check
 * @returns True if the value is a valid ThemeMode
 *
 * @example
 * const theme = localStorage.getItem('theme');
 * if (isValidTheme(theme)) {
 *   setTheme(theme);
 * }
 */
export function isValidTheme(value: unknown): value is ThemeMode {
  return (
    typeof value === 'string' &&
    (VALID_THEMES as readonly string[]).includes(value)
  );
}

/**
 * Type guard to check if a value is a valid NavigationMode
 *
 * @param value - The value to check
 * @returns True if the value is a valid NavigationMode
 *
 * @example
 * const nav = localStorage.getItem('navigation');
 * if (isValidNavigationMode(nav)) {
 *   setNavigationMode(nav);
 * }
 */
export function isValidNavigationMode(value: unknown): value is NavigationMode {
  return (
    typeof value === 'string' &&
    (VALID_NAVIGATION_MODES as readonly string[]).includes(value)
  );
}

/**
 * Safely reads a preference from localStorage with validation
 *
 * @param key - The localStorage key to read
 * @param validator - Function to validate the stored value
 * @param defaultValue - Default value to return if validation fails
 * @returns The validated preference value or the default
 *
 * @example
 * const theme = getPreference(
 *   STORAGE_KEYS.THEME,
 *   isValidTheme,
 *   DEFAULTS.THEME
 * );
 */
export function getPreference<T>(
  key: string,
  validator: (value: unknown) => value is T,
  defaultValue: T
): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored && validator(stored)) {
      return stored;
    }
    return defaultValue;
  } catch (error) {
    console.warn(`Failed to read preference "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Safely writes a preference to localStorage
 *
 * @param key - The localStorage key to write
 * @param value - The value to store
 * @returns True if the write was successful, false otherwise
 *
 * @example
 * setPreference(STORAGE_KEYS.THEME, 'dark');
 */
export function setPreference(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`Failed to save preference "${key}":`, error);
    return false;
  }
}
