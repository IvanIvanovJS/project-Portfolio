import React from 'react';
import styles from './ThemeToggle.module.css';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  return (
    <button className={`${styles.themeToggle} ${className}`}>
      {/* Theme toggle implementation will be added later */}
      🌙
    </button>
  );
};

export default ThemeToggle;
