# Requirements Document

## Introduction

This feature introduces a cinematic splash screen that displays before the hero section, creating a smooth, professional loading experience. The splash screen shows an "Assembling Technical Stack" message with animated text that transitions seamlessly into the main hero page once all assets are loaded.

## Glossary

- **Splash Screen**: The initial loading screen displayed before the main content
- **Hero Section**: The main landing section of the portfolio website (ThreeScene + text overlays)
- **Leak Motion Glow**: A horizontal light streak effect that signals completion
- **ThreeScene**: The 3D Three.js canvas component in the hero section
- **Fade Transition**: Opacity-based animation from 0 to 1 or vice versa
- **Slide Animation**: Position-based animation using translateX or translateY

## Requirements

### Requirement 1

**User Story:** As a visitor, I want to see a visually appealing splash screen while the site loads, so that I have a polished first impression and understand the site is preparing content.

#### Acceptance Criteria

1. WHEN the page loads, THE Splash Screen SHALL display with the same background as ThreeScene
2. WHEN the Splash Screen displays, THE System SHALL show "Assembling" text with Rubik Glitch font family sliding from left to right with fade-in effect within 0.5 seconds
3. WHEN "Assembling" animation completes, THE System SHALL show "Technical Stack" text with Rubik Glitch font family sliding from right to left with fade-in effect within 0.7 seconds
4. WHEN "Technical Stack" animation starts, THE System SHALL show "Compiling innovation..." subtext with italic style, 0.6 opacity, sliding upward with fade-in effect within 0.5 seconds
5. WHILE all text elements are visible, THE Splash Screen SHALL hold the display for 0.3 seconds

### Requirement 2

**User Story:** As a visitor, I want the splash screen to transition smoothly to the main content, so that the experience feels seamless and professional.

#### Acceptance Criteria

1. WHEN the hold period completes, THE System SHALL fade out all text elements with translateY(-40px) and scale(0.95) within 0.5 seconds
2. WHEN text fade-out reaches 80% completion, THE System SHALL display a horizontal leak motion glow effect moving from center to sides within 0.3 seconds
3. WHEN the splash screen fade-out completes, THE System SHALL reveal the Hero Section with fade-in and translateY(60px to 0) within 0.7 seconds
4. THE System SHALL ensure total splash sequence duration does not exceed 3 seconds
5. THE System SHALL ensure smooth easing transitions using cubic-bezier timing functions

### Requirement 3

**User Story:** As a visitor, I want the hero section to be fully loaded before it appears, so that I don't see loading artifacts or incomplete content.

#### Acceptance Criteria

1. WHILE the splash screen displays, THE System SHALL preload ThreeScene 3D assets in the background
2. WHILE the splash screen displays, THE System SHALL preload hero section text overlays and images
3. WHEN all hero assets are loaded, THE System SHALL mark the hero section as ready for display
4. IF hero assets load before splash animation completes, THEN THE System SHALL wait for splash animation to finish before transitioning
5. IF hero assets take longer than 2.8 seconds to load, THEN THE System SHALL extend splash hold period until assets are ready

### Requirement 4

**User Story:** As a visitor, I want the splash screen text to be visually centered and styled appropriately, so that it looks professional and matches the site's aesthetic.

#### Acceptance Criteria

1. THE Splash Screen SHALL center all text elements horizontally and vertically
2. THE Splash Screen SHALL display "Assembling" and "Technical Stack" with Rubik Glitch font family at bold weight
3. THE Splash Screen SHALL display "Compiling innovation..." with the site's default font in italic style at 0.6 opacity
4. THE Splash Screen SHALL size the subtext smaller than the main text for visual hierarchy
5. THE Splash Screen SHALL apply appropriate letter-spacing and line-height for readability

### Requirement 5

**User Story:** As a visitor using a device with reduced motion preferences, I want animations to be minimal, so that the experience is comfortable and accessible.

#### Acceptance Criteria

1. WHEN the user has prefers-reduced-motion enabled, THE System SHALL reduce animation duration to 0.1 seconds
2. WHEN the user has prefers-reduced-motion enabled, THE System SHALL remove slide and scale transformations
3. WHEN the user has prefers-reduced-motion enabled, THE System SHALL use only fade transitions
4. THE System SHALL maintain the same sequence order regardless of motion preferences
5. THE System SHALL ensure total duration with reduced motion does not exceed 1 second

### Requirement 6

**User Story:** As a developer, I want the splash screen to be a reusable component, so that it can be easily maintained and tested.

#### Acceptance Criteria

1. THE System SHALL implement the splash screen as a standalone React component
2. THE System SHALL use CSS Modules for splash screen styling
3. THE System SHALL expose loading state callbacks for integration with the hero section
4. THE System SHALL handle cleanup of animation timers on component unmount
5. THE System SHALL provide TypeScript type definitions for all props and state
