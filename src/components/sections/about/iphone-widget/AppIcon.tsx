'use client';

import React from 'react';
import { AppIconProps } from './types';
import * as LucideIcons from 'lucide-react';
import styles from './AppIcon.module.css';

/**
 * AppIcon Component
 *
 * iOS-style app icon with:
 * - Rounded square shape (60x60px)
 * - Gradient background based on app color
 * - Centered icon rendering
 * - App name label below icon
 * - Press animation (scale down on active)
 * - Glassmorphism overlay and shadow effects
 * - Click handling for functional vs decorative apps
 */
export const AppIcon: React.FC<AppIconProps> = ({
  app,
  onClick,
  size = 'normal',
  isHighlighted = false,
}) => {
  const [isPressed, setIsPressed] = React.useState(false);

  // Get the icon component from lucide-react
  const IconComponent = React.useMemo(() => {
    if (typeof app.icon === 'string') {
      // Map icon name to Lucide component
      const iconName = app.icon as keyof typeof LucideIcons;
      return LucideIcons[iconName] as React.ComponentType<{ size?: number }>;
    }
    return null;
  }, [app.icon]);

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
  };

  const handleTouchStart = () => {
    setIsPressed(true);
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
  };

  const handleClick = () => {
    onClick();
  };

  const iconSize = size === 'dock' ? 28 : 32;
  const containerClass = `${styles.appIcon} ${size === 'dock' ? styles.dockSize : ''} ${isPressed ? styles.pressed : ''} ${isHighlighted ? styles.highlighted : ''}`;

  return (
    <div className={styles.appIconWrapper}>
      <button
        className={containerClass}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label={`${app.name} app${!app.functional ? ' (decorative)' : ''}`}
        type="button"
        style={{
          background: `linear-gradient(135deg, ${app.color}, ${app.colorDark || app.color})`,
        }}
      >
        {/* Glassmorphism overlay */}
        <div className={styles.glassOverlay} aria-hidden="true" />

        {/* Icon */}
        <div className={styles.iconContainer}>
          {IconComponent ? (
            <IconComponent size={iconSize} />
          ) : (
            <span className={styles.iconFallback}>{app.icon}</span>
          )}
        </div>

        {/* Badge (optional) */}
        {app.badge && app.badge > 0 && (
          <div
            className={styles.badge}
            aria-label={`${app.badge} notifications`}
          >
            {app.badge > 99 ? '99+' : app.badge}
          </div>
        )}
      </button>

      {/* App name label */}
      <span className={styles.appLabel}>{app.name}</span>
    </div>
  );
};
