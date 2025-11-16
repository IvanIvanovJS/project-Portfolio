'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { SplashScreen } from '../splash/SplashScreen';
import type { PreloadedAssets } from '@/utils/assetPreloader';

interface PageWithSplashProps {
  children: (preloadedAssets: PreloadedAssets | null) => React.ReactNode;
}

/**
 * Wrapper component that manages splash screen and passes preloaded assets to children
 */
export const PageWithSplash: React.FC<PageWithSplashProps> = ({ children }) => {
  const [splashComplete, setSplashComplete] = useState(false);
  const [preloadedAssets, setPreloadedAssets] =
    useState<PreloadedAssets | null>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Hide body content immediately on mount
  useEffect(() => {
    document.body.classList.add('splash-active');
    return () => {
      document.body.classList.remove('splash-active');
    };
  }, []);

  // Focus management after splash completes
  useEffect(() => {
    if (splashComplete && mainContentRef.current) {
      // Small delay to ensure content is rendered
      const timer = setTimeout(() => {
        // Focus the main content area for screen readers
        mainContentRef.current?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [splashComplete]);

  const handleAssetsReady = useCallback((assets: PreloadedAssets) => {
    setPreloadedAssets(assets);
  }, []);

  const handleSplashComplete = useCallback(() => {
    setSplashComplete(true);
    // Remove the class to show content
    document.body.classList.remove('splash-active');
  }, []);

  return (
    <>
      {!splashComplete ? (
        <SplashScreen
          onComplete={handleSplashComplete}
          onAssetsReady={handleAssetsReady}
        />
      ) : (
        <div
          ref={mainContentRef}
          tabIndex={-1}
          style={{ outline: 'none' }}
          aria-label="Main content"
        >
          {children(preloadedAssets)}
        </div>
      )}
    </>
  );
};
