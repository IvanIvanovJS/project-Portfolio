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
  onClick: _onClick,
  className = '',
}) => {
  return (
    <div
      className={`${styles.iphoneFrame} ${isExpanded ? styles.expanded : styles.thumbnail} ${className}`}
      aria-expanded={isExpanded}
    >
      {/* Metallic frame border */}
      <div className={styles.frameOuter}>
        {/* Left side buttons */}
        <div className={styles.leftButtons}>
          {/* Mute switch */}
          <div className={styles.muteSwitch} />
          {/* Volume up button */}
          <div className={styles.volumeUp} />
          {/* Volume down button */}
          <div className={styles.volumeDown} />
        </div>

        {/* Right side button */}
        <div className={styles.rightButtons}>
          {/* Power button */}
          <div className={styles.powerButton} />
        </div>

        {/* Screen container with bezel */}
        <div className={styles.screen}>
          {/* Dynamic Island notch */}
          <div className={styles.notch}>
            <div className={styles.notchInner}>
              {/* Camera lens */}
              <div className={styles.camera}>
                <div className={styles.cameraLens} />
              </div>
            </div>
          </div>

          {/* Screen content - background fills entire screen */}
          {children}
        </div>
      </div>
    </div>
  );
};
