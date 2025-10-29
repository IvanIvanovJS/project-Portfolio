# Implementation Plan

**Important Note:** This plan builds on the existing Three.js hero section. Each task should be tested incrementally to ensure the glassmorphism aesthetic is maintained throughout.

- [x] 1. Set up icon pipeline infrastructure
  - Create scripts directory and install required dependencies for icon processing
  - Set up directory structure for SVG, PNG, and atlas output
  - Configure package.json scripts for automated icon pipeline execution
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1_

- [x] 1.1 Create project directories and install dependencies
  - Create `scripts/` directory in project root
  - Create `assets/icons/svg/` and `assets/icons/png/` directories
  - Install dependencies: `sharp` for image processing, `spritesmith` for atlas generation
  - Add `public/textures/` directory for output files
  - _Requirements: 1.1, 1.2, 2.1_

- [x] 1.2 Create technology list configuration
  - Create `scripts/config/technologies.js` with array of 30+ technology names

  - Include popular front-end technologies: React, Vue, Angular, Svelte, Next.js, TypeScript, etc.
  - Add metadata for each technology (display name, category, color)
  - Export configuration for use in pipeline scripts
  - _Requirements: 1.1, 3.2_

- [x] 1.3 Configure package.json scripts
  - Add `icons:fetch` script to run icon fetcher
  - Add `icons:convert` script to run SVG to PNG converter
  - Add `icons:atlas` script to run atlas generator
  - Add `icons:build` script to run complete pipeline
  - Add `prebuild` hook to run icon pipeline before Next.js build
  - _Requirements: 1.1, 2.1_

- [x] 2. Implement icon fetching script
  - Create Node.js script to download SVG icons from Simple Icons
  - Implement error handling with retry logic and logging
  - Add progress reporting for download status
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 2.1 Create fetchIcons.js script
  - Implement `fetchIcon()` function using https module to download from `cdn.simpleicons.org`
  - Add retry logic with exponential backoff (3 attempts maximum)
  - Create error logging to `logs/icon-fetch.log`
  - Implement progress bar or console output for download status
  - _Requirements: 1.1, 1.2, 1.5_

- [x] 2.2 Add batch processing and error recovery
  - Implement `fetchAllIcons()` function to process technology list

  - Use Promise.allSettled to continue on individual failures
  - Log successful and failed downloads separately
  - Generate summary report of fetched icons
  - _Requirements: 1.3, 1.4, 1.5_

- [x] 3. Implement SVG to PNG conversion script
  - Create Node.js script using Sharp library to convert SVG files to PNG
  - Configure output dimensions and transparency settings
  - Add batch processing for all downloaded SVGs
  - _Requirements: 1.3, 1.4_

- [x] 3.1 Create convertIcons.js script
  - Implement `convertSvgToPng()` function using Sharp library
  - Set output size to 128×128 pixels with transparent background
  - Configure PNG compression level to 9 for optimal file size
  - Add error handling for corrupted or invalid SVG files
  - _Requirements: 1.3, 1.4_

- [x] 3.2 Add batch conversion with progress tracking
  - Read all SVG files from `assets/icons/svg/` directory
  - Process conversions in parallel with concurrency limit (5 simultaneous)
  - Display progress bar showing conversion status
  - Generate conversion report with file sizes
  - _Requirements: 1.3, 1.4_

- [x] 4. Implement texture atlas generation script
  - Create Node.js script to combine PNG icons into single atlas image
  - Generate JSON metadata with frame coordinates for each icon
  - Ensure power-of-two dimensions for WebGL compatibility
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 4.1 Create generateAtlas.js script
  - Implement atlas generation using Spritesmith library
  - Configure 2-pixel padding between icons to prevent bleeding
  - Use binary-tree packing algorithm for efficient space usage
  - Calculate power-of-two dimensions (512×512 or 1024×1024)
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 4.2 Generate JSON metadata file
  - Create metadata object with version, size, and icon count
  - Generate frame data for each icon with x, y, width, height coordinates
  - Add version identifier to filename (e.g., `icons.v1.json`)
  - Save both PNG and JSON to `public/textures/` directory
  - _Requirements: 2.3, 2.4, 2.5_

