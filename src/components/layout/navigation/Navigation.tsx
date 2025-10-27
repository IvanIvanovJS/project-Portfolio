import React from 'react';
import styles from './Navigation.module.css';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
}

interface NavigationProps {
  items: NavigationItem[];
  activeSection: string;
  isMobile?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  items,
  activeSection,
  isMobile = false,
}) => {
  return (
    <nav className={`${styles.navigation} ${isMobile ? styles.mobile : ''}`}>
      <ul className={styles.navList}>
        {items.map((item) => (
          <li key={item.id} className={styles.navItem}>
            <a
              href={item.href}
              className={`${styles.navLink} ${
                activeSection === item.id ? styles.active : ''
              }`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
