'use client';
import React from 'react';
import { LayoutGrid, Menu } from 'lucide-react';
import { useNavigation } from '../../../providers/NavigationProvider';
import styles from './NavigationToggle.module.css';

interface NavigationToggleProps {
  className?: string;
}

export const NavigationToggle: React.FC<NavigationToggleProps> = ({
  className,
}) => {
  const { navigationMode, toggleNavigationMode } = useNavigation();

  return (
    <button
      className={`${styles.toggleButton} ${className || ''}`}
      onClick={toggleNavigationMode}
      aria-label={`Switch to ${navigationMode === 'horizontal' ? 'vertical' : 'horizontal'} navigation`}
      title={`Switch to ${navigationMode === 'horizontal' ? 'vertical' : 'horizontal'} navigation`}
    >
      {navigationMode === 'horizontal' ? (
        <LayoutGrid size={18} />
      ) : (
        <Menu size={18} />
      )}
    </button>
  );
};

export default NavigationToggle;
