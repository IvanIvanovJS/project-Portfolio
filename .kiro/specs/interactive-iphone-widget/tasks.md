# Implementation Plan

- [x] 1. Set up project structure and core interfaces
  - Create directory structure: `src/components/sections/about/iphone-widget/`
  - Create TypeScript interfaces for all components in `types.ts`
  - Define app configuration constants in `utils/appConfig.ts`
  - Create animation configuration in `utils/animations.ts`
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Implement IPhoneFrame component with realistic styling
  - Create `IPhoneFrame.tsx` with iPhone 14 Pro dimensions and aspect ratio
  - Implement CSS module with metallic frame, rounded corners, and notch cutout
  - Add screen bezel with glassmorphism effect
  - Apply realistic shadows and reflections for depth
  - Add click handler for expansion trigger
  - _Requirements: 1.1, 1.3, 2.1_

- [x] 3. Implement SystemBar component with real-time information
  - Create `SystemBar.tsx` with iOS-style status bar layout
  - Display current time in HH:MM format using custom hook
  - Display current day and date
  - Add status icons (signal, WiFi, battery) as decorative elements
  - Apply glassmorphism styling consistent with design
  - Implement `useSystemTime` hook for time updates every minute
  - _Requirements: 1.2, 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 4. Implement HomeScreen component with app grid layout
  - Create `HomeScreen.tsx` with 4-column iOS-style grid
  - Implement responsive grid with proper spacing (16px gaps)
  - Add page indicator dots at the bottom
  - Apply glassmorphism background with subtle wallpaper effect
  - Add bottom dock section for frequently used apps
  - Handle app click events and pass to parent component
  - _Requirements: 1.2, 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 5. Implement AppIcon component with iOS-style appearance
  - Create `AppIcon.tsx` with rounded square shape (60x60px)
  - Implement gradient background based on app color prop
  - Add icon rendering with proper centering and sizing
  - Display app name label below icon
  - Implement press animation (scale down on active)
  - Add glassmorphism overlay and shadow effects
  - Handle click events for functional vs decorative apps
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 6. Implement IPhoneWidget main component with state management
  - Create `IPhoneWidget.tsx` as main orchestrator component
  - Implement state management for expansion, active app, and system time
  - Create `useIPhoneState` custom hook for state logic
  - Add expansion/collapse handlers with modal backdrop
  - Implement keyboard event handlers (Escape to close)
  - Add outside click detection for modal closing
  - Integrate IPhoneFrame, SystemBar, and HomeScreen components
  - _Requirements: 1.1, 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 7. Implement expansion animation with Framer Motion
  - Add Framer Motion AnimatePresence for modal transitions
  - Implement scale animation from thumbnail to fullscreen (500ms)
  - Add backdrop fade-in animation
  - Create smooth easing curve using cubic-bezier
  - Add focus trap when modal is expanded
  - Implement reduced motion support for accessibility
  - _Requirements: 2.1, 2.2, 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 8. Implement AppContainer component for app views
  - Create `AppContainer.tsx` as modal wrapper for opened apps
  - Implement slide-up animation on app open (300ms)
  - Add navigation bar with back button at the top
  - Implement swipe-down gesture to close using react-use-gesture
  - Apply glassmorphism background and proper z-index layering
  - Add scrollable content area with proper overflow handling
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 9.2, 10.2_

