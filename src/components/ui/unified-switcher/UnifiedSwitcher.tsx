'use client';
import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { Sun, Moon, LayoutGrid, ListCollapse, Menu } from 'lucide-react';
import { useThemeContext } from '../../../providers/ThemeProvider';
import { useNavigation } from '../../../providers/NavigationProvider';
import styles from './UnifiedSwitcher.module.css';

interface UnifiedSwitcherProps {
  className?: string;
  instanceId?: string;
}

export const UnifiedSwitcher: React.FC<UnifiedSwitcherProps> = ({
  className = '',
  instanceId,
}) => {
  const { theme, setTheme } = useThemeContext();
  const { navigationMode, toggleNavigationMode } = useNavigation();
  const switcherRef = useRef<HTMLFieldSetElement>(null);
  const prevIndexRef = useRef<number | null>(null);
  const isInitialMount = useRef(true);
  const [isMobile, setIsMobile] = useState(false);

  // Generate unique ID for this instance
  const [uniqueId] = useState(
    () =>
      instanceId ||
      `unified-switcher-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  );

  // Current index based on theme (0 for light, 1 for dark)
  const currentIndex = theme === 'light' ? 0 : 1;

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Use useLayoutEffect to ensure synchronous updates before paint
  useLayoutEffect(() => {
    // On initial mount, set prevIndexRef to current theme
    if (isInitialMount.current) {
      prevIndexRef.current = currentIndex;
      isInitialMount.current = false;
      // Force initial c-previous attribute
      if (switcherRef.current) {
        switcherRef.current.setAttribute(
          'c-previous',
          String(currentIndex + 1)
        );
      }
      return;
    }

    // On subsequent updates, update the c-previous attribute
    if (
      switcherRef.current &&
      prevIndexRef.current !== null &&
      currentIndex !== prevIndexRef.current
    ) {
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
      isMobile ? (
        <ListCollapse size={18} />
      ) : (
        <LayoutGrid size={18} />
      )
    ) : (
      <Menu size={18} />
    );

  return (
    <fieldset
      ref={switcherRef}
      className={`${styles.switcher} ${className}`}
      c-previous={String(currentIndex + 1)}
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

      <label className={styles.switcherOption} htmlFor={`${uniqueId}-light`}>
        <input
          type="radio"
          id={`${uniqueId}-light`}
          name={uniqueId}
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

      <label className={styles.switcherOption} htmlFor={`${uniqueId}-dark`}>
        <input
          type="radio"
          id={`${uniqueId}-dark`}
          name={uniqueId}
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
