'use client';

import { useState, useEffect } from 'react';
import type { PreloadedAssets } from '@/utils/assetPreloader';

interface PageWithSplashProps {
  children: (preloadedAssets: PreloadedAssets | null) => React.ReactNode;
}

/**
 * Wrapper component that receives preloaded assets from SplashScreen and passes them to children
 */
export const PageWithSplash: React.FC<PageWithSplashProps> = ({ children }) => {
  const [preloadedAssets, setPreloadedAssets] =
    useState<PreloadedAssets | null>(null);

  // Listen for custom event from SplashScreen with preloaded assets
  useEffect(() => {
    const handleAssetsReady = (event: CustomEvent<PreloadedAssets>) => {
      setPreloadedAssets(event.detail);
    };

    window.addEventListener(
      'splash-assets-ready' as any,
      handleAssetsReady as any
    );

    return () => {
      window.removeEventListener(
        'splash-assets-ready' as any,
        handleAssetsReady as any
      );
    };
  }, []);

  return <>{children(preloadedAssets)}</>;
};
