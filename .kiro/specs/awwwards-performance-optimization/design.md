# Design Document

## Overview

This design implements a comprehensive performance optimization strategy to reduce Total Blocking Time from 4850ms to under 200ms, achieving Awwwards-level performance. The solution focuses on:

1. **Parallel asset loading during splash screen**: Use the 3000ms splash animation time to preload everything
2. **Non-blocking initialization**: Move heavy work off main thread using Web Workers
3. **Instant scene display**: Three.js scene ready immediately when splash completes

**Key Principle**: The splash screen is a FEATURE (portfolio showcase), not a delay. We use those 3000ms to prepare everything in the background, so when it completes, the site is fully loaded and interactive.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Initial HTML Load                        │
│  - Inline critical CSS (< 14KB)                             │
│  - Preconnect hints for fonts                               │
│  - Preload hints for critical assets                        │
│  - Start splash screen immediately                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│         Splash Screen Animation (3000ms) + Parallel Load    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ VISIBLE: Splash Animation (CSS only, GPU accelerated)│  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ BACKGROUND: Asset Loading (Web Workers, non-blocking)│  │
│  │  - Icon Atlas decode in worker                       │  │
│  │  - Three.js modules lazy load                        │  │
│  │  - Fonts preload                                     │  │
│  │  - Geometry preparation                              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Splash Complete (3000ms mark)                   │
│  - All assets loaded and ready                              │
│  - Three.js scene renders immediately                       │
│  - Zero blocking time after splash                          │
│  - Instant interactivity                                    │
└─────────────────────────────────────────────────────────────┘
```

### Timeline Breakdown

```
0ms     - HTML loads, splash starts, preloading begins
0-500ms - Splash fade in + asset loading in parallel
500-2500ms - Splash hold + continued asset loading
2500-3000ms - Splash fade out + final preparations
3000ms  - Splash complete, scene displays instantly
```

## Components and Interfaces

### 1. Splash Screen with Parallel Preloading

**Purpose**: Display 3000ms animation while preloading all critical assets

**Interface**:

```typescript
interface SplashScreenProps {
  onComplete?: () => void;
  onAssetsReady?: (assets: PreloadedAssets) => void;
}

