'use client';
import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
} from 'lucide-react';
import styles from './Footer.module.css';

interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
  ariaLabel: string;
}

interface ContactInfo {
  email: string;
  phone?: string;
  location: string;
}

const contactInfo: ContactInfo = {
  email: 'contact@portfolio.dev',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
};

const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/username',
    icon: <Github size={20} />,
    ariaLabel: 'Visit GitHub profile',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/username',
    icon: <Linkedin size={20} />,
    ariaLabel: 'Visit LinkedIn profile',
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/username',
    icon: <Twitter size={20} />,
    ariaLabel: 'Visit Twitter profile',
  },
];

const quickLinks = [
  { name: 'Home', href: '#hero' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

export const Footer: React.FC = () => {
  const handleSmoothScroll = (href: string) => {
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const headerHeight = 80;
      const targetPosition = targetElement.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Main Footer Content */}
        <div className={styles.mainContent}>
          {/* Brand Section */}
          <div className={styles.brandSection}>
            <h3 className={styles.brandName}>Portfolio</h3>
            <p className={styles.brandDescription}>
              Crafting digital experiences with modern web technologies and
              creative design.
            </p>
            <div className={styles.socialLinks}>
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  className={styles.socialLink}
                  aria-label={link.ariaLabel}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.linksSection}>
            <h4 className={styles.sectionTitle}>Quick Links</h4>
            <nav className={styles.quickLinks}>
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={styles.quickLink}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSmoothScroll(link.href);
                  }}
                >
                  {link.name}
                  <ExternalLink size={14} className={styles.linkIcon} />
                </a>
              ))}
            </nav>
          </div>

          {/* Contact Information */}
          <div className={styles.contactSection}>
            <h4 className={styles.sectionTitle}>Get In Touch</h4>
            <div className={styles.contactInfo}>
              <a
                href={`mailto:${contactInfo.email}`}
                className={styles.contactItem}
                aria-label={`Send email to ${contactInfo.email}`}
              >
                <Mail size={16} />
                <span>{contactInfo.email}</span>
              </a>
              {contactInfo.phone && (
                <a
                  href={`tel:${contactInfo.phone}`}
                  className={styles.contactItem}
                  aria-label={`Call ${contactInfo.phone}`}
                >
                  <Phone size={16} />
                  <span>{contactInfo.phone}</span>
                </a>
              )}
              <div className={styles.contactItem}>
                <MapPin size={16} />
                <span>{contactInfo.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className={styles.footerBottom}>
          <div className={styles.copyright}>
            <p>© {currentYear} Portfolio. All rights reserved.</p>
          </div>
          <div className={styles.footerLinks}>
            <a href="#privacy" className={styles.footerLink}>
              Privacy Policy
            </a>
            <a href="#terms" className={styles.footerLink}>
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
