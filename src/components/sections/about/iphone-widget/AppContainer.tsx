'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X, ChevronLeft } from 'lucide-react';
import { AppContainerProps } from './types';
import { appContainerVariants, SWIPE_CONFIG } from './utils/animations';
import styles from './AppContainer.module.css';

/**
 * AppContainer Component
 *
 * Container for opened apps with iOS-style transitions and gestures.
 *
 * Features:
 * - Slide-up animation on app open (300ms)
 * - Navigation bar with back button
 * - Swipe-down gesture to close
 * - Glassmorphism background
 * - Scrollable content area
 * - No body scroll lock (inline widget)
 *
 * @param props - AppContainerProps
 */
export const AppContainer: React.FC<AppContainerProps> = ({
  app,
  onClose,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Get current theme from HTML attribute
  useEffect(() => {
    const updateTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setCurrentTheme(theme === 'light' ? 'light' : 'dark');
    };

    updateTheme();

    // Listen for theme changes
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  /**
   * Handle drag end to close on swipe down
   */
  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    // Only allow downward swipes
    if (info.offset.y < 0) return;

    // Check if swipe threshold is met
    const shouldClose =
      info.offset.y > SWIPE_CONFIG.threshold ||
      info.velocity.y > SWIPE_CONFIG.velocity;

    if (shouldClose) {
      onClose();
    }
  };

  /**
   * Handle touch start for swipe gesture
   */
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only handle swipe from nav bar area
    const target = e.target as HTMLElement;
    if (
      target.closest(`.${styles.navBar}`) ||
      target.closest(`.${styles.swipeIndicator}`)
    ) {
      // Allow drag to proceed
      return;
    }
  };

  // Body scroll lock removed - not needed for inline widget

  // Keyboard navigation removed - not needed for inline widget

  /**
   * Get app title for navigation bar
   */
  const getAppTitle = (appType: string): string => {
    const titles: Record<string, string> = {
      about: 'About',
      projects: 'Projects',
      resume: 'Resume',
      phone: 'Phone',
      email: 'Mail',
      weather: 'Weather',
    };
    return titles[appType] || 'App';
  };

  return (
    <AnimatePresence mode="wait">
      {app && (
        <motion.div
          ref={containerRef}
          className={`${styles.appContainer} ${currentTheme === 'light' ? styles.lightTheme : styles.darkTheme}`}
          variants={
            prefersReducedMotion
              ? {
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 },
                  exit: { opacity: 0 },
                }
              : appContainerVariants
          }
          initial="hidden"
          animate="visible"
          exit="exit"
          drag="y"
          dragConstraints={{ top: 0, bottom: 200 }}
          dragElastic={{ top: 0, bottom: 0.5 }}
          onDragEnd={handleDragEnd}
          onTouchStart={handleTouchStart}
          dragMomentum={false}
          role="dialog"
          aria-modal="true"
          aria-label={`${getAppTitle(app)} app`}
        >
          {/* Navigation Bar */}
          <div className={styles.navBar}>
            <button
              onClick={onClose}
              className={styles.backButton}
              aria-label="Go back to home screen"
            >
              <ChevronLeft size={24} />
              <span>Back</span>
            </button>

            <h2 className={styles.appTitle}>{getAppTitle(app)}</h2>

            <button
              onClick={onClose}
              className={styles.closeButton}
              aria-label="Close app"
            >
              <X size={20} />
            </button>
          </div>

          {/* Swipe indicator */}
          <div className={styles.swipeIndicator} aria-hidden="true">
            <div className={styles.swipeBar} />
          </div>

          {/* Scrollable content area */}
          <div ref={contentRef} className={styles.contentArea}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
