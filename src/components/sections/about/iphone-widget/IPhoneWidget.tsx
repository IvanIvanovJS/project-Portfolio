'use client';

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IPhoneWidgetProps, AppType } from './types';
import { useIPhoneState } from './hooks/useIPhoneState';
import { IPhoneFrame } from './IPhoneFrame';
import { SystemBar } from './SystemBar';
import { HomeScreen } from './HomeScreen';
import { AppContainer } from './AppContainer';
import { APPS } from './utils/appConfig';
import { useFocusTrap } from './hooks/useFocusTrap';
import { AboutApp, ProjectsApp, PhoneApp } from './apps';
import styles from './IPhoneWidget.module.css';

/**
 * IPhoneWidget Component
 *
 * Main orchestrator component for the interactive iPhone widget.
 * Manages state for expansion, active apps, and system time.
 *
 * Features:
 * - Thumbnail and expanded modal states
 * - App navigation and state management
 * - Keyboard event handling (Escape to close)
 * - Outside click detection for modal closing
 * - Focus trap when expanded
 * - Body scroll lock when modal is open
 *
 * @param props - IPhoneWidgetProps
 */
export const IPhoneWidget: React.FC<IPhoneWidgetProps> = ({
  personalInfo,
  projects,
  resumeUrl: _resumeUrl,
  githubUrl,
  linkedinUrl,
  className = '',
}) => {
  const {
    isExpanded,
    activeApp,
    currentTime,
    handleExpand,
    handleCollapse,
    handleAppClick,
    handleAppClose,
  } = useIPhoneState();

  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Enable focus trap when modal is expanded
  useFocusTrap(modalRef, isExpanded);

  /**
   * Handle outside click to close modal
   */
  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleCollapse();
      }
    };

    // Add slight delay to prevent immediate closing on expand click
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, handleCollapse]);

  /**
   * Return focus to trigger element when modal closes
   */
  useEffect(() => {
    if (!isExpanded && triggerRef.current) {
      triggerRef.current.focus();
    }
  }, [isExpanded]);

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Handle app click with external link support
   */
  const handleAppClickInternal = (appId: string) => {
    const app = APPS.find((a) => a.id === appId);

    if (!app) return;

    // Handle decorative apps
    if (!app.functional) {
      // TODO: Show tooltip or subtle animation
      console.log('Decorative app clicked:', app.name);
      return;
    }

    // Handle external links
    if (appId === 'github') {
      window.open(githubUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    if (appId === 'linkedin') {
      window.open(linkedinUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // Handle functional apps
    handleAppClick(appId as AppType);
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 0.5,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 0.3,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 0.5,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 0.3,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <>
      {/* Thumbnail state */}
      {!isExpanded && (
        <div
          ref={triggerRef}
          className={`${styles.thumbnail} ${className}`}
          tabIndex={0}
          role="button"
          aria-expanded="false"
          aria-label="Open iPhone widget"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleExpand();
            }
          }}
        >
          <IPhoneFrame isExpanded={false} onClick={handleExpand}>
            <SystemBar currentTime={currentTime} showNotch={true} />
            <HomeScreen onAppClick={handleAppClickInternal} apps={APPS} />
          </IPhoneFrame>
        </div>
      )}

      {/* Expanded modal state with AnimatePresence */}
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.div
            className={styles.modalOverlay}
            role="dialog"
            aria-modal="true"
            aria-label="iPhone widget"
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Backdrop with fade animation */}
            <motion.div
              className={styles.backdrop}
              aria-hidden="true"
              variants={backdropVariants}
            />

            {/* Modal content with scale animation */}
            <motion.div
              ref={modalRef}
              className={styles.modalContent}
              variants={modalVariants}
            >
              <IPhoneFrame isExpanded={true}>
                <SystemBar currentTime={currentTime} showNotch={true} />
                {activeApp === null ? (
                  <HomeScreen onAppClick={handleAppClickInternal} apps={APPS} />
                ) : (
                  <AppContainer app={activeApp} onClose={handleAppClose}>
                    {activeApp === 'about' && (
                      <AboutApp personalInfo={personalInfo} />
                    )}
                    {activeApp === 'projects' && (
                      <ProjectsApp projects={projects} />
                    )}
                    {activeApp === 'phone' && (
                      <PhoneApp personalInfo={personalInfo} />
                    )}
                    {activeApp !== 'about' &&
                      activeApp !== 'projects' &&
                      activeApp !== 'phone' && (
                        <div style={{ padding: '20px', color: 'white' }}>
                          <p>App content for: {activeApp}</p>
                          <p>
                            This will be replaced with actual app components
                          </p>
                        </div>
                      )}
                  </AppContainer>
                )}
              </IPhoneFrame>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
