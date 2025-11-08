'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Copy } from 'lucide-react';
import styles from './Toast.module.css';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastPosition {
  x: number;
  y: number;
}

export interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  position?: ToastPosition | null;
}

/**
 * Toast Component
 *
 * Displays temporary notification messages with glassmorphism styling.
 * Auto-dismisses after specified duration.
 *
 * @param props - ToastProps
 */
export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 3000,
  position = null,
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <XCircle size={20} />;
      case 'info':
        return <Copy size={20} />;
      default:
        return null;
    }
  };

  const toastVariants = {
    hidden: {
      opacity: 0,
      y: position ? 0 : -20,
      x: position ? 0 : 0,
      scale: 0.2,
    },
    visible: {
      opacity: 1,
      y: position ? -70 : 0,
      x: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 20,
        mass: 0.8,
      },
    },
    exit: {
      opacity: 0,
      y: position ? -90 : -20,
      scale: 0.7,
      transition: {
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  // Calculate toast position with viewport boundary checking
  const calculateSafePosition = () => {
    if (!position) return {};

    // Get viewport dimensions
    const viewportWidth =
      typeof window !== 'undefined' ? window.innerWidth : 1920;
    const viewportHeight =
      typeof window !== 'undefined' ? window.innerHeight : 1080;

    // Toast dimensions - use 90vw max or 440px, whichever is smaller
    const toastMaxWidth = Math.min(viewportWidth * 0.9, 440);
    const toastHeight = 70; // Height with padding (can be multi-line now)
    const edgePadding = 30; // Increased padding from viewport edges
    const animationOffset = 70; // Toast moves up by 70px during animation

    let { x, y } = position;

    // Clamp horizontal position to keep toast fully visible
    // Toast is centered on x, so we need half width on each side
    const halfWidth = toastMaxWidth / 2;
    const minX = halfWidth + edgePadding;
    const maxX = viewportWidth - halfWidth - edgePadding;

    x = Math.max(minX, Math.min(x, maxX));

    // Clamp vertical position accounting for animation
    // Toast animates upward by animationOffset pixels
    const finalY = y - animationOffset;
    const minY = toastHeight / 2 + edgePadding;
    const maxY = viewportHeight - toastHeight / 2 - edgePadding;

    // Adjust starting Y to ensure final position is within bounds
    if (finalY < minY) {
      y = minY + animationOffset;
    } else if (finalY > maxY) {
      y = maxY + animationOffset;
    }

    return {
      left: `${x}px`,
      top: `${y}px`,
    };
  };

  const positionStyle = calculateSafePosition();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`${styles.toast} ${styles[type]} ${position ? styles.positioned : ''}`}
          role="alert"
          aria-live="polite"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={toastVariants}
          style={positionStyle}
        >
          <div className={styles.icon}>{getIcon()}</div>
          <p className={styles.message}>{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
