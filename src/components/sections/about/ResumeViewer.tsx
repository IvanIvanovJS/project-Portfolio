'use client';

import React from 'react';
import { FileText, Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ResumeViewer.module.css';

interface ResumeViewerProps {
  isOpen: boolean;
  onClose: () => void;
  resumePath?: string;
}

export const ResumeViewer: React.FC<ResumeViewerProps> = ({
  isOpen,
  onClose,
  resumePath = '/resume/IvanIvanovResumevWeb.pdf',
}) => {
  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key to close modal
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resumePath;
    link.download = 'Ivan_Ivanov_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur effect */}
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Resume viewer modal */}
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <FileText className={styles.headerIcon} size={24} />
                <h3 className={styles.headerTitle}>Resume</h3>
              </div>
              <div className={styles.headerActions}>
                <button
                  onClick={handleDownload}
                  className={styles.downloadButton}
                  aria-label="Download resume"
                  title="Download PDF"
                >
                  <Download size={20} />
                  <span>Download</span>
                </button>
                <button
                  onClick={onClose}
                  className={styles.closeButton}
                  aria-label="Close resume viewer"
                  title="Close"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className={styles.iframeContainer}>
              <iframe
                src={resumePath}
                className={styles.iframe}
                title="Resume PDF Viewer"
                loading="lazy"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
