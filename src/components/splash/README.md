# SplashScreen Component

## Overview

The SplashScreen component displays an animated loading screen while preloading critical assets in the background. It uses Web Workers for off-thread texture decoding and dynamic imports for Three.js modules to avoid blocking the main thread.

## Features

- **Parallel Asset Loading**: Loads icon atlas and Three.js modules during animation
- **Non-blocking**: Uses Web Workers for texture decoding
- **Graceful Degradation**: Continues even if preloading fails
- **Accessibility**: Proper ARIA labels and reduced motion support
- **Visual Feedback**: Shows checkmark when assets are ready

## Usage

### Basic Usage

```tsx
import { SplashScreen } from '@/components/splash';

export const App = () => {
  return <SplashScreen />;
};
```

### With Callbacks

```tsx
import { SplashScreen, type SplashScreenProps } from '@/components/splash';
import { type PreloadedAssets } from '@/utils/assetPreloader';
import { useState } from 'react';

export const App = () => {
  const [preloadedAssets, setPreloadedAssets] =
    useState<PreloadedAssets | null>(null);
  const [splashComplete, setSplashComplete] = useState(false);

  const handleAssetsReady = (assets: PreloadedAssets) => {
    console.log('Assets preloaded:', assets);
    setPreloadedAssets(assets);
  };

  const handleSplashComplete = () => {
    console.log('Splash animation complete');
    setSplashComplete(true);
  };

  return (
    <>
      {!splashComplete && (
        <SplashScreen
          onComplete={handleSplashComplete}
          onAssetsReady={handleAssetsReady}
        />
      )}

      {splashComplete && preloadedAssets && (
        <ThreeScene preloadedAssets={preloadedAssets} />
      )}
    </>
  );
};
```

## Props

| Prop            | Type                                | Required | Description                                    |
| --------------- | ----------------------------------- | -------- | ---------------------------------------------- |
| `onComplete`    | `() => void`                        | No       | Callback fired when splash animation completes |
| `onAssetsReady` | `(assets: PreloadedAssets) => void` | No       | Callback fired when assets finish preloading   |

## PreloadedAssets Interface

```typescript
interface PreloadedAssets {
  iconAtlas: ImageBitmap;
  atlasMetadata: AtlasMetadata;
  threeModules: ThreeModules | null;
}

interface ThreeModules {
  Canvas: any;
  useFrame: any;
  useThree: any;
  OrbitControls: any;
  THREE: any;
}
```

## Timeline

### Normal Animation (2300ms total)

- 0ms: "Assembling" slides in
- 500ms: "Technical Stack" slides in
- 800ms: Typing effect starts
- 2000ms: Fade out begins
- 2300ms: Complete, `onComplete` callback fires

### Reduced Motion (500ms total)

- 0ms: "Assembling" appears
- 100ms: "Technical Stack" appears
- 200ms: Full text appears instantly
- 400ms: Fade out begins
- 500ms: Complete

## Asset Preloading

The component automatically preloads:

1. **Icon Atlas** (via Web Worker)
   - `/textures/icons.v1.png` - decoded off main thread
   - `/textures/icons.v1.json` - metadata

2. **Three.js Modules** (via dynamic import)
   - `@react-three/fiber`
   - `@react-three/drei`
   - `three`

3. **Fonts**
   - Rubik Glitch font

All preloading happens in parallel with the animation, so when the splash completes, assets are ready for immediate use.

## Performance

- **Non-blocking**: All heavy operations run off main thread or async
- **Parallel Loading**: Assets load simultaneously during animation
- **Zero TBT Impact**: Main thread remains responsive during preload
- **Graceful Degradation**: Scene loads normally if preload fails

## Accessibility

- `role="status"` for screen reader announcements
- `aria-live="polite"` for loading state updates
- `aria-label` for context
- Respects `prefers-reduced-motion` preference
- Screen reader only text for full context

## Example Integration with HeroSection

```tsx
import { useState } from 'react';
import { SplashScreen } from '@/components/splash';
import { ThreeScene } from './ThreeScene';
import type { PreloadedAssets } from '@/utils/assetPreloader';

export const HeroSection = () => {
  const [preloadedAssets, setPreloadedAssets] =
    useState<PreloadedAssets | null>(null);
  const [splashComplete, setSplashComplete] = useState(false);

  return (
    <section>
      {!splashComplete && (
        <SplashScreen
          onComplete={() => setSplashComplete(true)}
          onAssetsReady={setPreloadedAssets}
        />
      )}

      {splashComplete && preloadedAssets && (
        <ThreeScene preloadedAssets={preloadedAssets} />
      )}

      <div className="hero-content">
        <h1>Ivan Ivanov</h1>
        <h2>FULL STACK AND UI/UX DEVELOPER</h2>
      </div>
    </section>
  );
};
```

## Related Files

- `src/utils/assetPreloader.ts` - Asset preloading utilities
- `src/utils/lazyThreeLoader.ts` - Three.js dynamic imports
- `src/utils/textureWorkerLoader.ts` - Web Worker texture loading
- `public/workers/texture-loader.worker.js` - Web Worker implementation