interface PreloadedAssets {
  iconAtlas: ImageBitmap;
  atlasMetadata: AtlasMetadata;
  threeModules: {
    Canvas: any;
    OrbitControls: any;
    THREE: any;
  };
}
```

**Implementation**:

```typescript
export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  onAssetsReady
}) => {
  const [assetsReady, setAssetsReady] = useState(false);

  useEffect(() => {
    // Start preloading immediately in parallel with animation
    const preloadAssets = async () => {
      try {
        const [iconAtlas, threeModules] = await Promise.all([
          loadIconAtlasInWorker(), // Web Worker
          loadThreeJsModules(),     // Dynamic import
          preloadFonts()            // Font preload
        ]);

        setAssetsReady(true);
        onAssetsReady?.({ iconAtlas, threeModules });
      } catch (error) {
        console.error('Asset preload failed:', error);
        // Continue anyway - graceful degradation
      }
    };

    preloadAssets();
  }, []);

  useEffect(() => {
    // Splash animation timeline (3000ms)
    const timer = setTimeout(() => {
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.splashContainer}>
      {/* CSS-only animation */}
      <div className={styles.textContainer}>
        <div className={styles.mainText}>Assembling</div>
        <div className={styles.mainText}>Technical Stack</div>
        <div className={styles.subText}>Compiling innovation...</div>
      </div>

      {/* Optional: Progress indicator */}
      {assetsReady && (
        <div className={styles.readyIndicator} aria-hidden="true">
          ✓
        </div>
      )}
    </div>
  );
};
```

### 2. Web Worker Texture Loader

**Purpose**: Decode icon atlas off main thread during splash

**Worker Implementation**:

```typescript
// workers/texture-loader.worker.ts
self.onmessage = async (e: MessageEvent) => {
  const { type, url } = e.data;

  if (type === 'LOAD_TEXTURE') {
    try {
      // Fetch texture
      const response = await fetch(url);
      const blob = await response.blob();

      // Decode off main thread using createImageBitmap
      const imageBitmap = await createImageBitmap(blob, {
        premultiplyAlpha: 'none',
        colorSpaceConversion: 'none',
      });

      // Send back to main thread
      self.postMessage(
        {
          type: 'TEXTURE_READY',
          imageBitmap,
          width: imageBitmap.width,
          height: imageBitmap.height,
        },
        [imageBitmap]
      ); // Transfer ownership
    } catch (error) {
      self.postMessage({
        type: 'ERROR',
        error: error.message,
      });
    }
  }
};
```

**Main Thread Usage**:

```typescript
// utils/textureLoader.ts
export const loadIconAtlasInWorker = (): Promise<LoadedAtlas> => {
  return new Promise((resolve, reject) => {
    const worker = new Worker('/workers/texture-loader.worker.js');

    worker.onmessage = async (e) => {
      const { type, imageBitmap } = e.data;

      if (type === 'TEXTURE_READY') {
        // Load metadata
        const metadata = await fetch('/textures/icons.v1.json').then((r) =>
          r.json()
        );

        resolve({
          imageBitmap,
          metadata,
          texture: null, // Will be created in Three.js
        });

        worker.terminate();
      } else if (type === 'ERROR') {
        reject(new Error(e.data.error));
        worker.terminate();
      }
    };

    worker.postMessage({
      type: 'LOAD_TEXTURE',
      url: '/textures/icons.v1.png',
    });
  });
};
```

### 3. Lazy Three.js Module Loader

**Purpose**: Load Three.js modules during splash without blocking

**Implementation**:

```typescript
// utils/lazyThreeLoader.ts
export const loadThreeJsModules = async () => {
  // Dynamic imports - non-blocking
  const [{ Canvas, useFrame, useThree }, { OrbitControls }, THREE] =
    await Promise.all([
      import('@react-three/fiber'),
      import('@react-three/drei'),
      import('three'),
    ]);

  return {
    Canvas,
    useFrame,
    useThree,
    OrbitControls,
    THREE,
  };
};
```

### 4. Optimized Hero Section

**Purpose**: Display Three.js scene instantly when splash completes

**Implementation**:

```typescript
// HeroSection.tsx
export const HeroSection: React.FC = () => {
  const [preloadedAssets, setPreloadedAssets] = useState<PreloadedAssets | null>(null);
  const [splashComplete, setSplashComplete] = useState(false);

  const handleAssetsReady = (assets: PreloadedAssets) => {
    setPreloadedAssets(assets);
  };

  const handleSplashComplete = () => {
    setSplashComplete(true);
  };

  return (
    <section className={styles.heroSection}>
      {/* Splash screen with preloading */}
      {!splashComplete && (
        <SplashScreen
          onComplete={handleSplashComplete}
          onAssetsReady={handleAssetsReady}
        />
      )}

      {/* Three.js scene - renders immediately when splash completes */}
      {splashComplete && preloadedAssets && (
        <ThreeScene
          preloadedAssets={preloadedAssets}
          theme={theme}
        />
      )}

      {/* Hero content - always visible */}
      <div className={styles.heroContent}>
        <h1>Ivan Ivanov</h1>
        <h2>FULL STACK AND UI/UX DEVELOPER</h2>
      </div>
    </section>
  );
};
```

### 5. Optimized Three.js Scene

**Purpose**: Use preloaded assets for instant initialization

**Key Changes**:

```typescript
interface ThreeSceneProps {
  preloadedAssets: PreloadedAssets;
  theme: 'light' | 'dark';
}

export const ThreeScene: React.FC<ThreeSceneProps> = ({
  preloadedAssets,
  theme
}) => {
  // Assets already loaded - use immediately
  const { iconAtlas, atlasMetadata, threeModules } = preloadedAssets;

  // Create texture from preloaded ImageBitmap
  const texture = useMemo(() => {
    const tex = new THREE.Texture(iconAtlas);
    tex.needsUpdate = true;
    return tex;
  }, [iconAtlas]);

  // Rest of scene setup - no blocking operations
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 52 }}>
      <RubikSphere
        texture={texture}
        metadata={atlasMetadata}
        theme={theme}
      />
    </Canvas>
  );
};
```

### 6. Resource Hints in HTML Head

**Purpose**: Start critical resource loading as early as possible

**Implementation**:

```typescript
// app/layout.tsx
<head>
  {/* Preconnect to font CDN */}
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

  {/* Preload critical assets */}
  <link
    rel="preload"
    href="/textures/icons.v1.png"
    as="image"
    fetchPriority="high"
  />
  <link
    rel="preload"
    href="/textures/icons.v1.json"
    as="fetch"
    crossOrigin=""
  />
  <link
    rel="preload"
    href="https://fonts.gstatic.com/s/rubikglitch/..."
    as="font"
    type="font/woff2"
    crossOrigin=""
  />

  {/* Preload Three.js chunks */}
  <link
    rel="modulepreload"
    href="/_next/static/chunks/three.js"
  />
