'use client';

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X, ChevronLeft } from 'lucide-react';
import { AppContainerProps } from './types';
import { appContainerVariants, SWIPE_CONFIG } from './utils/animations';
import styles from './AppContainer.module.css';

/**
 * AppContainer Component
 *
 * Modal wrapper for opened apps with iOS-style transitions and gestures.
 *
 * Features:
 * - Slide-up animation on app open (300ms)
 * - Navigation bar with back button
 * - Swipe-down gesture to close
 * - Glassmorphism background
 * - Proper z-index layering
 * - Scrollable content area
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

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
   * Prevent body scroll when app is open
   */
  useEffect(() => {
    if (app) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [app]);

  /**
   * Handle keyboard navigation
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && app) {
        onClose();
      }
    };

    if (app) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [app, onClose]);

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
    };
    return titles[appType] || 'App';
  };

  return (
    <AnimatePresence mode="wait">
      {app && (
        <motion.div
          ref={containerRef}
          className={styles.appContainer}
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
