/**
 * useTutorialHint Hook
 *
 * Manages the tutorial hint state, viewport detection, and user interaction tracking
 * for the iPhone widget tutorial animation.
 *
 * This hook handles:
 * - Viewport visibility detection using IntersectionObserver
 * - Session storage integration for interaction tracking
 * - Animation cycle timing and state management
 * - Target position calculations for the hand cursor
 */

import { useState, useCallback, useEffect, RefObject } from 'react';
import {
  hasWidgetInteraction,
  setWidgetInteraction,
} from '@/utils/sessionStorage';
import type { TargetPositions } from '../components/TutorialHint';

/**
 * Calculate target positions for the hand cursor animation
 * based on the widget layout and dimensions
 *
 * @param widgetElement - The widget container element
 * @param isHovered - Whether the widget is currently hovered (desktop only)
 * @returns Target positions for About app icon and back button
 */
function calculateTargetPositions(
  widgetElement: HTMLElement | null,
  isHovered: boolean = false
): TargetPositions {
  // Default positions if widget element is not available
  if (!widgetElement) {
    return {
      aboutApp: { x: 0, y: 0 },
      backButton: { x: 0, y: 0 },
    };
  }

  // Detect if mobile viewport (widget width < 400px)
  const isMobile = window.innerWidth < 769;

  // Find the IPhoneFrame element to get its actual transform
  const iphoneFrame = widgetElement.querySelector(
    '[class*="iphoneFrame"]'
  ) as HTMLElement;

  // Calculate actual frame scale and position from the DOM
  // On desktop: 0.65 default, 0.95 when hovered
  // On mobile: always 1.0
  let frameScale = isMobile ? 1.0 : isHovered ? 0.95 : 0.65;
  let frameOffsetX = 0;
  let frameOffsetY = 0;

  if (iphoneFrame) {
    // Get the computed transform matrix
    const computedStyle = window.getComputedStyle(iphoneFrame);
    const transform = computedStyle.transform;

    // Parse the scale from the transform matrix
    if (transform && transform !== 'none') {
      const matrix = transform.match(/matrix\(([^)]+)\)/);
      if (matrix) {
        const values = matrix[1].split(',').map((v) => parseFloat(v.trim()));
        // matrix(scaleX, skewY, skewX, scaleY, translateX, translateY)
        frameScale = values[0]; // scaleX
      }
    }

    // Get the actual bounding rect to calculate offset

    const frameRect = iphoneFrame.getBoundingClientRect();
    const widgetRect = widgetElement.getBoundingClientRect();

    // Calculate offset from widget container to frame
    frameOffsetX = frameRect.left - widgetRect.left;
    frameOffsetY = frameRect.top - widgetRect.top;
  }

  // IPhoneFrame dimensions
  const frameWidth = 300; // Base width from .thumbnail

  // Frame border and bezel (from IPhoneFrame.module.css)
  // frameOuter has padding: 2px (desktop) or 1.5px (mobile)
  const frameBorder = isMobile ? 1.5 : 2;

  // HomeScreen grid configuration
  // From HomeScreen.module.css:
  // - padding: 260px 24px 24px (desktop) or 155px 16px 16px (mobile)
  // - grid: 4 columns with gap: 28px 20px (desktop) or 20px 16px (mobile)
  const gridPadding = {
    top: isMobile ? 155 : 260,
    left: isMobile ? 16 : 24,
  };

  const gridGap = {
    row: isMobile ? 20 : 28,
    column: isMobile ? 16 : 20,
  };

  // Icon size from appConfig: 60px
  const iconSize = 40;

  // Calculate available width for grid (inside the frame)
  const screenWidth = frameWidth - frameBorder * 2;
  const availableWidth = screenWidth - gridPadding.left * 2;
  const columnWidth = (availableWidth - gridGap.column * 3) / 4;

  // Hand cursor icon size (from TutorialHint.module.css)
  const handIconSize = 28;
  const handOffset = handIconSize;

  // About app is in first row, first column (index 0)
  // Position calculation:
  // 1. Start with frame border
  // 2. Add grid padding
  // 3. Add half column width to get to center of first column
  // 4. Apply frame scale
  // 5. Add frame offset (position of frame within widget container)
  // 6. Subtract hand offset to center the hand icon
  const aboutAppXInFrame = frameBorder + gridPadding.left + columnWidth / 2;
  const aboutAppYInFrame = frameBorder + gridPadding.top + iconSize / 2;

  const aboutAppX = isMobile
    ? aboutAppXInFrame * frameScale + frameOffsetX - handOffset / 2
    : aboutAppXInFrame * frameScale + frameOffsetX - handOffset / 2 + 6;
  const aboutAppY = aboutAppYInFrame * frameScale + frameOffsetY;
  // Back button position in AppContainer
  // From AppContainer.module.css:
  // - AppContainer top: 46px (SystemBar height)
  // - navBar padding: 12px 16px (desktop) or 10px 12px (mobile)
  // - backButton: left: -10px (desktop) or -14px (mobile)
  // - backButton min-width: 44px
  const systemBarHeight = 46;
  const navBarPadding = {
    top: isMobile ? 10 : 12,
    left: isMobile ? 12 : 16,
  };
  const backButtonOffset = isMobile ? -14 : -10;
  const backButtonSize = 44;

  // Back button center position
  const backButtonXInFrame =
    frameBorder + navBarPadding.left + backButtonOffset + backButtonSize / 2;
  const backButtonYInFrame =
    frameBorder + systemBarHeight + navBarPadding.top + backButtonSize / 2;

  const backButtonX = isMobile
    ? backButtonXInFrame * frameScale + frameOffsetX + 6
    : isHovered
      ? backButtonXInFrame * frameScale + frameOffsetX + handOffset / 2 + 4
      : backButtonXInFrame * frameScale + frameOffsetX + handOffset / 2 - 4;

  const backButtonY = backButtonYInFrame * frameScale + frameOffsetY;

  return {
    aboutApp: {
      x: aboutAppX,
      y: aboutAppY,
    },
    backButton: {
      x: backButtonX,
      y: backButtonY,
    },
  };
}

