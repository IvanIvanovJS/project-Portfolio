'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeMode } from '../types/theme';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

// Storage key must match the blocking script in layout.tsx
const THEME_STORAGE_KEY = 'portfolio-theme';

// Default theme is 'dark' - no system preference detection
const DEFAULT_THEME: ThemeMode = 'dark';

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize with default theme (dark)
  const [theme, setThemeState] = useState<ThemeMode>(DEFAULT_THEME);
  const [isLoading, setIsLoading] = useState(true);

  // Sync initial state with HTML data-theme attribute set by blocking script
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

  // Update HTML attribute and localStorage when theme changes
  useEffect(() => {
    if (!isLoading) {
      // Set data-theme attribute on document root
      document.documentElement.setAttribute('data-theme', theme);

      // Persist to localStorage with error handling
      try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error);
      }
    }
  }, [theme, isLoading]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
