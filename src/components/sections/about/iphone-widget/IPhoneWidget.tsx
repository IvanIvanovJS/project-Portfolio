'use client';

import React, { useRef, useEffect } from 'react';
import { IPhoneWidgetProps, AppType } from './types';
import { useIPhoneState } from './hooks/useIPhoneState';
import { IPhoneFrame } from './IPhoneFrame';
import { SystemBar } from './SystemBar';
import { HomeScreen } from './HomeScreen';
import { APPS } from './utils/appConfig';
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
  personalInfo: _personalInfo,
  projects: _projects,
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

  return (
    <>
      {/* Thumbnail state */}
      {!isExpanded && (
        <div ref={triggerRef} className={`${styles.thumbnail} ${className}`}>
          <IPhoneFrame isExpanded={false} onClick={handleExpand}>
            <SystemBar currentTime={currentTime} showNotch={true} />
            <HomeScreen onAppClick={handleAppClickInternal} apps={APPS} />
          </IPhoneFrame>
        </div>
      )}

      {/* Expanded modal state */}
      {isExpanded && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="iPhone widget"
        >
          {/* Backdrop */}
          <div className={styles.backdrop} aria-hidden="true" />

          {/* Modal content */}
          <div ref={modalRef} className={styles.modalContent}>
            <IPhoneFrame isExpanded={true}>
              <SystemBar currentTime={currentTime} showNotch={true} />
              {activeApp === null ? (
                <HomeScreen onAppClick={handleAppClickInternal} apps={APPS} />
              ) : (
                <div className={styles.appView}>
                  {/* TODO: Render active app component */}
                  <div className={styles.appPlaceholder}>
                    <button
                      onClick={handleAppClose}
                      className={styles.backButton}
                    >
                      ← Back
                    </button>
                    <p>App: {activeApp}</p>
                  </div>
                </div>
              )}
            </IPhoneFrame>
          </div>
        </div>
      )}
    </>
  );
};
