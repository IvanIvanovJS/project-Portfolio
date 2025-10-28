import React, { CSSProperties } from 'react';
import styles from './GlassButton.module.css';

interface GlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'cta';
  size?: 'sm' | 'md' | 'lg';
  glowColor?: string;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
  tabIndex?: number;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  glowColor,
  disabled = false,
  className = '',
  type = 'button',
  'aria-label': ariaLabel,
  tabIndex,
}) => {
  const customStyle: CSSProperties = glowColor
    ? ({ '--glow-color': glowColor } as CSSProperties)
    : {};

  const handleClick = (_event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      if (onClick) {
        onClick();
      }
    }
  };

  return (
    <button
      type={type}
      className={`${styles.glassButton} ${styles[variant]} ${styles[size]} ${disabled ? styles.disabled : ''} ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      style={customStyle}
      aria-label={ariaLabel}
      tabIndex={disabled ? -1 : tabIndex}
    >
      <span className={styles.buttonContent}>{children}</span>
      <div className={styles.glowEffect} />
      <div className={styles.shimmerEffect} />
    </button>
  );
};

export default GlassButton;