</head>
```

### 7. Mobile Optimizations

**Purpose**: Reduce complexity on mobile devices

**Implementation**:

```typescript
const isMobile = window.innerWidth <= 768;

const sceneConfig = {
  // Reduce particle count
  particleCount: isMobile ? 100 : 300,

  // Smaller tiles
  tileSize: isMobile ? 0.35 : 0.45,

  // Disable expensive features
  autoRotate: !isMobile,
  shadows: false, // Always off for performance
  antialiasing: !isMobile,

  // Lower DPR on mobile
  dpr: isMobile ? [1, 1.5] : [1, 2],

  // Simpler shaders
  useSimpleShader: isMobile,
};
```

### 8. Performance Monitoring

**Purpose**: Track loading performance and TBT

**Implementation**:

```typescript
// hooks/usePerformanceMetrics.ts
export const usePerformanceMetrics = () => {
  useEffect(() => {
    // Track splash screen duration
    const splashStart = performance.now();

    // Track asset loading
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes('icons.v1.png')) {
          console.log('Icon atlas load time:', entry.duration);
        }

        // Track long tasks
        if (entry.entryType === 'longtask' && entry.duration > 50) {
          console.warn('Long task detected:', {
            duration: entry.duration,
            startTime: entry.startTime,
          });
        }
      }
    });

    observer.observe({
      entryTypes: ['resource', 'longtask', 'measure'],
    });

    return () => observer.disconnect();
  }, []);
};
```

## Data Models

### Preloaded Assets State

```typescript
interface PreloadedAssets {
  iconAtlas: ImageBitmap;
  atlasMetadata: {
    frames: Record<string, FrameData>;
    meta: {
      size: { w: number; h: number };
    };
  };
  threeModules: {
    Canvas: React.ComponentType;
    useFrame: Function;
    useThree: Function;
    OrbitControls: React.ComponentType;
    THREE: typeof import('three');
  };
}

interface LoadingProgress {
  iconAtlas: number; // 0-100
  threeModules: number; // 0-100
  fonts: number; // 0-100
  overall: number; // 0-100
}
```

## Error Handling

### Graceful Degradation

```typescript
// If asset loading fails during splash
const handlePreloadError = (error: Error) => {
  console.error('Preload failed:', error);

  // Continue with fallback
  setSplashComplete(true);

  // Load assets synchronously as fallback
  loadAssetsSynchronously();
};

