'use client';
import React from 'react';
import { Menu, X } from 'lucide-react';
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

        {/* Mobile Menu Button */}
        <button
          className={`${styles.mobileMenuButton} ${isMobileMenuOpen ? styles.open : ''}`}
          onClick={onMobileMenuToggle}
          aria-label="Toggle mobile menu"
        >
          <Menu size={20} className={styles.menuIcon} />
          <X size={20} className={styles.closeIcon} />
        </button>
      </div>
    </header>
  );
};

export default MobileHeader;
