# Implementation Plan

- [x] 1. Enhance session storage utilities
  - Extend existing sessionStorage utility file with widget interaction tracking functions
  - Add WIDGET_INTERACTED storage key constant
  - Implement hasWidgetInteraction(), setWidgetInteraction(), and clearWidgetInteraction() functions
  - Add error handling with try-catch blocks for storage access
  - _Requirements: 3.2, 3.3, 4.1, 4.2, 4.3, 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 2. Create TutorialHint component
  - Create new component file at src/components/sections/about/iphone-widget/components/TutorialHint.tsx
  - Define TutorialHintProps interface with isVisible, targetPositions, and onAnimationComplete
  - Implement hand cursor icon rendering using lucide-react Hand icon
  - Add aria-hidden="true" and role="presentation" for accessibility
  - _Requirements: 1.2, 7.1, 7.3_

- [x] 3. Implement TutorialHint animation styles
  - Create TutorialHint.module.css with base styles for positioning and z-index
  - Implement appear keyframe animation (fade in + scale up, 0.5s)
  - Implement click keyframe animation (scale down/up, 0.4s)
  - Implement disappear keyframe animation (fade out + scale down, 0.5s)
  - Add prefers-reduced-motion media query to disable animations
  - Use CSS transforms and will-change for GPU acceleration
  - _Requirements: 1.3, 5.2, 5.3, 5.4, 5.5, 7.4, 9.1, 9.4, 9.5_

- [x] 4. Implement animation sequence logic in TutorialHint
  - Create state machine for animation phases (idle, appearing, moving-to-about, clicking-about, waiting, moving-to-back, clicking-back, disappearing)
  - Implement phase transitions with appropriate timing
  - Use CSS transitions for position changes between phases
  - Apply animation classes based on current phase
  - Call onAnimationComplete callback when sequence finishes
  - _Requirements: 1.3, 1.4, 1.5, 5.2, 5.3, 5.4, 5.5_

- [x] 5. Create useTutorialHint custom hook
  - Create hook file at src/components/sections/about/iphone-widget/hooks/useTutorialHint.ts
  - Define UseTutorialHintReturn interface
  - Accept widgetRef and isModalOpen as parameters
  - Initialize state for isVisible, hasInteracted, isInViewport, and animationCycle
  - Return shouldShowHint, targetPositions, handleAnimationComplete, and handleUserInteraction
  - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.4, 10.3_

- [x] 6. Implement viewport visibility detection
  - Use IntersectionObserver to track widget visibility in viewport
  - Set threshold to 0.5 (50% visibility)
  - Update isInViewport state when visibility changes
  - Add fallback for browsers without IntersectionObserver support
  - Clean up observer on component unmount
  - _Requirements: 1.1, 2.1, 2.3, 2.4, 10.1, 10.2_

- [x] 7. Implement session storage integration in hook
  - Check hasWidgetInteraction() on hook initialization
  - Set hasInteracted state based on session storage value
  - Implement handleUserInteraction to call setWidgetInteraction()
  - Update shouldShowHint logic to respect interaction flag
  - Handle session storage errors gracefully
  - _Requirements: 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 4.5, 6.5_

- [x] 8. Implement animation cycle timing
  - Add 2-second initial delay before first animation when widget becomes visible
  - Set up 10-second interval timer for repeating animations
  - Pause timer when widget is not in viewport
  - Resume timer when widget returns to viewport
  - Clear all timers on component unmount
  - Stop timers immediately when user interacts
  - _Requirements: 1.1, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 9.3, 10.1_

- [x] 9. Calculate target positions for animations
  - Implement calculateTargetPositions function in hook
  - Calculate About app icon position based on grid layout (first row, first column)
  - Calculate back button position for app view (top-left)
  - Account for widget padding, status bar height, and icon sizes
  - Return positions relative to widget container
  - Handle responsive scaling for mobile devices
  - _Requirements: 5.2, 5.4, 8.3, 8.4_

- [x] 10. Integrate TutorialHint into IPhoneWidget component
  - Add ref to widget container element in IPhoneWidget.tsx
  - Import and use useTutorialHint hook with widgetRef and isModalOpen
  - Add click handler to widget that calls handleUserInteraction
  - Add touch event handler for mobile devices
  - Conditionally render TutorialHint component based on shouldShowHint
  - Pass targetPositions and handleAnimationComplete to TutorialHint
  - _Requirements: 3.1, 8.1, 8.2, 10.3_

- [x] 11. Implement mobile-specific enhancements
- [x] 11.1 Detect touch events (touchstart) as user interactions
  - Add touchstart event listener to widget
  - Call handleUserInteraction on touch
  - _Requirements: 8.1_
- [x] 11.2 Scale target positions for mobile viewports
  - Detect mobile viewport size in calculateTargetPositions
  - Apply scaling factor to positions
  - _Requirements: 8.3, 8.4_
- [x] 11.3 Optimize hand cursor for mobile
  - Adjust icon size for mobile screens
  - Ensure visibility against widget background
  - _Requirements: 8.3_

- [ ] 12. Add accessibility and performance optimizations
- [ ] 12.1 Implement prefers-reduced-motion support
  - Detect prefers-reduced-motion media query
  - Disable animations when motion is reduced
  - _Requirements: 7.4_
- [ ] 12.2 Ensure proper focus management
  - Verify hint doesn't trap keyboard focus
  - Add aria-hidden="true" attribute
  - _Requirements: 7.1, 7.2_
- [ ]\* 12.3 Optimize animation performance
  - Add will-change property before animations
  - Remove will-change after animations complete
  - _Requirements: 9.1, 9.4_
- [ ]\* 12.4 Implement page visibility API
  - Pause animations when tab is hidden
  - Resume animations when tab becomes visible
  - _Requirements: 10.4, 10.5_
