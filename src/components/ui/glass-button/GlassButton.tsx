import React from 'react';
import styles from './GlassButton.module.css';

interface GlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'cta';
  size?: 'sm' | 'md' | 'lg';
  glowColor?: string;
  disabled?: boolean;
  className?: string;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  glowColor,
  disabled = false,
  className = '',
}) => {
  return (
    <button
      className={`${styles.glassButton} ${styles[variant]} ${styles[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={
        glowColor
          ? ({ '--glow-color': glowColor } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </button>
  );
};

export default GlassButton;