/**
 * Return type for the useTutorialHint hook
 */
export interface UseTutorialHintReturn {
  /**
   * Whether the tutorial hint should be displayed
   */
  shouldShowHint: boolean;

  /**
   * Target positions for the hand cursor animation
   */
  targetPositions: TargetPositions;

  /**
   * Callback to handle animation cycle completion
   */
  handleAnimationComplete: () => void;

  /**
   * Callback to handle user interaction with the widget
   */
  handleUserInteraction: () => void;

  /**
   * Callback to handle animation phase changes (for triggering app actions)
   */
  onAnimationPhase: (phase: 'click-about' | 'click-back') => void;
}

/**
 * Props for the useTutorialHint hook
 */
export interface UseTutorialHintProps {
  /**
   * Reference to the widget container element
   */
  widgetRef: RefObject<HTMLElement>;

  /**
   * Whether the widget modal is currently open
   */
  isModalOpen: boolean;

  /**
   * Callback to open the About app
   */
  onOpenAbout: () => void;

  /**
   * Callback to close the current app
   */
  onCloseApp: () => void;
}

/**
 * Custom hook for managing tutorial hint state and behavior
 *
 * @param props - UseTutorialHintProps
 * @returns Tutorial hint state and handlers
 *
 * @example
 * const widgetRef = useRef<HTMLDivElement>(null);
 * const {
 *   shouldShowHint,
 *   targetPositions,
 *   handleAnimationComplete,
 *   handleUserInteraction,
 *   onAnimationPhase
 * } = useTutorialHint({
 *   widgetRef,
 *   isModalOpen,
 *   onOpenAbout: () => handleAppClick('about'),
 *   onCloseApp: handleAppClose
 * });
 */
