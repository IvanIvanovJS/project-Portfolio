'use client';
import React from 'react';
import { Menu, X } from 'lucide-react';
import { FrostedGlassLogo } from '../../ui/frosted-glass-logo';
import styles from './MobileHeader.module.css';

interface MobileHeaderProps {
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  onMobileMenuToggle,
  isMobileMenuOpen,
}) => {
  const handleLogoClick = () => {
    const heroElement = document.getElementById('hero');
    if (heroElement) {
      const headerHeight = 48; // Mobile header height
      const targetPosition = heroElement.offsetTop - headerHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header className={styles.mobileHeader}>
      <div className={styles.container}>
        <FrostedGlassLogo
          className={styles.logo}
          href="#hero"
          ariaLabel="Ivan Ivanov - Portfolio Home"
          onClick={handleLogoClick}
          collapseWhen={isMobileMenuOpen}
        />

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
