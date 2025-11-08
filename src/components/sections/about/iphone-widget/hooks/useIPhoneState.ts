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
   * Handle Escape key to close modal and body scroll lock
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isExpanded) {
        handleCollapse();
      }
    };

    if (isExpanded) {
      document.addEventListener('keydown', handleKeyDown);

      // Enhanced body scroll lock for mobile
      const scrollY = window.scrollY;
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      // Prevent scrollbar shift on desktop
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        document.removeEventListener('keydown', handleKeyDown);

        // Restore body scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';

        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
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