export function useTutorialHint({
  widgetRef,
  isModalOpen,
  onOpenAbout,
  onCloseApp,
}: UseTutorialHintProps): UseTutorialHintReturn {
  // State management
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(() => {
    // Initialize from session storage on mount
    return hasWidgetInteraction();
  });
  const [isInViewport, setIsInViewport] = useState(false);
  const [animationCycle, setAnimationCycle] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [targetPositions, setTargetPositions] = useState<TargetPositions>({
    aboutApp: { x: 0, y: 0 },
    backButton: { x: 0, y: 0 },
  });

  // Track hover state for desktop
  useEffect(() => {
    const widgetElement = widgetRef.current;
    if (!widgetElement) {
      return;
    }

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    widgetElement.addEventListener('mouseenter', handleMouseEnter);
    widgetElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      widgetElement.removeEventListener('mouseenter', handleMouseEnter);
      widgetElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [widgetRef]);

  // Calculate target positions based on widget dimensions
  // This must be done in an effect to avoid accessing refs during render
  // Recalculate when widget becomes visible or on resize
  useEffect(() => {
    const widgetElement = widgetRef.current;
    if (!widgetElement) {
      return;
    }

    const updatePositions = () => {
      // Wait for CSS transition to complete (300ms) before reading DOM
      setTimeout(() => {
        const positions = calculateTargetPositions(widgetElement, isHovered);
        setTargetPositions(positions);
      }, 400);
    };

    // Initial calculation
    updatePositions();
  }, [widgetRef, isInViewport, isHovered]);

  // Determine if hint should be shown
  // Show hint when visible and user hasn't interacted
  // Note: We don't check isModalOpen here because the tutorial animation
  // itself opens and closes the modal as part of the demonstration
  const shouldShowHint = isVisible && !hasInteracted;

  // Task 6: Viewport visibility detection with IntersectionObserver
  useEffect(() => {
    const widgetElement = widgetRef.current;

    // Check if IntersectionObserver is supported
    if (!widgetElement) {
      return;
    }

    if (!('IntersectionObserver' in window)) {
      // Fallback: assume widget is visible if IntersectionObserver is not supported
      // Use a microtask to avoid synchronous setState in effect
      Promise.resolve().then(() => setIsInViewport(true));
      return;
    }

    // Create IntersectionObserver with 50% visibility threshold
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Update viewport state when visibility changes
          // Widget is considered "in viewport" when at least 50% is visible
          setIsInViewport(entry.intersectionRatio >= 0.5);
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the widget is visible
      }
    );

    // Start observing the widget element
    observer.observe(widgetElement);

    // Cleanup: disconnect observer on component unmount
    return () => {
      observer.disconnect();
    };
  }, [widgetRef]);

  // Task 8: Animation cycle timing with intervals
  useEffect(() => {
    if (animationCycle > 0) return; // <-- prevent reruns
    if (hasInteracted || isModalOpen) return;
    if (!isInViewport) return;

    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(initialTimer);
  }, [isInViewport, hasInteracted, isModalOpen, animationCycle]);

  // Separate effect for repeat timer that triggers after animation completes
  useEffect(() => {
    // Don't start repeat timer on initial mount (animationCycle === 0)
    if (animationCycle === 0) {
      return;
    }

    // Don't start timer if user has already interacted or modal is open
    if (hasInteracted || isModalOpen) {
      return;
    }

    // Don't start timer if widget is not in viewport
    if (!isInViewport) {
      return;
    }

    // Repeat timer: 15 seconds after animation completes
    const repeatTimer = setTimeout(() => {
      // Only trigger animation if still in viewport and not interacted
      if (isInViewport && !hasInteracted && !isModalOpen) {
        setIsVisible(true);
      }
    }, 8000);

    // Cleanup: clear timer on component unmount or when dependencies change
    return () => {
      clearTimeout(repeatTimer);
    };
  }, [animationCycle, isInViewport, hasInteracted, isModalOpen]);

  /**
   * Handle animation cycle completion
   * Increments the cycle counter to trigger the next animation
   */
  const handleAnimationComplete = useCallback(() => {
    setAnimationCycle((prev) => prev + 1);
    setIsVisible(false);
  }, []);

  /**
   * Handle user interaction with the widget
   * Marks the widget as interacted and hides the hint
   */
  const handleUserInteraction = useCallback(() => {
    setWidgetInteraction();
    setHasInteracted(true);
    setIsVisible(false);
  }, []);

  /**
   * Handle animation phase changes to trigger app actions
   */
  const onAnimationPhase = useCallback(
    (phase: 'click-about' | 'click-back') => {
      if (phase === 'click-about') {
        // Open the About app when hand "clicks" on it
        onOpenAbout();
      } else if (phase === 'click-back') {
        // Close the app when hand "clicks" back button
        onCloseApp();
      }
    },
    [onOpenAbout, onCloseApp]
  );

  return {
    shouldShowHint,
    targetPositions,
    handleAnimationComplete,
    handleUserInteraction,
    onAnimationPhase,
  };
}
