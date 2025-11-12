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
import { FrostedGlassLogo } from '../../ui/frosted-glass-logo';
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
  email: 'ivanov@webmorphism.com',
  phone: '+359 898 573 056',
  location: 'Varna, Bulgaria',
};

const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/IvanIvanovJS',
    icon: <Github size={20} />,
    ariaLabel: 'Visit GitHub profile',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/ivanov-webmorphism',
    icon: <Linkedin size={20} />,
    ariaLabel: 'Visit LinkedIn profile',
  },
  {
    name: 'Twitter',
    url: 'https://x.com/IvanIvanov29303',
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

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
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
    <footer className={`${styles.footer} ${className}`}>
      <div className={styles.container}>
        {/* Main Footer Content */}
        <div className={styles.mainContent}>
          {/* Brand Section */}
          <div className={styles.brandSection}>
            <FrostedGlassLogo
              className={styles.brandLogo}
              href="#hero"
              ariaLabel="Ivan Ivanov - Portfolio Home"
              onClick={() => handleSmoothScroll('#hero')}
            />
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
            <p>© {currentYear} Webmorphism. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
