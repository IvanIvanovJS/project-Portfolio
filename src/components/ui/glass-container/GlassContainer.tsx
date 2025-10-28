import React, { CSSProperties } from 'react';
import styles from './GlassContainer.module.css';

interface GlassContainerProps {
  children: React.ReactNode;
  blur?: number;
  highlightOpacity?: number;
  innerGlowOpacity?: number;
  specularIntensity?: number;
  className?: string;
  variant?: 'card' | 'button' | 'panel';
  style?: CSSProperties;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({
  children,
  blur = 10,
  highlightOpacity = 0.2,
  innerGlowOpacity = 0.1,
  specularIntensity = 0.3,
  className = '',
  variant = 'card',
  style = {},
}) => {
  // Create custom CSS properties for dynamic values
  const customStyle: CSSProperties = {
    ...style,
    '--glass-blur': `${blur}px`,
    '--glass-highlight-opacity': highlightOpacity,
    '--glass-inner-glow-opacity': innerGlowOpacity,
    '--glass-specular-intensity': specularIntensity,
  } as CSSProperties;

  return (
    <div
      className={`${styles.glassContainer} ${styles[variant]} ${className}`}
      style={customStyle}
    >
      <div className={styles.glassHighlight} />
      <div className={styles.glassContent}>{children}</div>
    </div>
  );
};

export default GlassContainer;
