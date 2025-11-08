'use client';

import React from 'react';
import { HomeScreenProps } from './types';
import { APPS, DOCK_APPS } from './utils/appConfig';
import { AppIcon } from './AppIcon';
import styles from './HomeScreen.module.css';

/**
 * HomeScreen Component
 *
 * Displays iOS-style home screen with:
 * - 4-column app grid layout
 * - 16px gaps between icons
 * - Page indicator dots at bottom
 * - Glassmorphism background with wallpaper effect
 * - Bottom dock section for frequently used apps
 * - App click event handling
 */
export const HomeScreen: React.FC<HomeScreenProps> = ({
  onAppClick,
  apps = APPS,
}) => {
  // Separate main grid apps from dock apps
  const mainApps = apps.filter(
    (app) => !DOCK_APPS.some((dockApp) => dockApp.id === app.id)
  );

  return (
    <div className={styles.homeScreen}>
      {/* Animated gradient background */}
      <div className={styles.wallpaper} aria-hidden="true" />

      {/* Main app grid */}
      <div className={styles.appGrid} role="list" aria-label="App icons">
        {mainApps.map((app) => (
          <div key={app.id} className={styles.appSlot} role="listitem">
            <AppIcon
              app={app}
              onClick={() => onAppClick(app.id)}
              size="normal"
            />
          </div>
        ))}
      </div>

      {/* Page indicator dots */}
      <div
        className={styles.pageIndicator}
        role="navigation"
        aria-label="Page indicator"
      >
        <div
          className={`${styles.dot} ${styles.activeDot}`}
          aria-label="Page 1 of 1, current page"
        />
      </div>

      {/* Dock section */}
      <div className={styles.dock}>
        <div className={styles.dockContainer}>
          <div className={styles.dockApps} role="list" aria-label="Dock apps">
            {DOCK_APPS.map((app) => (
              <div key={app.id} className={styles.dockAppSlot} role="listitem">
                <AppIcon
                  app={app}
                  onClick={() => onAppClick(app.id)}
                  size="dock"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
