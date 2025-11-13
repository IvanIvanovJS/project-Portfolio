'use client';

import { useState, useEffect } from 'react';

/**
 * Status of hero section asset preloading
 */
export interface PreloadStatus {
  threeSceneReady: boolean;
  texturesLoaded: boolean;
  fontsLoaded: boolean;
  isComplete: boolean;
}

/**
 * Hook to preload hero section assets during splash screen animation
 * Tracks ThreeScene assets, icon atlas texture, and Rubik Glitch font loading
 *
 * @returns PreloadStatus object with loading state of all assets
 */
export function useHeroPreload(): PreloadStatus {
  const [status, setStatus] = useState<PreloadStatus>({
    threeSceneReady: false,
    texturesLoaded: false,
    fontsLoaded: false,
    isComplete: false,
  });

  useEffect(() => {
    let mounted = true;

    // Check if font is loaded
    const checkFontLoaded = async (): Promise<boolean> => {
      if (typeof document === 'undefined') return false;

      try {
        // Check if Rubik Glitch font is loaded via document.fonts API
        await document.fonts.load('700 1em "Rubik Glitch"');

        // Verify font is actually available
        const fontAvailable = document.fonts.check('700 1em "Rubik Glitch"');
        return fontAvailable;
      } catch (error) {
        console.warn('Font loading check failed:', error);
        return false;
      }
    };

    // Check if icon atlas texture is loaded
    const checkTextureLoaded = async (): Promise<boolean> => {
      if (typeof window === 'undefined') return false;

      try {
        // Preload the icon atlas texture
        const response = await fetch('/textures/icons.v1.png');
        if (!response.ok) return false;

        // Create an image to ensure it's fully loaded
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);

        return new Promise<boolean>((resolve) => {
          const img = new Image();
          img.onload = () => {
            URL.revokeObjectURL(imageUrl);
            resolve(true);
          };
          img.onerror = () => {
            URL.revokeObjectURL(imageUrl);
            resolve(false);
          };
          img.src = imageUrl;
        });
      } catch (error) {
        console.warn('Texture loading check failed:', error);
        return false;
      }
    };

    // Check ThreeScene readiness (basic WebGL check)
    const checkThreeSceneReady = (): boolean => {
      if (typeof window === 'undefined') return false;

      try {
        const canvas = document.createElement('canvas');
        const hasWebGL = !!(
          window.WebGLRenderingContext &&
          (canvas.getContext('webgl') ||
            canvas.getContext('experimental-webgl'))
        );
        return hasWebGL;
      } catch {
        return false;
      }
    };

    // Load all assets
    const loadAssets = async () => {
      // Check ThreeScene readiness immediately
      const threeSceneReady = checkThreeSceneReady();

      if (mounted) {
        setStatus((prev) => ({
          ...prev,
          threeSceneReady,
        }));
      }

      // Load texture and font in parallel
      const [texturesLoaded, fontsLoaded] = await Promise.all([
        checkTextureLoaded(),
        checkFontLoaded(),
      ]);

      if (mounted) {
        const isComplete = threeSceneReady && texturesLoaded && fontsLoaded;

        setStatus({
          threeSceneReady,
          texturesLoaded,
          fontsLoaded,
          isComplete,
        });
      }
    };

    loadAssets();

    return () => {
      mounted = false;
    };
  }, []);

  return status;
}
