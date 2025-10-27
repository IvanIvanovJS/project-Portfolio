import React from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  isScrolled: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isScrolled }) => {
  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      {/* Header implementation will be added later */}
      <div className={styles.container}>
        <div className={styles.logo}>Portfolio</div>
        <nav className={styles.nav}>{/* Navigation will be added later */}</nav>
      </div>
    </header>
  );
};

export default Header;
