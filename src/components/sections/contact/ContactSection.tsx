'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';
import { ContactForm } from './ContactForm';
import styles from './ContactSection.module.css';

interface ContactSectionProps {
  contactInfo?: {
    email: string;
    phone?: string;
    location?: string;
  };
}

const defaultContactInfo = {
  email: 'john.doe@example.com',
  phone: '+359 123 456 789',
  location: 'Sofia, Bulgaria',
};

export const ContactSection: React.FC<ContactSectionProps> = ({
  contactInfo = defaultContactInfo,
}) => {
  return (
    <section id="contact" className={styles.contactSection}>
      <div className={styles.container}>
        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Get In Touch
        </motion.h2>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Have a project in mind or want to collaborate? Feel free to reach out!
        </motion.p>

        <div className={styles.content}>
          {/* Contact Information */}
          <motion.div
            className={styles.contactInfo}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className={styles.glassCard}>
              <h3 className={styles.infoTitle}>Contact Information</h3>
              <p className={styles.infoDescription}>
                Feel free to reach out through any of these channels. I&apos;ll
                get back to you as soon as possible.
              </p>

              <div className={styles.infoItems}>
                <div className={styles.infoItem}>
                  <div className={styles.iconWrapper}>
                    <Mail className={styles.icon} size={20} />
                  </div>
                  <div className={styles.infoContent}>
                    <h4 className={styles.infoLabel}>Email</h4>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className={styles.infoLink}
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                {contactInfo.phone && (
                  <div className={styles.infoItem}>
                    <div className={styles.iconWrapper}>
                      <Phone className={styles.icon} size={20} />
                    </div>
                    <div className={styles.infoContent}>
                      <h4 className={styles.infoLabel}>Phone</h4>
                      <a
                        href={`tel:${contactInfo.phone}`}
                        className={styles.infoLink}
                      >
                        {contactInfo.phone}
                      </a>
                    </div>
                  </div>
                )}

                {contactInfo.location && (
                  <div className={styles.infoItem}>
                    <div className={styles.iconWrapper}>
                      <MapPin className={styles.icon} size={20} />
                    </div>
                    <div className={styles.infoContent}>
                      <h4 className={styles.infoLabel}>Location</h4>
                      <p className={styles.infoText}>{contactInfo.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Contact Form - Placeholder for subtask 3.2 */}
          <motion.div
            className={styles.formContainer}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className={styles.glassCard}>
              <h3 className={styles.formTitle}>Send a Message</h3>
              <ContactForm />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
