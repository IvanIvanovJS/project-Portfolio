# Implementation Plan

- [x] 1. Create ExplosionAnimator class with core animation logic
  - Create new file `src/components/sections/hero/controllers/ExplosionAnimator.ts`
  - Implement ExplosionConfig interface with animation timing constants
  - Implement ExplosionPhase enum (IDLE, CONTRACTING, EXPLODING, RETURNING)
  - Implement TileExplosionState interface for per-tile animation data
  - Create ExplosionAnimator class constructor that accepts tile count, original positions, rotations, and radius
  - Initialize tile states array with original positions and rotations
  - Implement easing functions (easeIn for contraction, easeOut for return)
  - Implement randomDirection() helper for generating uniform sphere directions
  - Implement randomInRange() helper for velocity and rotation speed randomization
  - _Requirements: 1.1, 1.3, 2.1, 2.2, 2.3, 2.4, 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ] 2. Implement ExplosionAnimator animation phases
- [ ] 2.1 Implement startExplosion() method
  - Set phase to CONTRACTING
  - Reset phaseProgress to 0
  - Generate random explosion parameters for each tile (direction, velocity, rotation axis, rotation speed)
  - Store current positions as starting points
  - _Requirements: 1.1, 4.2, 4.3, 4.5_

- [ ] 2.2 Implement contraction phase logic
  - Calculate contracted radius based on progress (originalRadius _ (1.0 - progress _ 0.5))
  - Apply easeIn easing to progress
  - Update tile positions to maintain sphere shape at reduced radius
  - Transition to EXPLODING phase when progress reaches 1.0
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 2.3 Implement explosion phase logic
  - Update each tile position by adding velocity _ direction _ deltaTime
  - Apply random rotation to each tile using rotation axis and speed
  - Maintain linear motion (no easing)
  - Transition to RETURNING phase when progress reaches 1.0
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 2.4 Implement return phase logic
  - Interpolate tile positions from current to original using lerp with easeOut
  - Interpolate tile rotations from current to original using slerp
  - Apply easeOut easing to progress
  - Transition to IDLE phase when progress reaches 1.0
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ] 2.5 Implement update() method
  - Accept deltaTime parameter for frame-independent animation
  - Update phaseProgress based on current phase duration
  - Call appropriate phase update logic based on currentPhase
  - Handle phase transitions automatically
  - Update tile positions and rotations in tile states array
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 2.6 Implement getter methods
  - Implement isAnimating() to return true if phase is not IDLE
  - Implement getCurrentPhase() to return current ExplosionPhase
  - Implement getTilePosition(index) to return current tile position
  - Implement getTileRotation(index) to return current tile rotation
  - Implement getGlowIntensity() to calculate glow based on phase and progress
  - _Requirements: 1.2, 3.1, 3.2, 3.3, 3.4, 5.4_

- [ ] 3. Extend AnimationController to integrate ExplosionAnimator
  - Add explosionAnimator property to AnimationController class
  - Add isExplosionActive flag to track explosion state
  - Update constructor to accept original positions, rotations, and sphere radius parameters
  - Initialize ExplosionAnimator in constructor with tile data
  - _Requirements: 1.1, 1.2_

- [ ] 4. Update AnimationController.update() method
- [ ] 4.1 Add explosion animation handling
  - Check if explosion is active at start of update()
  - If active, call explosionAnimator.update(deltaTime)
  - Get glow intensity from explosionAnimator and update all tiles
  - Skip normal glow pulsing animation when explosion is active
  - _Requirements: 1.3, 3.1, 3.2, 3.3, 3.4, 5.4, 6.1, 6.2_

- [ ] 4.2 Override tile positions during explosion
  - When explosion is active, get positions from explosionAnimator
  - Get rotations from explosionAnimator
  - Update instance matrices with explosion positions and rotations
  - Mark instanceMatrix as needsUpdate
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.5_

- [ ] 4.3 Handle explosion completion
  - Check if explosionAnimator.isAnimating() returns false
  - Reset isExplosionActive flag
  - Resume normal animations (glow pulsing, floating)
  - _Requirements: 1.3, 5.6_

