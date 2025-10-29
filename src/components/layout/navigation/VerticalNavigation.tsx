'use client';
import React from 'react';
import { ThemeToggle } from '../../ui/theme-toggle/ThemeToggle';
import { NavigationToggle } from '../../ui/navigation-toggle/NavigationToggle';
import { Menu, X, Home, User, Briefcase, Mail } from 'lucide-react';
import styles from './VerticalNavigation.module.css';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
}

interface NavigationItemWithIcon extends NavigationItem {
  icon: React.ReactNode;
  description: string;
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
          <nav className={styles.verticalNavigation}>
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
          <NavigationToggle />
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
};

export default VerticalNavigation;
