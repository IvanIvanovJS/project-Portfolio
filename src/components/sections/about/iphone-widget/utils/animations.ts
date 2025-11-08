/**
 * Animation configuration for iPhone widget
 * Using Framer Motion animation variants and timing functions
 */

/**
 * Easing functions for smooth animations
 */
export const EASING = {
  // Standard iOS easing curve
  ios: [0.4, 0, 0.2, 1] as const,
  // Smooth ease out
  easeOut: [0, 0, 0.2, 1] as const,
  // Smooth ease in
  easeIn: [0.4, 0, 1, 1] as const,
  // Spring-like bounce
  spring: [0.68, -0.55, 0.265, 1.55] as const,
} as const;

/**
 * Animation durations (in seconds)
 */
export const DURATION = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  verySlow: 0.8,
} as const;

/**
 * iPhone expansion animation configuration
 */
export const EXPAND_ANIMATION = {
  duration: DURATION.slow,
  ease: EASING.ios,
  initial: {
    scale: 1,
    opacity: 1,
  },
  expanded: {
    scale: 1,
    opacity: 1,
  },
  exit: {
    scale: 0.95,
    opacity: 0,
  },
} as const;

/**
 * Backdrop overlay animation
 */
export const BACKDROP_ANIMATION = {
  duration: DURATION.normal,
  ease: EASING.easeOut,
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
} as const;

/**
 * App opening animation (slide up from bottom)
 */
export const APP_OPEN_ANIMATION = {
  duration: DURATION.normal,
  ease: EASING.ios,
  initial: {
    y: '100%',
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
  },
  exit: {
    y: '100%',
    opacity: 0,
  },
} as const;

/**
 * App icon press animation
 */
export const ICON_PRESS_ANIMATION = {
  duration: DURATION.fast,
  ease: EASING.easeOut,
  tap: {
    scale: 0.9,
  },
  hover: {
    scale: 1.05,
  },
} as const;

/**
 * Modal animation variants for Framer Motion
 */
export const modalVariants = {
  hidden: {
    scale: 0.95,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: DURATION.slow,
      ease: EASING.ios,
    },
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASING.easeIn,
    },
  },
};

/**
 * Backdrop animation variants
 */
export const backdropVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: DURATION.normal,
      ease: EASING.easeOut,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASING.easeIn,
    },
  },
};

/**
 * App container animation variants
 */
export const appContainerVariants = {
  hidden: {
    y: '100%',
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: DURATION.normal,
      ease: EASING.ios,
    },
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASING.ios,
    },
  },
};

/**
 * Stagger animation for app icons
 */
export const staggerContainerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

/**
 * Individual app icon animation
 */
export const appIconVariants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: DURATION.normal,
      ease: EASING.spring,
    },
  },
};

/**
 * Swipe gesture configuration
 */
export const SWIPE_CONFIG = {
  // Minimum distance to trigger swipe (in pixels)
  threshold: 50,
  // Velocity threshold (pixels per second)
  velocity: 500,
  // Drag constraint
  dragConstraint: {
    top: 0,
    bottom: 200,
  },
} as const;

/**
 * Spring animation configuration for smooth physics-based animations
 */
export const SPRING_CONFIG = {
  default: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  },
  gentle: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 25,
  },
  bouncy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 20,
  },
} as const;

/**
 * Transition configuration for reduced motion preference
 */
export const getTransition = (prefersReducedMotion: boolean) => {
  if (prefersReducedMotion) {
    return {
      duration: 0.1,
      ease: EASING.easeOut,
    };
  }
  return {
    duration: DURATION.normal,
    ease: EASING.ios,
  };
};