// Fallback loading
const loadAssetsSynchronously = async () => {
  try {
    const atlas = await loadIconAtlas(); // Original sync method
    const modules = await import('./ThreeScene');
    setPreloadedAssets({ atlas, modules });
  } catch (error) {
    // Show static background
    setUseStaticBackground(true);
  }
};
```

## Testing Strategy

### Performance Testing

**Test Scenarios**:

1. **Cold cache**: First visit, no cached assets
2. **Warm cache**: Repeat visit with cached assets
3. **Slow 3G**: Simulate slow network
4. **Mobile device**: Test on actual mobile hardware

**Success Criteria**:

- Splash screen starts within 100ms
- All assets loaded before splash completes (3000ms)
- TBT < 200ms after splash
- No blocking operations during splash
- Scene renders immediately when splash completes

### Lighthouse Targets

```json
{
  "total-blocking-time": 200,
  "first-contentful-paint": 800,
  "largest-contentful-paint": 1700,
  "cumulative-layout-shift": 0.1,
  "speed-index": 2500,
  "performance-score": 90
}
```

## Implementation Phases

### Phase 1: Web Worker Texture Loading

- Create texture-loader.worker.ts
- Implement loadIconAtlasInWorker()
- Update textureLoader.ts to use worker
- Test ImageBitmap transfer

**Expected Impact**: -1500ms TBT

### Phase 2: Parallel Asset Preloading

- Update SplashScreen to trigger preloading
- Implement loadThreeJsModules()
- Add preloadFonts() utility
- Coordinate asset ready state

**Expected Impact**: -1000ms TBT

### Phase 3: Resource Hints

- Add preconnect for fonts
- Add preload for icon atlas
- Add modulepreload for Three.js
- Optimize font loading

**Expected Impact**: -500ms TBT

### Phase 4: Three.js Optimization

- Use preloaded ImageBitmap directly
- Batch geometry updates
- Mobile-specific optimizations
- Defer non-critical features

**Expected Impact**: -800ms TBT

### Phase 5: Mobile Optimizations

- Reduce particle count
- Simplify shaders
- Lower DPR
- Disable auto-rotate

**Expected Impact**: -500ms TBT (mobile)

### Phase 6: Performance Monitoring

- Add PerformanceObserver
- Track long tasks
- Monitor asset loading
- Report to analytics

**Expected Impact**: Ongoing monitoring

## Browser Compatibility

| Feature             | Chrome | Firefox | Safari   | Edge   |
| ------------------- | ------ | ------- | -------- | ------ |
| Web Workers         | ✅ 4+  | ✅ 3.5+ | ✅ 4+    | ✅ 12+ |
| ImageBitmap         | ✅ 50+ | ✅ 42+  | ✅ 15+   | ✅ 79+ |
| createImageBitmap   | ✅ 50+ | ✅ 42+  | ✅ 15+   | ✅ 79+ |
| Dynamic Import      | ✅ 63+ | ✅ 67+  | ✅ 11.1+ | ✅ 79+ |
| PerformanceObserver | ✅ 52+ | ✅ 57+  | ✅ 11+   | ✅ 79+ |

## Success Metrics

### Performance Targets

| Metric            | Current | Target  | Status        |
| ----------------- | ------- | ------- | ------------- |
| TBT               | 4850ms  | < 200ms | 🔴 Critical   |
| FCP               | 0.8s    | < 0.8s  | ✅ Good       |
| LCP               | 1.7s    | < 1.7s  | ✅ Good       |
| CLS               | 0.003   | < 0.1   | ✅ Excellent  |
| Speed Index       | 3.0s    | < 2.5s  | 🟡 Needs work |
| Performance Score | 55      | > 90    | 🔴 Critical   |

### Expected Results After Optimization

| Metric            | Expected | Improvement   |
| ----------------- | -------- | ------------- |
| TBT               | 150ms    | -4700ms (97%) |
| FCP               | 0.6s     | -0.2s (25%)   |
| LCP               | 1.5s     | -0.2s (12%)   |
| CLS               | 0.003    | No change     |
| Speed Index       | 2.2s     | -0.8s (27%)   |
| Performance Score | 92       | +37 points    |

## Accessibility Improvements

### Current Issues (Score: 88/100)

Based on Lighthouse audit, common accessibility issues to address:

**1. Color Contrast Issues**

- Text on glassmorphism backgrounds may have insufficient contrast
- Interactive elements need 4.5:1 contrast ratio minimum
- Focus indicators must be clearly visible

**2. ARIA Labels and Roles**

- Canvas elements need proper labels
- Interactive 3D elements need keyboard alternatives
- Loading states need screen reader announcements

**3. Keyboard Navigation**

- Three.js scene interactions not keyboard accessible
- Focus management during splash screen
- Skip links for navigation

**4. Form Accessibility**

- Contact form needs proper labels
- Error messages need aria-live regions
- Form validation feedback

### Accessibility Enhancements

**A. Improved Color Contrast**

```typescript
// Ensure text meets WCAG AA standards
const textStyles = {
  // Minimum 4.5:1 contrast ratio
  primaryText: 'rgba(255, 255, 255, 0.95)', // On dark background
  secondaryText: 'rgba(255, 255, 255, 0.85)',

  // Add dark overlay for better contrast on glass
  glassTextBackground: 'rgba(0, 0, 0, 0.3)',

  // Focus indicators - 3:1 contrast minimum
  focusOutline: '2px solid rgba(186, 255, 233, 1)',
  focusBackground: 'rgba(186, 255, 233, 0.2)',
};
```

**B. ARIA Labels for Three.js Scene**

```typescript
// Add proper labels to Canvas
<Canvas
  role="img"
  aria-label="Interactive 3D visualization of technology stack with animated tiles"
  tabIndex={-1} // Not keyboard focusable
