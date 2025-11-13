'use client';

import React, { useState } from 'react';
import { FileText, Download, ZoomIn, ZoomOut } from 'lucide-react';
import styles from './ResumeApp.module.css';

/**
 * ResumeApp Component
 *
 * Displays PDF resume in an iOS-style app interface with zoom controls.
 *
 * Features:
 * - PDF viewer with iframe
 * - Zoom in/out controls
 * - Download button
 * - Glassmorphism styling
 * - Optimized for small iPhone screen
 *
 * @param props - ResumeApp props
 */
export interface ResumeAppProps {
  resumePath?: string;
}

export const ResumeApp: React.FC<ResumeAppProps> = ({
  resumePath = '/resume/IvanIvanovResumevWeb.pdf',
}) => {
  const [zoom, setZoom] = useState(100);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resumePath;
    link.download = 'Ivan_Ivanov_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  return (
    <div className={styles.resumeApp}>
      {/* Header with controls */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <FileText className={styles.headerIcon} size={20} />
          <h1 className={styles.headerTitle}>Resume</h1>
        </div>
        <div className={styles.headerActions}>
          <button
            onClick={handleZoomOut}
            className={styles.controlButton}
            aria-label="Zoom out"
            title="Zoom out"
            disabled={zoom <= 50}
          >
            <ZoomOut size={18} />
          </button>
          <span className={styles.zoomLevel}>{zoom}%</span>
          <button
            onClick={handleZoomIn}
            className={styles.controlButton}
            aria-label="Zoom in"
            title="Zoom in"
            disabled={zoom >= 200}
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={handleDownload}
            className={styles.downloadButton}
            aria-label="Download resume"
            title="Download PDF"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className={styles.viewerContainer}>
        <div
          className={styles.viewerWrapper}
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
          }}
        >
          <iframe
            src={resumePath}
            className={styles.iframe}
            title="Resume PDF Viewer"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};
