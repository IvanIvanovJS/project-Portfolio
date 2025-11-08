'use client';
import React from 'react';
import { LayoutGrid, Menu } from 'lucide-react';
import { useNavigation } from '../../../providers/NavigationProvider';
import styles from './NavigationToggle.module.css';

interface NavigationToggleProps {
  className?: string;
}

export const NavigationToggle: React.FC<NavigationToggleProps> = ({
  className = '',
}) => {
  const { navigationMode, toggleNavigationMode } = useNavigation();

  return (
    <button
      type="button"
      className={`${styles.navigationToggle} ${className}`}
      onClick={toggleNavigationMode}
      aria-label={`Switch to ${navigationMode === 'horizontal' ? 'vertical' : 'horizontal'} navigation`}
    >
      {navigationMode === 'horizontal' ? (
        <LayoutGrid size={20} />
      ) : (
        <Menu size={20} />
      )}
    </button>
  );
};

export default NavigationToggle;
