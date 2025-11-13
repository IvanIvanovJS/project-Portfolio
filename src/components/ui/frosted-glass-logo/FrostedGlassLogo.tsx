'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './FrostedGlassLogo.module.css';

export interface FrostedGlassLogoProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  href?: string;
  ariaLabel?: string;
  collapseWhen?: boolean; // Collapse logo when this condition is true
}

export const FrostedGlassLogo: React.FC<FrostedGlassLogoProps> = ({
  className = '',
  style,
  onClick,
  href = '#hero',
  ariaLabel = 'Ivan Ivanov - Portfolio Home',
  collapseWhen = false,
}) => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const collapseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect touch device
  useEffect(() => {
    const checkTouchDevice = () => {
      const hasTouch =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        ('msMaxTouchPoints' in navigator &&
          (navigator as Navigator & { msMaxTouchPoints: number })
            .msMaxTouchPoints > 0);
      setIsTouchDevice(hasTouch);
    };

    checkTouchDevice();
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (collapseTimeoutRef.current) {
        clearTimeout(collapseTimeoutRef.current);
      }
    };
  }, []);

  // Clear timeout when collapseWhen becomes true
  useEffect(() => {
    if (collapseWhen && collapseTimeoutRef.current) {
      clearTimeout(collapseTimeoutRef.current);
      collapseTimeoutRef.current = null;
    }
  }, [collapseWhen]);

  // Determine if logo should be expanded
  const shouldBeExpanded = isExpanded && !collapseWhen;

  const handleClick = (e: React.MouseEvent) => {
    // Always prevent default to avoid adding #hero to URL
    e.preventDefault();

    // Handle touch device toggle behavior
    if (isTouchDevice) {
      // Clear any existing timeout
      if (collapseTimeoutRef.current) {
        clearTimeout(collapseTimeoutRef.current);
      }

      // Toggle expanded state
      const newExpandedState = !isExpanded;
      setIsExpanded(newExpandedState);

      // Auto-collapse after 2 seconds if expanded
      if (newExpandedState) {
        collapseTimeoutRef.current = setTimeout(() => {
          setIsExpanded(false);
        }, 2000);
      }

      // Still handle navigation after a brief delay to show animation
      setTimeout(() => {
        if (onClick) {
          onClick();
        } else if (href) {
          const targetId = href.replace('#', '');
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 300);
    } else {
      // Desktop behavior - immediate navigation
      if (onClick) {
        onClick();
      } else if (href) {
        const targetId = href.replace('#', '');
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Enter and Space key interactions
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();

      if (onClick) {
        onClick();
      } else if (href) {
        const targetId = href.replace('#', '');
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  return (
    <a
      href={href}
      className={`${styles.logo} ${shouldBeExpanded ? styles.expanded : ''} ${className}`}
      style={style}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      role="button"
      tabIndex={0}
    >
      <span className={styles.logoText}>
        <span className={styles.shortText}>i i</span>
        <span className={styles.fullText}>Ivan Ivanov</span>
      </span>
    </a>
  );
};