- [ ] 5. Add triggerExplosion() method to AnimationController
  - Create public triggerExplosion() method
  - Check if explosion is already active, return early if true
  - Set isExplosionActive flag to true
  - Call explosionAnimator.startExplosion()
  - _Requirements: 1.1, 1.2_

- [ ] 6. Extend InteractionHandler to trigger explosions
  - Update onClick() method to call animationController.triggerExplosion() instead of triggerClickAnimation()
  - Keep existing raycasting and hover detection logic
  - _Requirements: 1.1_

- [ ] 7. Update InteractionHandler hover behavior during explosion
  - Add check in setHoverGlow() to skip hover effects if explosion is active
  - Add check in updateHover() to skip raycasting if explosion is active
  - Maintain cursor as default during explosion
  - _Requirements: 7.4_

- [ ] 8. Enhance hover effects for better click affordance
  - Update setHoverGlow() to set glow intensity to 0.3 (increased from 0.6)
  - Add scale transformation in AnimationController for hovered tiles
  - Store hover scale state in TileAnimationState
  - Apply scale 1.1 when hovering, 1.0 when not hovering
  - Smooth scale transition using interpolation
  - _Requirements: 7.1, 7.2, 7.3_

- [ ] 9. Update ThreeScene to pass required data to AnimationController
  - Extract original sphere positions array from useMemo
  - Extract original rotations array from useMemo
  - Pass spherePositions, rotations, and sphereRadius to AnimationController constructor
  - Ensure data is available before initializing AnimationController
  - _Requirements: 1.1, 2.1, 5.1, 5.5_

- [ ] 10. Add performance optimizations
  - Pre-allocate temporary Vector3 and Quaternion objects in ExplosionAnimator
  - Reuse temporary objects in update loops instead of creating new ones
  - Use object pooling pattern for frequently allocated objects
  - Minimize calls to setMatrixAt() by batching updates
  - _Requirements: 6.3, 6.4_

- [ ] 11. Implement reduced motion support
  - Detect prefers-reduced-motion media query in ThreeScene
  - Pass reducedMotion flag to AnimationController
  - Adjust animation durations in ExplosionConfig when reduced motion is enabled
  - Set contraction to 0.2s, explosion to 0.2s, return to 0.3s for reduced motion
  - _Requirements: 6.1, 6.5_

- [ ]\* 12. Add error handling and edge cases
  - Add bounds checking in getTilePosition() and getTileRotation()
  - Handle component unmount during active animation
  - Add cleanup logic in ExplosionAnimator
  - Ensure animation state resets properly on errors
  - _Requirements: 1.2, 1.3_

- [ ]\* 13. Write unit tests for ExplosionAnimator
  - Test initialization with correct tile count
  - Test phase transitions (IDLE → CONTRACTING → EXPLODING → RETURNING → IDLE)
  - Test contraction radius calculation at various progress values
  - Test random direction generation produces normalized vectors
  - Test return phase reaches original positions
  - Test glow intensity calculation for each phase
  - Test animation timing (0.8s + 0.6s + 1.2s = 2.6s total)
  - _Requirements: 1.1, 1.3, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 6.2, 6.3_

- [ ]\* 14. Write integration tests
  - Test AnimationController blocks normal animations during explosion
  - Test AnimationController resumes normal animations after explosion
  - Test InteractionHandler triggers explosion on tile click
  - Test InteractionHandler ignores clicks during active explosion
  - Test InteractionHandler disables hover during explosion
  - Test hover effects re-enable after explosion completes
  - _Requirements: 1.1, 1.2, 1.3, 7.4_

- [ ]\* 15. Perform manual testing and validation
  - Verify animation runs smoothly at 60 FPS on desktop
  - Verify animation runs at 30+ FPS on mobile devices
  - Check visual correctness of contraction phase
  - Check explosion disperses tiles in all directions uniformly
  - Check return animation is smooth and natural
  - Verify glow intensity changes are visible throughout animation
  - Test clicking during animation is properly ignored
  - Test hover works correctly before and after animation
  - Test on multiple browsers (Chrome, Firefox, Safari, Edge)
  - Test on mobile devices (iOS Safari, Chrome Android)
  - _Requirements: 6.1, 6.5_