- [ ]\* 4.3 Add atlas validation and optimization
  - Verify all icons are included in atlas
  - Check for proper power-of-two dimensions
  - Validate JSON structure and coordinate accuracy
  - Generate visual preview HTML file for manual inspection
  - _Requirements: 2.1, 2.4_

- [x] 5. Create texture loading utilities
  - Implement TypeScript utilities to load texture atlas and metadata in Three.js
  - Add error handling and fallback support
  - Create TypeScript interfaces for atlas data structures
  - _Requirements: 3.1, 3.2, 8.4_

- [x] 5.1 Create textureLoader.ts utility file
  - Create `src/components/sections/hero/utils/textureLoader.ts`
  - Define TypeScript interfaces: `IconFrame`, `AtlasMetadata`, `LoadedAtlas`
  - Implement `loadIconAtlas()` async function using THREE.TextureLoader
  - Configure texture settings: minFilter, magFilter, anisotropy
  - _Requirements: 3.1, 8.4_

- [x] 5.2 Add error handling and fallback logic
  - Wrap texture loading in try-catch block
  - Log errors to console with descriptive messages
  - Return null on failure to trigger fallback rendering
  - Add timeout for slow network connections (10 seconds)
  - _Requirements: 8.3, 8.4_

- [x] 6. Implement custom tile material with shader
  - Create custom ShaderMaterial for per-instance UV mapping
  - Implement vertex and fragment shaders for icon display
  - Add glow effect support in shader code
  - Maintain glassmorphism aesthetic in material properties
  - _Requirements: 3.3, 3.4, 4.1, 4.2, 4.3_

- [x] 6.1 Create TileMaterial.ts class
  - Create `src/components/sections/hero/materials/TileMaterial.ts`
  - Extend THREE.ShaderMaterial with custom uniforms
  - Add uniforms: `uAtlasTexture`, `uAtlasSize`, `uTime`, `uThemeColor`
  - Define per-instance attributes: `uvOffset`, `uvScale`, `glowIntensity`, `animationPhase`
  - _Requirements: 3.3, 3.4, 4.1_

- [x] 6.2 Implement vertex shader
  - Write vertex shader to pass UV coordinates and glow intensity to fragment shader
  - Apply instance matrix for proper tile positioning
  - Pass through animation phase for time-based effects
  - Calculate proper UV coordinates using offset and scale attributes
  - _Requirements: 3.3, 3.4_

- [x] 6.3 Implement fragment shader
  - Write fragment shader to sample texture atlas at correct UV coordinates
  - Blend icon color with glassmorphism base color (70% blend)
  - Add emissive glow using theme color and glow intensity
  - Set transparency to 0.9 to maintain glass effect
  - _Requirements: 3.4, 4.1, 4.2, 4.3_

