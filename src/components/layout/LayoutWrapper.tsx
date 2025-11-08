'use client';
import React, { useState, useEffect } from 'react';
import { Header } from './header/Header';
import { MobileHeader } from './header/MobileHeader';
import { Footer } from './footer/Footer';
import { VerticalNavigation } from './navigation/VerticalNavigation';
import { MobileNavigation } from './navigation/MobileNavigation';
import { useNavigation } from '../../providers/NavigationProvider';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import styles from './LayoutWrapper.module.css';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const navigationItems = [
  { id: 'hero', label: 'Home', href: '#hero' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

export const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const { navigationMode, isVerticalNavOpen, toggleVerticalNav } =
    useNavigation();
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Use scroll spy to track active section
  const sectionIds = navigationItems.map((item) => item.id);
  const activeSection = useScrollSpy(sectionIds, 80);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 769);
    };

    // Use setTimeout to avoid synchronous setState warning
    const timer = setTimeout(() => {
      setIsClient(true);
      checkMobile();
    }, 0);

    window.addEventListener('resize', checkMobile);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleSmoothScroll = (href: string) => {
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const headerHeight = navigationMode === 'horizontal' ? 80 : 0;
      const targetPosition = targetElement.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }

    // Close mobile navigation when clicking links
    if (isMobile && isMobileNavOpen) {
      setIsMobileNavOpen(false);
    }
  };

  const handleMobileNavToggle = () => {
    setIsMobileNavOpen((prev) => !prev);
  };

  const handleMobileNavClose = () => {
    setIsMobileNavOpen(false);
  };

  // Build className - use default on server, actual mode on client
  const wrapperClassName = isClient
    ? `${styles.layoutWrapper} ${navigationMode === 'vertical' ? styles.verticalMode : styles.horizontalMode}`
    : `${styles.layoutWrapper} ${styles.verticalMode}`; // Default to vertical on SSR

  // Always render the same structure for SSR and client
  // Use isClient to conditionally show/hide elements with CSS or conditional rendering
  return (
    <div className={wrapperClassName} suppressHydrationWarning>
      {/* Desktop Vertical Navigation */}
      {isClient && navigationMode === 'vertical' && !isMobile && (
        <VerticalNavigation
          items={navigationItems}
          activeSection={activeSection}
          isOpen={isVerticalNavOpen}
          isMobile={false}
          onItemClick={handleSmoothScroll}
          onToggleNavigation={toggleVerticalNav}
        />
      )}

      {/* Mobile Navigation for both modes */}
      {isClient && isMobile && (
        <MobileNavigation
          items={navigationItems}
          activeSection={activeSection}
          isOpen={isMobileNavOpen}
          onItemClick={handleSmoothScroll}
          onClose={handleMobileNavClose}
        />
      )}

      {/* Header - different for each mode */}
      {navigationMode === 'horizontal' ? (
        <Header
          onMobileMenuToggle={handleMobileNavToggle}
          isMobileMenuOpen={isMobileNavOpen}
        />
      ) : (
        // Show mobile header only on mobile devices in vertical mode
        isClient &&
        isMobile && (
          <MobileHeader
            onMobileMenuToggle={handleMobileNavToggle}
            isMobileMenuOpen={isMobileNavOpen}
          />
        )
      )}

      {/* Main Content */}
      <main
        className={`${styles.mainContent} ${
          navigationMode === 'vertical' && isVerticalNavOpen && !isMobile
            ? styles.withVerticalNav
            : ''
        }`}
      >
        {children}
      </main>

      {/* Footer */}
      <Footer
        className={
          navigationMode === 'vertical' && isVerticalNavOpen && !isMobile
            ? styles.withVerticalNav
            : ''
        }
      />
    </div>
  );
};

export default LayoutWrapper;
