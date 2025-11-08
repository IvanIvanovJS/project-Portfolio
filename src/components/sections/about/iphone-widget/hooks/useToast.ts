import { useState, useCallback } from 'react';
import { ToastType } from '../Toast';

interface ToastState {
  message: string;
  type: ToastType;
  isVisible: boolean;
}

/**
 * Custom hook for managing toast notifications
 *
 * @returns Toast state and show/hide functions
 */
export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  /**
   * Show a toast notification
   */
  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToast({
      message,
      type,
      isVisible: true,
    });
  }, []);

  /**
   * Hide the toast notification
   */
  const hideToast = useCallback(() => {
    setToast((prev) => ({
      ...prev,
      isVisible: false,
    }));
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
};
