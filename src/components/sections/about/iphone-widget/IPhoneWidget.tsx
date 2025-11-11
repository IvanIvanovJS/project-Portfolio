'use client';

import React, { useState } from 'react';
import { IPhoneWidgetProps, AppType } from './types';
import { useIPhoneState } from './hooks/useIPhoneState';
import { useToast } from './hooks/useToast';
import { IPhoneFrame } from './IPhoneFrame';
import { SystemBar } from './SystemBar';
import { HomeScreen } from './HomeScreen';
import { AppContainer } from './AppContainer';
import { Toast } from './Toast';
import { APPS } from './utils/appConfig';
import { AboutApp, ProjectsApp, PhoneApp, EmailApp, WeatherApp } from './apps';
import styles from './IPhoneWidget.module.css';

/**
 * IPhoneWidget Component
 *
 * Interactive iPhone widget with direct in-place navigation.
 * Manages state for active apps and system time.
 *
 * Features:
 * - Direct app navigation without modal
 * - App state management
 * - External link handling (GitHub, LinkedIn)
 * - Toast notifications for user feedback
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
  const { activeApp, currentTime, handleAppClick, handleAppClose } =
    useIPhoneState();

  const { toast, showToast, hideToast } = useToast();
  const [highlightedApp, setHighlightedApp] = useState<string | null>(null);
  const [toastPosition, setToastPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  /**
   * Open external link with visual feedback
   */
  const openExternalLink = (
    url: string,
    appName: string,
    appId: string,
    position?: { x: number; y: number }
  ) => {
    // Add visual feedback (brief highlight)
    setHighlightedApp(appId);
    setTimeout(() => setHighlightedApp(null), 300);

    try {
      // Open in new tab
      window.open(url, '_blank', 'noopener,noreferrer');

      // Show success message with position
      setToastPosition(position || null);
      showToast(`Successfully redirected to ${appName}`, 'success');
    } catch (error) {
      // Error opening link
      console.error('Failed to open external link:', error);
      setToastPosition(position || null);
      showToast(`Failed to open ${appName}`, 'error');
    }
  };

  /**
   * Handle app click with external link support
   */
  const handleAppClickInternal = (
    appId: string,
    position?: { x: number; y: number }
  ) => {
    const app = APPS.find((a) => a.id === appId);

    if (!app) return;

    // Handle decorative apps - show app name
    if (!app.functional) {
      setToastPosition(position || null);
      showToast(`${app.name} - For visual purposes only`, 'info');
      return;
    }

    // Handle external links
    if (appId === 'github') {
      openExternalLink(githubUrl, 'GitHub', appId, position);
      return;
    }

    if (appId === 'linkedin') {
      openExternalLink(linkedinUrl, 'LinkedIn', appId, position);
      return;
    }

    // Handle functional apps
    handleAppClick(appId as AppType);
  };

  return (
    <>
      {/* Single iPhone widget - no modal, direct navigation */}
      <div className={`${styles.thumbnail} ${className}`}>
        <IPhoneFrame isExpanded={false}>
          <SystemBar currentTime={currentTime} showNotch={true} />
          {activeApp === null ? (
            <HomeScreen
              onAppClick={handleAppClickInternal}
              apps={APPS}
              highlightedApp={highlightedApp}
            />
          ) : (
            <AppContainer app={activeApp} onClose={handleAppClose}>
              {activeApp === 'about' && (
                <AboutApp personalInfo={personalInfo} />
              )}
              {activeApp === 'projects' && <ProjectsApp projects={projects} />}
              {activeApp === 'phone' && (
                <PhoneApp personalInfo={personalInfo} />
              )}
              {activeApp === 'email' && (
                <EmailApp personalInfo={personalInfo} />
              )}
              {activeApp === 'weather' && (
                <WeatherApp onClose={handleAppClose} />
              )}
              {activeApp !== 'about' &&
                activeApp !== 'projects' &&
                activeApp !== 'phone' &&
                activeApp !== 'email' &&
                activeApp !== 'weather' && (
                  <div style={{ padding: '20px', color: 'white' }}>
                    <p>App content for: {activeApp}</p>
                    <p>This will be replaced with actual app components</p>
                  </div>
                )}
            </AppContainer>
          )}
        </IPhoneFrame>
      </div>

      {/* Toast notifications - fixed position, outside iPhone frame */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        position={toastPosition}
      />
    </>
  );
};
