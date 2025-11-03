'use client';
import React, { useEffect, useRef } from 'react';
import { Sun, Moon, LayoutGrid, Menu } from 'lucide-react';
import { useThemeContext } from '../../../providers/ThemeProvider';
import { useNavigation } from '../../../providers/NavigationProvider';
import styles from './UnifiedSwitcher.module.css';

interface UnifiedSwitcherProps {
  className?: string;
}

export const UnifiedSwitcher: React.FC<UnifiedSwitcherProps> = ({
  className = '',
}) => {
  const { theme, setTheme } = useThemeContext();
  const { navigationMode, toggleNavigationMode } = useNavigation();
  const switcherRef = useRef<HTMLFieldSetElement>(null);
  const prevIndexRef = useRef<number>(0);

  // Current index based on theme (0 for light, 1 for dark)
  const currentIndex = theme === 'light' ? 0 : 1;

  useEffect(() => {
    if (switcherRef.current && currentIndex !== prevIndexRef.current) {
      switcherRef.current.setAttribute(
        'c-previous',
        String(prevIndexRef.current + 1)
      );
      prevIndexRef.current = currentIndex;
    }
  }, [currentIndex]);

  const handleOptionClick = (optionType: 'light' | 'dark' | 'navigation') => {
    if (optionType === 'navigation') {
      // Just toggle navigation, don't change theme
      toggleNavigationMode();
    } else {
      // Change theme
      setTheme(optionType);
    }
  };

  // Determine which navigation icon to show
  const navigationIcon =
    navigationMode === 'horizontal' ? (
      <LayoutGrid size={18} />
    ) : (
      <Menu size={18} />
    );

  return (
    <fieldset
      ref={switcherRef}
      className={`${styles.switcher} ${className}`}
      c-previous="1"
    >
      <legend className={styles.switcherLegend}>
        Theme and navigation controls
      </legend>

      <svg className={styles.switcherFilter}>
        <defs>
          <filter id="unified-switcher">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0" />
          </filter>
        </defs>
      </svg>

      {/* Light Theme Option */}
      <label className={styles.switcherOption} htmlFor="unified-switcher-light">
        <input
          type="radio"
          id="unified-switcher-light"
          name="unified-switcher"
          value="light"
          checked={theme === 'light'}
          onChange={() => handleOptionClick('light')}
          className={styles.switcherInput}
          c-option="1"
          aria-label="Switch to light mode"
        />
        <span className={styles.switcherIcon}>
          <Sun size={18} />
        </span>
      </label>

      {/* Dark Theme Option */}
      <label className={styles.switcherOption} htmlFor="unified-switcher-dark">
        <input
          type="radio"
          id="unified-switcher-dark"
          name="unified-switcher"
          value="dark"
          checked={theme === 'dark'}
          onChange={() => handleOptionClick('dark')}
          className={styles.switcherInput}
          c-option="2"
          aria-label="Switch to dark mode"
        />
        <span className={styles.switcherIcon}>
          <Moon size={18} />
        </span>
      </label>

      {/* Navigation Toggle Button (not a radio) */}
      <button
        type="button"
        className={styles.switcherButton}
        onClick={() => handleOptionClick('navigation')}
        aria-label={`Switch to ${navigationMode === 'horizontal' ? 'vertical' : 'horizontal'} navigation`}
      >
        <span className={styles.switcherIcon}>{navigationIcon}</span>
      </button>
    </fieldset>
  );
};

export default UnifiedSwitcher;
