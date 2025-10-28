'use client';
import React from 'react';
import { Navigation } from './Navigation';
import { ThemeToggle } from '../../ui/theme-toggle/ThemeToggle';
import { NavigationToggle } from '../../ui/navigation-toggle/NavigationToggle';
import { X } from 'lucide-react';
import { useNavigation } from '../../../providers/NavigationProvider';
import styles from './MobileNavigation.module.css';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
}

interface MobileNavigationProps {
  items: NavigationItem[];
  activeSection: string;
  isOpen: boolean;
  onItemClick: (href: string) => void;
  onClose: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  items,
  activeSection,
  isOpen,
  onItemClick,
  onClose,
}) => {
  const { navigationMode } = useNavigation();

  const handleItemClick = (href: string) => {
    onItemClick(href);
    onClose();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen) {
      onClose();
    }
  };

  // Touch gesture support for closing navigation
  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      const moveTouch = moveEvent.touches[0];
      const deltaX = moveTouch.clientX - startX;
      const deltaY = moveTouch.clientY - startY;

      // Close navigation with swipe gestures
      if (
        navigationMode === 'vertical' &&
        deltaX > 100 &&
        Math.abs(deltaY) < 50
      ) {
        // Swipe right to close vertical navigation
        onClose();
        document.removeEventListener('touchmove', handleTouchMove);
      } else if (
        navigationMode === 'horizontal' &&
        deltaY < -100 &&
        Math.abs(deltaX) < 50
      ) {
        // Swipe up to close horizontal navigation
        onClose();
        document.removeEventListener('touchmove', handleTouchMove);
      }
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={styles.mobileOverlay}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile Navigation */}
      <div
        className={`${styles.mobileNav} ${styles[navigationMode]}`}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        role="navigation"
        aria-label="Mobile navigation"
      >
        {/* Navigation Header */}
        <div className={styles.navHeader}>
          <div className={styles.logo}>
            <span className={styles.logoText}>Portfolio</span>
          </div>

          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Content */}
        <div className={styles.navContent}>
          <Navigation
            items={items}
            activeSection={activeSection}
            isMobile={true}
            onItemClick={handleItemClick}
          />
        </div>

        {/* Navigation Footer */}
        <div className={styles.navFooter}>
          <NavigationToggle />
          <ThemeToggle />
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;