>
  <RubikSphere />
</Canvas>

// Add keyboard alternative
<div className={styles.sceneDescription}>
  <h2 className="sr-only">Technology Stack</h2>
  <ul className="sr-only">
    {technologies.map(tech => (
      <li key={tech}>{tech}</li>
    ))}
  </ul>
</div>
```

**C. Loading State Announcements**

```typescript
// Announce loading progress to screen readers
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {loadingState === 'loading' && 'Loading 3D scene and assets'}
  {loadingState === 'ready' && 'Scene loaded and ready'}
  {loadingState === 'error' && 'Scene unavailable, showing alternative content'}
</div>
```

**D. Skip Links**

```typescript
// Add skip navigation link
<a href="#main-content" className={styles.skipLink}>
  Skip to main content
</a>

// Style for keyboard-only visibility
.skipLink {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-primary);
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 10000;
}

.skipLink:focus {
  top: 0;
}
```

**E. Form Accessibility**

```typescript
// Contact form improvements
<form onSubmit={handleSubmit}>
  <label htmlFor="name">
    Name <span aria-label="required">*</span>
  </label>
  <input
    id="name"
    type="text"
    required
    aria-required="true"
    aria-invalid={errors.name ? 'true' : 'false'}
    aria-describedby={errors.name ? 'name-error' : undefined}
  />
  {errors.name && (
    <div id="name-error" role="alert" className={styles.error}>
      {errors.name}
    </div>
  )}
</form>
```

**F. Focus Management**

```typescript
// Manage focus during splash screen
useEffect(() => {
  if (splashComplete) {
    // Move focus to main content after splash
    const mainContent = document.getElementById('main-content');
    mainContent?.focus();
  }
}, [splashComplete]);

// Trap focus during splash if needed
const trapFocus = (e: KeyboardEvent) => {
  if (e.key === 'Tab' && !splashComplete) {
    e.preventDefault();
  }
};
```

### Target Accessibility Score

| Metric              | Current    | Target   | Improvement |
| ------------------- | ---------- | -------- | ----------- |
| Accessibility Score | 88         | > 95     | +7 points   |
| Color Contrast      | Issues     | WCAG AA  | Fixed       |
| ARIA Labels         | Incomplete | Complete | Fixed       |
| Keyboard Nav        | Limited    | Full     | Enhanced    |
| Form Labels         | Missing    | Complete | Fixed       |

## Browser Compatibility

| Feature             | Chrome | Firefox | Safari   | Edge   |
| ------------------- | ------ | ------- | -------- | ------ |
| Web Workers         | ✅ 4+  | ✅ 3.5+ | ✅ 4+    | ✅ 12+ |
| ImageBitmap         | ✅ 50+ | ✅ 42+  | ✅ 15+   | ✅ 79+ |
| createImageBitmap   | ✅ 50+ | ✅ 42+  | ✅ 15+   | ✅ 79+ |
| Dynamic Import      | ✅ 63+ | ✅ 67+  | ✅ 11.1+ | ✅ 79+ |
| PerformanceObserver | ✅ 52+ | ✅ 57+  | ✅ 11+   | ✅ 79+ |
| ARIA Support        | ✅ All | ✅ All  | ✅ All   | ✅ All |
