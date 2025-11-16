'use client';

import { useState, useCallback, useEffect } from 'react';
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

  // Hide body content immediately on mount
  useEffect(() => {
    document.body.classList.add('splash-active');
    return () => {
      document.body.classList.remove('splash-active');
    };
  }, []);

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
        children(preloadedAssets)
      )}
    </>
  );
};
