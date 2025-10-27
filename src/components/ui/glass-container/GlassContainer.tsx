import React from 'react';
import styles from './GlassContainer.module.css';

interface GlassContainerProps {
  children: React.ReactNode;
  blur?: number;
  highlightOpacity?: number;
  innerGlowOpacity?: number;
  specularIntensity?: number;
  className?: string;
  variant?: 'card' | 'button' | 'panel';
}

export const GlassContainer: React.FC<GlassContainerProps> = ({
  children,
  blur: _blur = 10,
  highlightOpacity: _highlightOpacity = 0.2,
  innerGlowOpacity: _innerGlowOpacity = 0.1,
  specularIntensity: _specularIntensity = 0.3,
  className = '',
  variant = 'card',
}) => {
  return (
    <div className={`${styles.glassContainer} ${styles[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default GlassContainer;