- [x] 6.4 Add theme color support
  - Update shader uniforms when theme changes (light/dark)

  - Use cyan (#baffe9) for dark theme, orange (#ff8800) for light theme
  - Ensure smooth color transitions between theme changes
  - _Requirements: 4.3_

- [x] 7. Set up per-instance attributes for tiles
  - Create utility function to assign UV coordinates to each tile
  - Distribute icons evenly across all tiles
  - Initialize glow intensity and animation phase for each tile
  - _Requirements: 3.2, 3.3, 3.5, 4.4_

- [x] 7.1 Create setupTileAttributes utility function
  - Create `src/components/sections/hero/utils/tileAttributes.ts`
  - Implement `setupTileAttributes()` function taking mesh, atlas, and tile count
  - Create Float32Arrays for uvOffset, uvScale, glowIntensity, animationPhase
  - Calculate UV coordinates from atlas frame data
  - _Requirements: 3.2, 3.3_

- [x] 7.2 Implement icon distribution logic
  - Cycle through available icons using modulo operator (i % iconCount)

  - Ensure even distribution across all 54 tiles
  - Map icon names to frame coordinates from atlas metadata
  - Handle case where tile count exceeds icon count
  - _Requirements: 3.2, 3.5_

- [x] 7.3 Initialize animation attributes
  - Set initial glow intensity to 0.3 for all tiles
  - Randomize animation phase (0 to 2π) for staggered pulsing effect
  - Create InstancedBufferAttribute for each attribute array
  - Attach attributes to mesh geometry
  - _Requirements: 4.4, 4.5_

- [ ] 8. Implement animation controller
  - Create AnimationController class to manage tile animations
  - Implement glow pulsing animation with sine wave
  - Add click-triggered rotation and glow animations
  - Handle animation state per tile
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 8.1 Create AnimationController.ts class
  - Create `src/components/sections/hero/controllers/AnimationController.ts`
  - Define `TileAnimationState` interface with animation properties
  - Initialize Map to store state for each tile
  - Store reference to glowIntensity attribute for updates
  - _Requirements: 4.4, 4.5, 5.5_

- [ ] 8.2 Implement glow pulsing animation
  - In `update()` method, calculate pulsing glow using sine wave
  - Use formula: `0.3 + sin(time * 0.5 + tileIndex * 0.1) * 0.1`
  - Stagger animation timing across tiles for wave effect
  - Smoothly interpolate current glow toward target glow
  - _Requirements: 4.1, 4.2, 4.5_

- [ ] 8.3 Implement click animation system
  - Create `triggerClickAnimation()` method to start tile animation
  - Set target glow to 1.0 (maximum intensity)
  - Initialize rotation progress to 0
  - Set animation flag to prevent multiple simultaneous animations
  - _Requirements: 5.1, 5.2, 5.5_

- [ ] 8.4 Implement rotation animation
  - Update rotation progress in `update()` method (0 to 1 over 1.5 seconds)
  - Calculate rotation quaternion for 360-degree Y-axis rotation
  - Apply rotation to tile's instance matrix
  - Reset animation state when progress reaches 1.0
  - _Requirements: 5.2, 5.3, 5.4_

- [ ] 8.5 Add hover glow control
  - Create `setHoverGlow()` method to adjust glow on hover
  - Set target glow to 0.6 when hovering, 0.3 when not
  - Ignore hover changes for tiles currently animating from click
  - Ensure smooth transitions using interpolation
  - _Requirements: 6.2, 6.3_

- [ ] 9. Implement interaction handler with raycasting
  - Create InteractionHandler class for mouse and touch events
  - Implement raycasting to detect tile intersections
  - Handle click events to trigger animations
  - Manage hover states and cursor styling
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 9.1 Create InteractionHandler.ts class
  - Create `src/components/sections/hero/controllers/InteractionHandler.ts`
  - Initialize THREE.Raycaster and mouse Vector2
  - Store references to camera, mesh, canvas, and animation controller
  - Set up event listeners for mousemove, click, and touchstart
  - _Requirements: 6.1, 6.5_

- [ ] 9.2 Implement mouse hover detection
  - In `onMouseMove()` handler, convert mouse coordinates to normalized device coordinates
  - Use raycaster to detect intersections with instanced mesh
  - Extract instanceId from intersection result
  - Update hover state and call animation controller's `setHoverGlow()`
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 9.3 Implement cursor styling
  - Set cursor to 'pointer' when hovering over a tile
  - Reset cursor to 'default' when not hovering
  - Track currently hovered tile to avoid redundant updates
  - Clear hover state when mouse leaves canvas
  - _Requirements: 6.4_

- [ ] 9.4 Implement click handling
  - In `onClick()` handler, check if a tile is currently hovered
  - Call animation controller's `triggerClickAnimation()` with tile index
  - Prevent click handling if no tile is hovered
  - _Requirements: 5.1, 5.2, 6.4_

- [ ] 9.5 Implement touch support
  - In `onTouchStart()` handler, convert touch coordinates to NDC
  - Use raycaster to detect tile intersection
  - Trigger click animation for touched tile
  - Handle single-touch only (ignore multi-touch gestures)
  - _Requirements: 6.5_

- [ ] 9.6 Add cleanup and disposal
  - Create `dispose()` method to remove event listeners
  - Call dispose in component cleanup/unmount
  - Prevent memory leaks from event listener references
  - _Requirements: 6.1_

- [ ] 10. Integrate icon system into RubikSphere component
  - Modify existing RubikSphere component to use new icon system
  - Load texture atlas on component mount
  - Initialize custom material and attributes when atlas loads
  - Set up animation and interaction controllers
  - Maintain existing sphere rotation and tile positioning logic
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 5.1, 6.1_

- [ ] 10.1 Add atlas loading to RubikSphere
  - Import `loadIconAtlas` utility in ThreeScene.tsx
  - Add state for loaded atlas using useState
  - Call `loadIconAtlas()` in useEffect on component mount
  - Handle loading errors with console.error and fallback to existing material
  - _Requirements: 3.1, 8.4_

- [ ] 10.2 Initialize custom material when atlas loads
  - Add useEffect that runs when atlas state changes
  - Create TileMaterial instance with atlas texture and size
  - Replace default material on tilesRef.current with custom material
  - Update material uniforms when theme changes
  - _Requirements: 3.3, 3.4, 4.3_

- [ ] 10.3 Set up tile attributes
  - Call `setupTileAttributes()` after material is created
  - Pass tilesRef.current, loaded atlas, and tile count
  - Verify attributes are properly attached to geometry
  - _Requirements: 3.2, 3.3, 3.5_

- [ ] 10.4 Initialize animation controller
  - Create AnimationController instance after attributes are set up
  - Store in useRef to persist across renders
  - Pass tile count and glowIntensity attribute reference
  - _Requirements: 4.1, 4.4, 5.1_

- [ ] 10.5 Initialize interaction handler
  - Get canvas element from Three.js context
  - Create InteractionHandler instance with camera, mesh, canvas, and animation controller
  - Store in useRef to persist across renders
  - Add cleanup in useEffect return to call dispose()
  - _Requirements: 6.1, 6.4_

- [ ] 10.6 Update animation loop
  - In useFrame hook, call animation controller's `update()` method
  - Pass deltaTime and elapsedTime from state.clock
  - Update material uniforms (uTime, uThemeColor) each frame
  - Maintain existing sphere rotation and tile positioning code
  - _Requirements: 4.1, 4.2, 5.2_

- [ ] 11. Add performance optimizations
  - Implement mobile-specific optimizations for texture and rendering
  - Add performance monitoring and automatic quality adjustment
  - Optimize raycasting frequency on lower-end devices
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 11.1 Implement device detection and atlas sizing
  - Detect mobile devices using user agent or screen width
  - Load smaller atlas (512×512) on mobile, larger (1024×1024) on desktop
  - Adjust texture anisotropy: 4x on mobile, 16x on desktop
  - _Requirements: 7.1, 7.2_

- [ ] 11.2 Add FPS monitoring
  - Track frame times in animation loop
  - Calculate rolling average FPS over last 60 frames
  - Store FPS in state or ref for quality adjustment decisions
  - _Requirements: 7.1, 7.4_

- [ ] 11.3 Implement automatic quality adjustment
  - When FPS drops below 30, disable glow pulsing animation
  - When FPS drops below 20, reduce raycasting frequency to every 3rd frame
  - When FPS recovers above 40, re-enable disabled features
  - Log quality adjustments to console for debugging
  - _Requirements: 7.1, 7.4_

- [ ] 11.4 Optimize raycasting performance
  - Throttle raycasting to run every 2nd frame by default
  - Use requestAnimationFrame timestamp to control frequency
  - Skip raycasting when scene is not visible (use Intersection Observer)
  - _Requirements: 7.3_

- [ ] 11.5 Add visibility-based animation pausing
  - Use existing isVisible prop from HeroSection
  - Pause animation controller updates when not visible
  - Resume animations when section becomes visible
  - Reduce CPU/GPU usage when user scrolls away
  - _Requirements: 7.5_

- [ ] 12. Implement accessibility features
  - Add keyboard navigation support for tile focus and activation
  - Implement ARIA labels and roles for 3D canvas
  - Support reduced motion preferences
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 12.1 Add keyboard navigation
  - Track focused tile index in component state
  - Add keydown event listener for Tab, Enter, and Space keys
  - Implement `focusNextTile()` function to cycle through tiles
  - Trigger click animation when Enter or Space is pressed on focused tile
  - _Requirements: 8.1, 8.2_

- [ ] 12.2 Add visual focus indicators
  - Increase glow intensity to 0.8 for focused tile
  - Add subtle scale increase (1.05x) for focused tile
  - Ensure focus indicator is visible in both light and dark themes
  - _Requirements: 8.1_

- [ ] 12.3 Implement ARIA attributes
  - Add aria-label to Canvas element describing the 3D sphere
  - Set role="img" on Canvas for screen reader compatibility
  - Add tabIndex={0} to make canvas keyboard focusable
  - _Requirements: 8.2_

- [ ] 12.4 Support reduced motion preferences
  - Detect prefers-reduced-motion media query
  - Disable sphere rotation when reduced motion is preferred
  - Disable glow pulsing animation
  - Keep static icon display and click interactions
  - _Requirements: 8.5_

- [ ] 12.5 Handle WebGL fallback gracefully
  - Ensure existing ErrorFallback component is displayed when WebGL is unavailable
  - Do not attempt to load atlas or initialize controllers in fallback mode
  - Maintain accessible fallback UI with proper ARIA labels
  - _Requirements: 8.3, 8.4_

- [ ]\* 13. Testing and validation
  - Test icon pipeline scripts with various scenarios
  - Validate texture atlas generation and loading
  - Test interactions across different devices and browsers
  - Verify performance meets requirements
  - Test accessibility features

- [ ]\* 13.1 Test icon pipeline
  - Run complete pipeline with `npm run icons:build`
  - Verify all 30+ icons are downloaded successfully
  - Check PNG conversions are correct size and transparent
  - Validate atlas JSON structure and coordinates
  - Test error handling by simulating network failures

- [ ]\* 13.2 Test Three.js integration
  - Verify icons display correctly on all tiles
  - Check UV mapping is accurate (no stretched or misaligned icons)
  - Test material properties maintain glassmorphism aesthetic
  - Verify theme color changes update glow colors

- [ ]\* 13.3 Test interactions
  - Test hover effects on desktop with mouse
  - Test click animations trigger correctly
  - Test touch interactions on mobile devices
  - Verify cursor changes appropriately
  - Test keyboard navigation and focus indicators

- [ ]\* 13.4 Performance testing
  - Measure FPS on desktop (target: 60 FPS)
  - Measure FPS on mobile (target: 30+ FPS)
  - Test automatic quality adjustment triggers
  - Verify animation pausing when section is not visible
  - Check memory usage remains stable over time

- [ ]\* 13.5 Accessibility testing
  - Test keyboard navigation with Tab, Enter, Space
  - Test with screen reader (NVDA or JAWS)
  - Verify reduced motion preferences are respected
  - Test WebGL fallback displays correctly
  - Validate ARIA labels and roles

- [ ] 14. Documentation and cleanup
  - Update component README files with icon integration details
  - Document icon pipeline usage and customization
  - Add inline code comments for complex shader logic
  - Create troubleshooting guide for common issues
  - _Requirements: 1.1, 3.1_

- [ ] 14.1 Update HeroSection README
  - Document new icon integration feature
  - Explain how to update technology list
  - Describe how to rebuild atlas when icons change
  - Add screenshots showing icon display
  - _Requirements: 1.1_

- [ ] 14.2 Create icon pipeline documentation
  - Create `scripts/README.md` explaining pipeline workflow
  - Document each script's purpose and usage
  - Add troubleshooting section for common errors
  - Include instructions for adding new icons
  - _Requirements: 1.1_

- [ ] 14.3 Add code comments
  - Add JSDoc comments to all public functions and classes
  - Explain shader code with inline comments
  - Document complex UV coordinate calculations
  - Add comments explaining animation timing and easing
  - _Requirements: 3.1_

- [ ] 14.4 Create usage examples
  - Add example of customizing glow colors
  - Show how to adjust animation timing
  - Demonstrate adding custom click handlers
  - Document performance tuning options
  - _Requirements: 3.1_
