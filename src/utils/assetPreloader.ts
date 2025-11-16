/**
 * Asset preloader for parallel loading during splash screen
 * Loads critical assets in background while splash animation plays
 */

import {
  loadIconAtlasInWorker,
  type AtlasMetadata,
} from './textureWorkerLoader';

export interface PreloadedAssets {
  iconAtlas: ImageBitmap;
  atlasMetadata: AtlasMetadata;
  threeModules: ThreeModules | null;
}

export interface ThreeModules {
  Canvas: any;
  useFrame: any;
  useThree: any;
  OrbitControls: any;
  THREE: any;
}

/**
 * Load icon atlas using Web Worker for off-thread decoding
 * @returns Promise with ImageBitmap and metadata
 */
export const loadIconAtlas = async (): Promise<{
  imageBitmap: ImageBitmap;
  metadata: AtlasMetadata;
}> => {
  try {
    const result = await loadIconAtlasInWorker();
    return {
      imageBitmap: result.imageBitmap,
      metadata: result.metadata,
    };
  } catch (error) {
    console.error('Failed to load icon atlas:', error);
    throw error;
  }
};

/**
 * Preload fonts by creating hidden elements that trigger font loading
 */
export const preloadFonts = async (): Promise<void> => {
  if (typeof document === 'undefined') return;

  try {
    // Check if Font Loading API is available
    if ('fonts' in document) {
      // Load Rubik Glitch font
      await document.fonts.load('400 1em "Rubik Glitch"');
    }
  } catch (error) {
    console.warn('Font preloading failed:', error);
    // Non-critical, continue anyway
  }
};

/**
 * Preload all critical assets in parallel
 * @returns Promise with all preloaded assets
 */
export const preloadAssets = async (): Promise<PreloadedAssets> => {
  try {
    // Load icon atlas and fonts in parallel
    // Three.js modules will be loaded separately via lazyThreeLoader
    const [atlasResult] = await Promise.all([loadIconAtlas(), preloadFonts()]);

    return {
      iconAtlas: atlasResult.imageBitmap,
      atlasMetadata: atlasResult.metadata,
      threeModules: null, // Will be loaded via lazyThreeLoader
    };
  } catch (error) {
    console.error('Asset preloading failed:', error);
    throw error;
  }
};
