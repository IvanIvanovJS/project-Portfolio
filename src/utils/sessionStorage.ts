/**
 * Session Storage Management Utilities
 *
 * This file provides utilities for managing session-based storage across the application.
 * Session storage persists data only for the current browser session (tab/window).
 * Data is cleared when the tab/window is closed.
 *
 * Used by:
 * - SplashScreen component (sphere expansion state)
 * - iPhone Widget Tutorial Hint (interaction tracking)
 */

/**
 * sessionStorage keys for persisting session-based data
 *
 * These keys are used to store and retrieve session data from sessionStorage.
 * Data stored here will be cleared when the browser tab/window is closed.
 */
export const SESSION_STORAGE_KEYS = {
  /** Key for storing splash screen shown state */
  SPLASH_SHOWN: 'portfolio-splash-shown',
  /** Key for storing sphere expansion state */
  SPHERE_EXPANDED: 'sphere-expanded',
  /** Key for storing iPhone widget interaction flag */
  WIDGET_INTERACTED: 'iphone-widget-interacted',
} as const;

/**
 * Check if user has interacted with the iPhone widget in the current session
 *
 * @returns True if the user has clicked/tapped the widget, false otherwise
 *
 * @example
 * if (!hasWidgetInteraction()) {
 *   // Show tutorial hint
 * }
 */
export function hasWidgetInteraction(): boolean {
  try {
    const value = sessionStorage.getItem(
      SESSION_STORAGE_KEYS.WIDGET_INTERACTED
    );
    return value === 'true';
  } catch (error) {
    console.warn('Failed to read widget interaction flag:', error);
    return false;
  }
}

/**
 * Mark the iPhone widget as interacted in the current session
 *
 * This should be called when the user clicks or taps on the widget.
 * The flag will persist for the current session and be cleared when
 * the browser tab/window is closed.
 *
 * @example
 * const handleWidgetClick = () => {
 *   setWidgetInteraction();
 *   // Continue with widget interaction logic
 * };
 */
export function setWidgetInteraction(): void {
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEYS.WIDGET_INTERACTED, 'true');
  } catch (error) {
    console.warn('Failed to save widget interaction flag:', error);
    // Fail silently - feature will still work, just won't persist
  }
}

/**
 * Clear the iPhone widget interaction flag
 *
 * This is primarily used for testing purposes to reset the interaction state.
 * In normal usage, the flag is automatically cleared when the session ends.
 *
 * @example
 * // In development/testing
 * clearWidgetInteraction();
 * // Tutorial hint will appear again
 */
export function clearWidgetInteraction(): void {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEYS.WIDGET_INTERACTED);
  } catch (error) {
    console.warn('Failed to clear widget interaction flag:', error);
    // Fail silently
  }
}

/**
 * Safely reads a value from sessionStorage
 *
 * @param key - The sessionStorage key to read
 * @param defaultValue - Default value to return if key doesn't exist or error occurs
 * @returns The stored value or the default
 *
 * @example
 * const sphereExpanded = getSessionValue(
 *   SESSION_STORAGE_KEYS.SPHERE_EXPANDED,
 *   'false'
 * );
 */
export function getSessionValue(key: string, defaultValue: string): string {
  try {
    const value = sessionStorage.getItem(key);
    return value !== null ? value : defaultValue;
  } catch (error) {
    console.warn(`Failed to read session value "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Safely writes a value to sessionStorage
 *
 * @param key - The sessionStorage key to write
 * @param value - The value to store
 * @returns True if the write was successful, false otherwise
 *
 * @example
 * setSessionValue(SESSION_STORAGE_KEYS.SPHERE_EXPANDED, 'true');
 */
export function setSessionValue(key: string, value: string): boolean {
  try {
    sessionStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`Failed to save session value "${key}":`, error);
    return false;
  }
}

/**
 * Safely removes a value from sessionStorage
 *
 * @param key - The sessionStorage key to remove
 * @returns True if the removal was successful, false otherwise
 *
 * @example
 * clearSessionValue(SESSION_STORAGE_KEYS.WIDGET_INTERACTED);
 */
export function clearSessionValue(key: string): boolean {
  try {
    sessionStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Failed to clear session value "${key}":`, error);
    return false;
  }
}
