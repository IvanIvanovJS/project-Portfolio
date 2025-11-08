import { useState, useCallback, useEffect } from 'react';
import { AppType } from '../types';
import { useSystemTime } from './useSystemTime';

/**
 * Custom hook for managing iPhone widget state
 * Handles expansion, active app, and system time state
 *
 * @returns State and handlers for iPhone widget
 */
export const useIPhoneState = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeApp, setActiveApp] = useState<AppType | null>(null);
  const currentTime = useSystemTime();

  /**
   * Expand iPhone to fullscreen modal
   */
  const handleExpand = useCallback(() => {
    setIsExpanded(true);
  }, []);

  /**
   * Collapse iPhone back to thumbnail
   */
  const handleCollapse = useCallback(() => {
    setIsExpanded(false);
    setActiveApp(null); // Reset active app when closing
  }, []);

  /**
   * Open a specific app
   */
  const handleAppClick = useCallback((appType: AppType) => {
    setActiveApp(appType);
  }, []);

  /**
   * Close active app and return to home screen
   */
  const handleAppClose = useCallback(() => {
    setActiveApp(null);
  }, []);

  /**
   * Handle Escape key to close modal
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isExpanded) {
        handleCollapse();
      }
    };

    if (isExpanded) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isExpanded, handleCollapse]);

  return {
    isExpanded,
    activeApp,
    currentTime,
    handleExpand,
    handleCollapse,
    handleAppClick,
    handleAppClose,
  };
};
