'use client';

import React from 'react';
import styles from './FrostedGlassLogo.module.css';

export interface FrostedGlassLogoProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  href?: string;
  ariaLabel?: string;
}

export const FrostedGlassLogo: React.FC<FrostedGlassLogoProps> = ({
  className = '',
  style,
  onClick,
  href = '#hero',
  ariaLabel = 'Ivan Ivanov - Portfolio Home',
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    } else if (href) {
      e.preventDefault();
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <a
      href={href}
      className={`${styles.logo} ${className}`}
      style={style}
      onClick={handleClick}
      aria-label={ariaLabel}
      tabIndex={0}
    >
      <span className={styles.logoText} data-text="Ivan Ivanov">
        i i
      </span>
    </a>
  );
};
