import { useEffect, RefObject } from 'react';

/**
 * Custom hook for implementing focus trap in modal
 * Traps focus within the modal when it's open and restores focus when closed
 *
 * @param ref - Reference to the modal container element
 * @param isActive - Whether the focus trap should be active
 */
export const useFocusTrap = (
  ref: RefObject<HTMLElement | null>,
  isActive: boolean
) => {
  useEffect(() => {
    if (!isActive || !ref.current) return;

    const modalElement = ref.current;

    // Get all focusable elements within the modal
    const getFocusableElements = (): HTMLElement[] => {
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(', ');

      return Array.from(
        modalElement.querySelectorAll<HTMLElement>(focusableSelectors)
      ).filter((element) => {
        // Filter out hidden elements
        return (
          element.offsetWidth > 0 &&
          element.offsetHeight > 0 &&
          window.getComputedStyle(element).visibility !== 'hidden'
        );
      });
    };

    // Handle Tab key navigation
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Shift + Tab: move focus to last element if on first
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      }
      // Tab: move focus to first element if on last
      else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Focus first focusable element when modal opens
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      // Small delay to ensure modal is fully rendered
      const timeoutId = setTimeout(() => {
        focusableElements[0].focus();
      }, 100);

      // Add event listener
      modalElement.addEventListener('keydown', handleKeyDown);

      return () => {
        clearTimeout(timeoutId);
        modalElement.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isActive, ref]);
};
