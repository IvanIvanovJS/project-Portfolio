'use client';
import React, { useState, useEffect } from 'react';
import { Navigation } from '../navigation/Navigation';
import { ThemeToggle } from '../../ui/theme-toggle/ThemeToggle';
import { NavigationToggle } from '../../ui/navigation-toggle/NavigationToggle';
import { useScrollSpy } from '../../../hooks/useScrollSpy';
import { useNavigation } from '../../../providers/NavigationProvider';
import styles from './Header.module.css';

interface HeaderProps {
  isScrolled?: boolean;
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

const navigationItems = [
  { id: 'hero', label: 'Home', href: '#hero' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

export const Header: React.FC<HeaderProps> = ({
  isScrolled: propIsScrolled,
  onMobileMenuToggle,
  isMobileMenuOpen: propIsMobileMenuOpen = false,
}) => {
  const [internalIsScrolled, setInternalIsScrolled] = useState(false);
  const [internalIsMobileMenuOpen, setInternalIsMobileMenuOpen] =
    useState(false);

  // Get navigation context
  const { navigationMode } = useNavigation();

  // Use prop values if provided, otherwise use internal state
  const isMobileMenuOpen = onMobileMenuToggle
    ? propIsMobileMenuOpen
    : internalIsMobileMenuOpen;

  // Use scroll spy to track active section
  const sectionIds = navigationItems.map((item) => item.id);
  const activeSection = useScrollSpy(sectionIds, 80);

  // Determine which scroll state to use
  const isScrolled =
    propIsScrolled !== undefined ? propIsScrolled : internalIsScrolled;

  useEffect(() => {
    // Only set up scroll listener if propIsScrolled is not provided
    if (propIsScrolled === undefined) {
      const handleScroll = () => {
        const scrollTop = window.scrollY;
        setInternalIsScrolled(scrollTop > 50);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [propIsScrolled]);

  const handleSmoothScroll = (href: string) => {
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const headerHeight = 80; // Account for fixed header
      const targetPosition = targetElement.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }

    if (onMobileMenuToggle) {
      // Mobile navigation is handled by parent component
    } else {
      setInternalIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    if (onMobileMenuToggle) {
      onMobileMenuToggle();
    } else {
      setInternalIsMobileMenuOpen(!internalIsMobileMenuOpen);
    }
  };

  // Only render header in horizontal navigation mode
  if (navigationMode === 'vertical') {
    return null;
  }

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <span className={styles.logoText}>Portfolio</span>
        </div>

        <div className={styles.nav}>
          {/* Desktop Navigation */}
          <div className={styles.desktopNav}>
            <Navigation
              items={navigationItems}
              activeSection={activeSection}
              onItemClick={handleSmoothScroll}
            />
            <NavigationToggle />
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`${styles.mobileMenuButton} ${isMobileMenuOpen ? styles.open : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay - Only show if using internal state */}
      {!onMobileMenuToggle && isMobileMenuOpen && (
        <div className={styles.mobileOverlay}>
          <div className={styles.mobileNav}>
            <Navigation
              items={navigationItems}
              activeSection={activeSection}
              isMobile={true}
              onItemClick={handleSmoothScroll}
            />
            <div className={styles.mobileThemeToggle}>
              <NavigationToggle />
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
