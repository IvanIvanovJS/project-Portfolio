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
import { AboutApp, ProjectsApp, PhoneApp, EmailApp } from './apps';
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

  /**
   * Copy URL to clipboard as fallback
   */
  const copyToClipboard = async (url: string, appName: string) => {
    try {
      await navigator.clipboard.writeText(url);
      showToast(`${appName} URL copied to clipboard`, 'info');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      showToast(`Failed to copy URL`, 'error');
    }
  };

  /**
   * Open external link with visual feedback and fallback
   */
  const openExternalLink = (url: string, appName: string, appId: string) => {
    // Add visual feedback (brief highlight)
    setHighlightedApp(appId);
    setTimeout(() => setHighlightedApp(null), 300);

    try {
      // Attempt to open in new tab
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');

      // Check if popup was blocked
      if (
        !newWindow ||
        newWindow.closed ||
        typeof newWindow.closed === 'undefined'
      ) {
        // Popup blocked - fallback to clipboard
        copyToClipboard(url, appName);
      } else {
        // Successfully opened
        showToast(`Opening ${appName}`, 'success');
      }
    } catch (error) {
      // Error opening link - fallback to clipboard
      console.error('Failed to open external link:', error);
      copyToClipboard(url, appName);
    }
  };

  /**
   * Handle app click with external link support
   */
  const handleAppClickInternal = (appId: string) => {
    const app = APPS.find((a) => a.id === appId);

    if (!app) return;

    // Handle decorative apps
    if (!app.functional) {
      // Show tooltip feedback
      showToast('This app is for visual purposes only', 'info');
      return;
    }

    // Handle external links
    if (appId === 'github') {
      openExternalLink(githubUrl, 'GitHub', appId);
      return;
    }

    if (appId === 'linkedin') {
      openExternalLink(linkedinUrl, 'LinkedIn', appId);
      return;
    }

    // Handle functional apps
    handleAppClick(appId as AppType);
  };

  return (
    <>
      {/* Toast notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

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
              {activeApp !== 'about' &&
                activeApp !== 'projects' &&
                activeApp !== 'phone' &&
                activeApp !== 'email' && (
                  <div style={{ padding: '20px', color: 'white' }}>
                    <p>App content for: {activeApp}</p>
                    <p>This will be replaced with actual app components</p>
                  </div>
                )}
            </AppContainer>
          )}
        </IPhoneFrame>
      </div>
    </>
  );
};
