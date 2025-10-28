'use client';
import React from 'react';
import { NavigationToggle } from '../../ui/navigation-toggle/NavigationToggle';
import { ThemeToggle } from '../../ui/theme-toggle/ThemeToggle';
import { Menu } from 'lucide-react';
import styles from './MobileHeader.module.css';

interface MobileHeaderProps {
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  onMobileMenuToggle,
  isMobileMenuOpen,
}) => {
  return (
    <header className={styles.mobileHeader}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <span className={styles.logoText}>Portfolio</span>
        </div>

        <div className={styles.controls}>
          <NavigationToggle />
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <button
            className={`${styles.mobileMenuButton} ${isMobileMenuOpen ? styles.open : ''}`}
            onClick={onMobileMenuToggle}
            aria-label="Toggle mobile menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
