'use client';
import React from 'react';
import { Navigation } from './Navigation';
import { ThemeToggle } from '../../ui/theme-toggle/ThemeToggle';
import { Menu, X } from 'lucide-react';
import styles from './VerticalNavigation.module.css';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
}

interface VerticalNavigationProps {
  items: NavigationItem[];
  activeSection: string;
  isOpen: boolean;
  isMobile: boolean;
  onItemClick: (href: string) => void;
  onToggleNavigation: () => void;
}

export const VerticalNavigation: React.FC<VerticalNavigationProps> = ({
  items,
  activeSection,
  isOpen,
  isMobile,
  onItemClick,
  onToggleNavigation,
}) => {
  const handleItemClick = (href: string) => {
    onItemClick(href);
    // Close mobile navigation after clicking an item
    if (isMobile && isOpen) {
      onToggleNavigation();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen) {
      onToggleNavigation();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className={styles.mobileOverlay}
          onClick={onToggleNavigation}
          aria-hidden="true"
        />
      )}

      {/* Vertical Navigation Sidebar */}
      <aside
        className={`${styles.verticalNav} ${isOpen ? styles.open : ''} ${isMobile ? styles.mobile : ''}`}
        onKeyDown={handleKeyDown}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Navigation Header */}
        <div className={styles.navHeader}>
          <div className={styles.logo}>
            <span className={styles.logoText}>Portfolio</span>
          </div>

          {/* Toggle Button */}
          <button
            className={styles.toggleButton}
            onClick={onToggleNavigation}
            aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Content */}
        <div className={styles.navContent}>
          <Navigation
            items={items}
            activeSection={activeSection}
            isMobile={false}
            onItemClick={handleItemClick}
          />
        </div>

        {/* Navigation Footer */}
        <div className={styles.navFooter}>
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
};

export default VerticalNavigation;
