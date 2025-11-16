/**
 * Lazy loader for Three.js modules
 * Dynamically imports Three.js dependencies to avoid blocking initial load
 */

export interface ThreeModules {
  Canvas: any;
  useFrame: any;
  useThree: any;
  OrbitControls: any;
  THREE: any;
}

/**
 * Dynamically load Three.js modules
 * Uses dynamic imports to split Three.js into separate chunks
 * @returns Promise with loaded Three.js modules
 */
export const loadThreeJsModules = async (): Promise<ThreeModules> => {
  try {
    // Load all Three.js modules in parallel
    const [fiberModule, dreiModule, threeModule] = await Promise.all([
      import('@react-three/fiber'),
      import('@react-three/drei'),
      import('three'),
    ]);

    return {
      Canvas: fiberModule.Canvas,
      useFrame: fiberModule.useFrame,
      useThree: fiberModule.useThree,
      OrbitControls: dreiModule.OrbitControls,
      THREE: threeModule,
    };
  } catch (error) {
    console.error('Failed to load Three.js modules:', error);
    throw error;
  }
};

/**
 * Check if Three.js modules are already loaded
 * Useful for avoiding duplicate loads
 */
export const areThreeModulesLoaded = (): boolean => {
  // Check if modules are in the module cache
  // This is a simple heuristic - in production, you might want a more robust check
  return typeof window !== 'undefined' && '__THREE_MODULES_LOADED__' in window;
};

/**
 * Mark Three.js modules as loaded
 * Used internally to track loading state
 */
export const markThreeModulesLoaded = (): void => {
  if (typeof window !== 'undefined') {
    (window as any).__THREE_MODULES_LOADED__ = true;
  }
};
