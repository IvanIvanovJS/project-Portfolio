import React from 'react';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.copyright}>
            © 2024 Portfolio. All rights reserved.
          </p>
          <div className={styles.links}>
            {/* Social links will be added later */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
