'use client';

import React from 'react';
import { IPhoneFrameProps } from './types';
import styles from './IPhoneFrame.module.css';

/**
 * IPhoneFrame Component
 *
 * Renders a realistic iPhone 14 Pro frame with:
 * - Accurate dimensions and aspect ratio (393x852px)
 * - Metallic frame with rounded corners
 * - Dynamic Island notch cutout
 * - Glassmorphism screen bezel
 * - Realistic shadows and reflections
 * - Click handler for expansion
 */
export const IPhoneFrame: React.FC<IPhoneFrameProps> = ({
  isExpanded,
  children,
  onClick,
  className = '',
}) => {
  return (
    <div
      className={`${styles.iphoneFrame} ${isExpanded ? styles.expanded : styles.thumbnail} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? 'Expand iPhone widget' : undefined}
      aria-expanded={isExpanded}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Metallic frame border */}
      <div className={styles.frameOuter}>
        {/* Screen container with bezel */}
        <div className={styles.screen}>
          {/* Dynamic Island notch */}
          <div className={styles.notch}>
            <div className={styles.notchInner} />
          </div>

          {/* Screen content */}
          <div className={styles.screenContent}>{children}</div>
        </div>
      </div>
    </div>
  );
};
