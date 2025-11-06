'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeMode } from '../types/theme';
import { STORAGE_KEYS, DEFAULTS } from '@/utils/preferences';

/**
 * Theme context type definition
 *
 * Provides theme state and methods for managing theme preferences
 */
interface ThemeContextType {
  /** Current theme mode (light or dark) */
  theme: ThemeMode;
  /** Toggle between light and dark themes */
  toggleTheme: () => void;
  /** Set a specific theme mode */
  setTheme: (theme: ThemeMode) => void;
  /** Indicates if the provider is still hydrating (client-side only) */
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Storage key for theme preference in localStorage
 *
 * IMPORTANT: This must match the THEME_KEY in the blocking script (src/app/layout.tsx)
 * to ensure consistency between the script and React state.
 */
const THEME_STORAGE_KEY = STORAGE_KEYS.THEME;

/**
 * Default theme mode
 *
 * Default: 'dark'
 * Rationale: Dark theme provides optimal visual experience for glassmorphism design
 *
 * Note: System preference detection (prefers-color-scheme) is intentionally NOT used.
 * All users start with dark theme for consistent initial experience.
 */
const DEFAULT_THEME: ThemeMode = DEFAULTS.THEME;

/**
 * ThemeProvider Component
 *
 * Manages theme state (light/dark mode) for the entire application.
 *
 * ## Architecture
 *
 * This provider works in conjunction with a blocking script in layout.tsx to prevent
 * Flash of Unstyled Content (FOUC):
 *
 * 1. **Blocking Script (runs before first paint)**:
 *    - Reads theme from localStorage
 *    - Sets data-theme attribute on <html> element
 *    - Applies default (dark) if no preference exists
 *
 * 2. **ThemeProvider (runs after React hydration)**:
 *    - Syncs with data-theme attribute (single source of truth)
 *    - Manages theme state in React
 *    - Updates both HTML attribute and localStorage on changes
 *
 * ## Default Behavior
 *
 * - First-time visitors: Dark theme (no system preference detection)
 * - Returning visitors: Previously selected theme
 * - localStorage unavailable: Dark theme (in-memory state only)
 *
 * ## Error Handling
 *
 * - localStorage read errors: Falls back to dark theme
 * - localStorage write errors: Logs warning, continues with in-memory state
 * - Invalid stored values: Validated and replaced with default
 *
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize with default theme (dark) to prevent hydration mismatch
  const [theme, setThemeState] = useState<ThemeMode>(DEFAULT_THEME);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Initialize theme on client-side mount
   *
   * Reads the data-theme attribute set by the blocking script and syncs
   * React state with it. This ensures no visual flash during hydration.
   */
  useEffect(() => {
    const initializeTheme = () => {
      try {
        // Read data-theme attribute from document.documentElement (set by blocking script)
        const htmlTheme = document.documentElement.getAttribute('data-theme');

        // Validate and use the attribute value, fall back to dark if invalid
        if (htmlTheme === 'light' || htmlTheme === 'dark') {
          setThemeState(htmlTheme);
        } else {
          // Fall back to default theme if attribute is missing or invalid
          setThemeState(DEFAULT_THEME);
        }
      } catch (error) {
        // Fallback to default theme if any error occurs
        console.warn('Failed to read theme from HTML attribute:', error);
        setThemeState(DEFAULT_THEME);
      } finally {
        setIsLoading(false);
      }
    };

    initializeTheme();
  }, []);

  /**
   * Persist theme changes to HTML attribute and localStorage
   *
   * Updates both the data-theme attribute (for CSS) and localStorage (for persistence)
   * whenever the theme changes. Skips during initial load to avoid overwriting the
   * blocking script's work.
   */
  useEffect(() => {
    if (!isLoading) {
      // Set data-theme attribute on document root for CSS selectors
      document.documentElement.setAttribute('data-theme', theme);

      // Persist to localStorage with error handling
      try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error);
        // Continue execution - theme will work in-memory but won't persist
      }
    }
  }, [theme, isLoading]);

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  /**
   * Set a specific theme mode
   *
   * @param newTheme - The theme mode to set ('light' or 'dark')
   */
  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to access theme context
 *
 * @returns Theme context with current theme and control methods
 * @throws Error if used outside of ThemeProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { theme, toggleTheme } = useThemeContext();
 *   return <button onClick={toggleTheme}>Current: {theme}</button>;
 * }
 * ```
 */
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