- [x] 9. Implement AboutApp component
  - Create `AboutApp.tsx` with personal information display
  - Add profile section with name and title
  - Display bio text with proper typography
  - Show contact information (location, email, phone)
  - Apply glassmorphism card styling
  - Make content scrollable if it exceeds viewport
  - _Requirements: 3.1, 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 10. Implement ProjectsApp component
  - Create `ProjectsApp.tsx` with scrollable project list
  - Display project cards with images using Next.js Image component
  - Show project titles, descriptions, and technology tags
  - Add links to live demos and repositories
  - Implement glassmorphism card styling for each project
  - Add smooth scroll behavior and proper spacing
  - _Requirements: 3.2, 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 11. Implement ResumeApp component
  - Create `ResumeApp.tsx` with resume display or download option
  - Add sections for Experience, Education, and Skills
  - Implement download button with proper file handling
  - Apply glassmorphism styling to content sections
  - Make content scrollable with smooth transitions
  - _Requirements: 3.3, 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 12. Implement PhoneApp component with dialer interface
  - Create `PhoneApp.tsx` with iOS-style phone dialer
  - Display large phone number prominently at the top
  - Add contact card with name and profile placeholder
  - Implement call button that triggers tel: link
  - Add decorative keypad (1-9, \*, 0, #) with glassmorphism buttons
  - Apply iOS phone app color scheme (green for call button)
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 13. Implement EmailApp component with form interface
  - Create `EmailApp.tsx` with email composition form
  - Add input fields: name, email, subject, message (textarea)
  - Implement form validation with inline error messages
  - Add send button with loading state
  - Handle form submission (mailto: link or API endpoint)
  - Display success/error feedback with glassmorphism toast
  - Apply iOS Mail app styling with glassmorphism
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 14. Implement external link handling for GitHub and LinkedIn
  - Add click handlers for GitHub and LinkedIn app icons
  - Open external links in new tab with security attributes (rel="noopener noreferrer")
  - Add visual feedback (brief highlight) when clicked
  - Implement fallback to copy URL to clipboard if popup blocked
  - Display toast notification for successful link opening
  - _Requirements: 3.4, 3.5, 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 15. Implement decorative apps with tooltip feedback
  - Configure decorative apps in appConfig.ts (YouTube, Safari, Photos, Camera, Settings, etc.)
  - Add tooltip or subtle animation when decorative app is clicked
  - Display message: "This app is for visual purposes only"
  - Ensure decorative apps have same visual styling as functional apps
  - Arrange all apps in standard iOS grid layout (4 columns)
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 16. Implement accessibility features
  - Add ARIA labels to all interactive elements (buttons, links, apps)
  - Implement focus trap in modal using focus-trap-react or custom solution
  - Add keyboard navigation support (Tab, Enter, Escape, Arrow keys)
  - Set aria-modal="true" and role="dialog" on expanded iPhone
  - Ensure focus returns to trigger element on modal close
  - Add screen reader announcements for app transitions
  - Test with keyboard-only navigation
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 17. Implement touch and mobile optimizations
  - Add touch event handlers for app icons and buttons
  - Implement swipe-down gesture to close modal on mobile
  - Ensure touch targets are minimum 44x44px
  - Prevent body scroll when modal is open (body scroll lock)
  - Optimize animations for mobile performance (use transform and opacity)
  - Test on various mobile devices and screen sizes
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 18. Implement responsive behavior for all screen sizes
  - Add media queries for desktop (>1024px), tablet (768-1024px), and mobile (<768px)
  - Adjust iPhone thumbnail size: 300px (desktop), 250px (tablet), hidden/small (mobile)
  - Set expanded modal size: 393px (desktop), 90% width (tablet), 95% width (mobile)
  - Ensure proper centering and safe area handling on all devices
  - Test layout at various breakpoints
  - _Requirements: 1.4, 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 19. Integrate IPhoneWidget into AboutSection
  - Import IPhoneWidget component in AboutSection.tsx
  - Remove existing Skills section code
  - Add IPhoneWidget in place of Skills section (right column)
  - Pass required props: personalInfo, projects, resumeUrl, githubUrl, linkedinUrl
  - Add section heading "Mobile Solution" or similar
  - Adjust AboutSection layout to accommodate new widget
  - Update AboutSection.module.css for proper spacing and alignment
  - _Requirements: 1.1, 1.5_

- [ ] 20. Add final polish and performance optimizations
  - Implement lazy loading for app content (React.lazy or dynamic imports)
  - Memoize app icons and static content with React.memo
  - Add CSS containment (contain: layout style paint) to iPhone frame
  - Optimize images with Next.js Image component
  - Add will-change property to animated elements (use sparingly)
  - Test animation performance (should maintain 60fps)
  - Verify no memory leaks on repeated open/close
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ]\* 21. Write unit tests for core components
  - Test IPhoneWidget rendering in thumbnail and expanded states
  - Test state management (expansion, active app, time updates)
  - Test user interactions (click to expand, app clicks, close modal)
  - Test SystemBar time display and updates
  - Test AppIcon rendering and click handling
  - Test form validation in EmailApp
  - _Requirements: All_

- [ ]\* 22. Write integration tests for user flows
  - Test complete navigation flow: thumbnail → expanded → app → home → close
  - Test email form submission flow
  - Test phone app call initiation
  - Test external link opening (GitHub, LinkedIn)
  - Test keyboard navigation through entire widget
  - Test touch gestures on mobile
  - _Requirements: All_

- [ ]\* 23. Write accessibility tests
  - Test keyboard navigation with automated tools
  - Test screen reader announcements
  - Test focus trap in modal
  - Test focus return on close
  - Verify ARIA labels with axe-core
  - Test color contrast ratios
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ]\* 24. Perform visual regression testing
  - Create snapshots for thumbnail state
  - Create snapshots for expanded state
  - Create snapshots for each app view
  - Test responsive breakpoints
  - Verify glassmorphism effects render correctly
  - Test animations with Storybook or similar tool
  - _Requirements: 1.1, 1.2, 1.3, 1.4_
