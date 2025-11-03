'use client';
import React from 'react';
import { UnifiedSwitcher } from '../../ui/unified-switcher/UnifiedSwitcher';
import { X, Home, User, Briefcase, Mail, Menu } from 'lucide-react';
import { useNavigation } from '../../../providers/NavigationProvider';
import styles from './MobileNavigation.module.css';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
}

interface NavigationItemWithIcon extends NavigationItem {
  icon: React.ReactNode;
  description: string;
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

  // Enhanced navigation items with icons and descriptions
  const enhancedItems: NavigationItemWithIcon[] = items.map((item) => {
    let icon: React.ReactNode;
    let description: string;

    switch (item.id) {
      case 'hero':
        icon = <Home size={18} />;
        description = 'Welcome & Introduction';
        break;
      case 'projects':
        icon = <Briefcase size={18} />;
        description = 'View Case Studies';
        break;
      case 'about':
        icon = <User size={18} />;
        description = 'Read Bio';
        break;
      case 'contact':
        icon = <Mail size={18} />;
        description = 'Get In Touch';
        break;
      default:
        icon = <Menu size={18} />;
        description = 'Navigation';
    }

    return {
      ...item,
      icon,
      description,
    };
  });

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
          <nav className={styles.navigation}>
            <ul className={styles.navList}>
              {enhancedItems.map((item, index) => (
                <li
                  key={item.id}
                  className={styles.navItem}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <a
                    href={item.href}
                    className={`${styles.navLink} ${activeSection === item.id ? styles.active : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleItemClick(item.href);
                    }}
                  >
                    <div className={styles.navLinkContent}>
                      <div className={styles.navIcon}>{item.icon}</div>
                      <div className={styles.navText}>
                        <span className={styles.navLabel}>{item.label}</span>
                        <span className={styles.navDescription}>
                          {item.description}
                        </span>
                      </div>
                    </div>
                    <div className={styles.navDivider}></div>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Navigation Footer */}
        <div className={styles.navFooter}>
          <UnifiedSwitcher />
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;
