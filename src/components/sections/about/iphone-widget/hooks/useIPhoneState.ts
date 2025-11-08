import { useState, useCallback } from 'react';
import { AppType } from '../types';
import { useSystemTime } from './useSystemTime';

/**
 * Custom hook for managing iPhone widget state
 * Handles active app and system time state (no modal/expansion)
 *
 * @returns State and handlers for iPhone widget
 */
export const useIPhoneState = () => {
  const [activeApp, setActiveApp] = useState<AppType | null>(null);
  const currentTime = useSystemTime();

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

  return {
    activeApp,
    currentTime,
    handleAppClick,
    handleAppClose,
  };
};
