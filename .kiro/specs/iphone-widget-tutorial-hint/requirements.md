# Requirements Document

## Introduction

This document defines the requirements for an animated tutorial hint feature for the iPhone widget component. The feature will guide users to discover the interactive nature of the widget through a visual hand cursor animation that demonstrates clicking on the About app and returning to the home screen. The animation will be viewport-aware, session-based, and respect user interactions.

## Glossary

- **Tutorial Hint**: The animated hand cursor that demonstrates widget interaction
- **iPhone Widget**: The interactive 3D iPhone component in the About section
- **Viewport Visibility**: The percentage of the widget visible in the browser viewport
- **Session Storage**: Browser storage that persists data for the current browser session only
- **User Interaction**: Any click, tap, or touch event on the iPhone widget
- **Animation Cycle**: One complete sequence of the hand cursor clicking About app and returning to home
- **Interaction Flag**: A session storage value tracking whether the user has interacted with the widget

## Requirements

### Requirement 1

**User Story:** As a portfolio visitor, I want to see an animated hint showing me the widget is interactive, so that I understand I can click on it to explore

#### Acceptance Criteria

1. WHEN the iPhone Widget becomes at least 50% visible in the viewport, THE Tutorial Hint SHALL appear after a 2-second delay
2. THE Tutorial Hint SHALL display an animated hand cursor icon positioned near the About app icon
3. THE Tutorial Hint SHALL animate a clicking motion on the About app icon
4. WHEN the About app animation completes, THE Tutorial Hint SHALL animate clicking the back button
5. WHEN the back button animation completes, THE Tutorial Hint SHALL fade out and the animation cycle SHALL complete

### Requirement 2

**User Story:** As a portfolio visitor, I want the tutorial hint to repeat periodically, so that I notice it even if I miss it the first time

#### Acceptance Criteria

1. WHEN an animation cycle completes, THE Tutorial Hint SHALL wait 10 seconds before starting the next cycle
2. THE Tutorial Hint SHALL continue repeating every 10 seconds while the widget is at least 50% visible in the viewport
3. WHEN the widget visibility drops below 50%, THE Tutorial Hint SHALL pause and not start new animation cycles
4. WHEN the widget returns to at least 50% visibility, THE Tutorial Hint SHALL resume the 10-second repeat cycle
5. THE Tutorial Hint SHALL not interrupt an in-progress animation cycle when visibility changes

### Requirement 3

**User Story:** As a portfolio visitor who clicks on the widget, I want the tutorial hint to stop appearing, so that it doesn't distract me after I've discovered the interaction

#### Acceptance Criteria

1. WHEN the user clicks anywhere on the iPhone Widget, THE Tutorial Hint SHALL immediately stop all animations and hide
2. WHEN the user clicks on the iPhone Widget, THE System SHALL store an interaction flag in session storage with key 'iphone-widget-interacted'
3. WHEN the interaction flag exists in session storage, THE Tutorial Hint SHALL not display on the current page or any subsequent pages in the same session
4. THE Tutorial Hint SHALL check for the interaction flag before starting any animation cycle
5. THE Tutorial Hint SHALL not display if the interaction flag is set to true

### Requirement 4

**User Story:** As a returning portfolio visitor, I want to see the tutorial hint again on each new visit, so that I'm reminded of the interactive feature even if I used it before

#### Acceptance Criteria

1. WHEN the browser session ends (tab/window closed), THE System SHALL clear the interaction flag from session storage
2. WHEN the user opens the portfolio in a new browser session, THE Tutorial Hint SHALL display as if it's the first visit
3. THE System SHALL NOT use localStorage or cookies to persist the interaction flag across sessions
4. THE Tutorial Hint SHALL always appear on the first page load of each new browser session
5. THE interaction flag SHALL only persist within the current session storage scope

### Requirement 5

**User Story:** As a portfolio visitor, I want the tutorial hint animation to be smooth and realistic, so that it clearly demonstrates the interaction pattern

#### Acceptance Criteria

1. THE Tutorial Hint SHALL use a hand cursor icon (pointer finger) that is clearly visible against the widget background
2. THE Tutorial Hint SHALL animate from a starting position to the About app icon with smooth easing
3. THE Tutorial Hint SHALL display a clicking animation (scale down/up) when positioned over the About app
4. THE Tutorial Hint SHALL animate from the About app to the back button position with smooth easing
5. THE Tutorial Hint SHALL display a clicking animation when positioned over the back button

### Requirement 6

**User Story:** As a portfolio visitor, I want the tutorial hint to integrate with existing session storage, so that the implementation is consistent with other features

#### Acceptance Criteria

1. THE Tutorial Hint SHALL use the same session storage utility functions as the Splash Screen component
2. THE System SHALL store the interaction flag in the same session storage structure used by other components
3. THE Tutorial Hint SHALL follow the same naming conventions for session storage keys as existing features
4. THE Tutorial Hint SHALL handle session storage errors gracefully with try-catch blocks
5. THE Tutorial Hint SHALL fall back to not showing the hint if session storage is unavailable

### Requirement 7

**User Story:** As a portfolio visitor using assistive technology, I want the tutorial hint to be accessible, so that it doesn't interfere with my experience

#### Acceptance Criteria

1. THE Tutorial Hint SHALL have aria-hidden="true" to prevent screen reader announcement
2. THE Tutorial Hint SHALL not trap keyboard focus or interfere with keyboard navigation
3. THE Tutorial Hint SHALL not block access to any interactive elements on the page
4. THE Tutorial Hint SHALL respect the user's prefers-reduced-motion setting and not animate if motion is reduced
5. THE Tutorial Hint SHALL have a z-index that keeps it above the widget but below modal overlays

### Requirement 8

**User Story:** As a portfolio visitor on a mobile device, I want the tutorial hint to work on touch devices, so that I understand the widget is tappable

#### Acceptance Criteria

1. THE Tutorial Hint SHALL detect touch events on the iPhone Widget as user interactions
2. THE Tutorial Hint SHALL scale appropriately for mobile viewport sizes
3. THE Tutorial Hint SHALL position correctly relative to the widget on mobile devices
4. THE Tutorial Hint SHALL use touch-friendly timing (slightly longer delays) on mobile devices
5. THE Tutorial Hint SHALL not interfere with native touch scrolling behavior

### Requirement 9

**User Story:** As a portfolio visitor, I want the tutorial hint to perform well, so that it doesn't slow down the page or cause jank

#### Acceptance Criteria

1. THE Tutorial Hint SHALL use CSS transforms for all position animations to enable GPU acceleration
2. THE Tutorial Hint SHALL use requestAnimationFrame for any JavaScript-based animations
3. THE Tutorial Hint SHALL clean up all timers and event listeners when the component unmounts
4. THE Tutorial Hint SHALL not cause layout reflows during animation
5. THE Tutorial Hint SHALL maintain 60fps animation performance on modern devices

### Requirement 10

**User Story:** As a portfolio visitor, I want the tutorial hint to appear at the right time, so that it's helpful without being intrusive

#### Acceptance Criteria

1. THE Tutorial Hint SHALL wait 2 seconds after the widget becomes 50% visible before starting the first animation
2. THE Tutorial Hint SHALL not appear if the user has already scrolled past the widget
3. THE Tutorial Hint SHALL not appear if the widget modal is already open
4. THE Tutorial Hint SHALL pause animations when the browser tab is not visible
5. THE Tutorial Hint SHALL resume animations when the browser tab becomes visible again
