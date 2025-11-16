# Implementation Plan

- [x] 1. Create Web Worker for texture loading
  - Create `public/workers/texture-loader.worker.js` for off-thread image decoding
  - Implement message handling for LOAD_TEXTURE and TEXTURE_READY events
  - Use createImageBitmap API for efficient texture decoding
  - Add error handling and worker termination
  - _Requirements: 2.1, 2.4, 3.4_

- [x] 2. Implement parallel asset preloading during splash screen
  - Create `src/utils/assetPreloader.ts` with loadIconAtlasInWorker() function
  - Create `src/utils/lazyThreeLoader.ts` for dynamic Three.js module imports
  - Update `SplashScreen.tsx` to trigger preloading on mount
  - Add PreloadedAssets interface and state management
  - Coordinate asset ready callbacks with splash completion
  - _Requirements: 1.2, 2.1, 2.2, 4.2, 4.3_

- [x] 3. Add resource hints to HTML head
  - Add preconnect links for fonts.googleapis.com and fonts.gstatic.com
  - Add preload link for /textures/icons.v1.png with high priority
  - Add preload link for /textures/icons.v1.json
  - Add preload link for Rubik Glitch font with crossOrigin
  - Add modulepreload hints for Three.js chunks
  - Update font-display to 'swap' for Rubik Glitch font
  - _Requirements: 4.1, 4.2, 4.3, 2.2_

- [x] 4. Optimize Three.js scene initialization with preloaded assets
  - Update `ThreeScene.tsx` to accept preloadedAssets prop
  - Create texture directly from ImageBitmap (no re-decode)
  - Remove synchronous texture loading from component
  - Batch all geometry attribute updates together
  - Use requestIdleCallback for non-critical geometry setup
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 5. Implement mobile-specific optimizations
  - Detect mobile devices using window.innerWidth
  - Reduce particle count from 300 to 100 on mobile
  - Reduce tile size from 0.45 to 0.35 on mobile
  - Lower DPR to [1, 1.5] on mobile (from [1, 2])
  - Simplify fragment shader for mobile (remove expensive glow calculations)
  - _Requirements: 3.5_

- [ ] 6. Add performance monitoring and metrics tracking
  - Create `src/hooks/usePerformanceMetrics.ts` hook
  - Implement PerformanceObserver for long task detection (>50ms)
  - Track asset loading times using Resource Timing API
  - Log TBT, FCP, LCP metrics to console
  - Add performance marks for splash start/end and scene ready
  - Report long tasks to console with duration and timestamp
  - _Requirements: 10.1, 10.2, 10.3_

- [ ] 7. Improve accessibility - ARIA labels and semantic HTML
  - Add role="img" and aria-label to Canvas element in ThreeScene
  - Add screen reader only technology list as keyboard alternative
  - Add aria-live region for loading state announcements
  - Update splash screen with proper role="status" and aria-live
  - Add skip link to main content with keyboard-only visibility
  - Ensure all interactive elements have proper ARIA attributes
  - _Requirements: Accessibility improvements_

- [ ] 8. Improve accessibility - color contrast and form labels
  - Audit and fix color contrast issues in glassmorphism components
  - Ensure text meets WCAG AA 4.5:1 contrast ratio minimum
  - Add visible focus indicators with 3:1 contrast (2px solid outline)
  - Update ContactForm with proper label associations (htmlFor/id)
  - Add aria-required, aria-invalid, and aria-describedby to form inputs
  - Add role="alert" to form error messages
  - Implement focus management after splash screen completes
  - _Requirements: Accessibility improvements_
