# Implementation Plan

- [x] 1. Update ContactSection styles to remove glass card backgrounds
  - Remove `.glassCard` background, border, and padding styles from ContactSection.module.css
  - Update `.contactInfo` and `.formContainer` to have transparent backgrounds
  - Adjust spacing and layout to work without card containers
  - Ensure proper visual hierarchy is maintained
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Simplify contact icon styling
  - [x] 2.1 Update icon wrapper styles in ContactSection.module.css
    - Remove gradient background from `.iconWrapper`
    - Change to transparent background with subtle border
    - Reduce size from 48px to 40px
    - Use monochrome theme-aware icon colors
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 2.2 Update contact item hover effects
    - Remove background and border changes on hover
    - Implement subtle opacity transition
    - Remove transform effects
    - _Requirements: 2.5_

- [x] 3. Add GitHub and LinkedIn social links
  - [x] 3.1 Update ContactSection component interface
    - Add `github` and `linkedin` optional fields to `contactInfo` prop type
    - Update default contact info with placeholder social URLs
    - _Requirements: 3.1, 3.2_

  - [x] 3.2 Add social link icons to ContactSection.tsx
    - Import `Github` and `Linkedin` icons from lucide-react
    - Render social links after location item in contact info
    - Apply same styling as other contact items
    - Add proper `target="_blank"` and `rel="noopener noreferrer"` attributes
    - Include descriptive `aria-label` attributes
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 4. Reduce form field spacing
  - Update `.form` gap in ContactForm.module.css from 1.5rem to 0.75rem
  - Verify touch targets remain adequate for mobile (minimum 44px)
  - Test visual clarity between fields
  - Ensure accessibility is maintained
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 5. Implement animated conic-gradient background
  - [x] 5.1 Add gradient background layer to ContactSection.module.css
    - Create `::before` pseudo-element on `.formContainer`
    - Position absolutely and center with transform
    - Set size to 400px × 400px
    - Apply conic-gradient with theme colors
    - Add blur filter (70px)
    - Set opacity to 0.35
    - Set z-index to 0
    - _Requirements: 5.1, 5.2, 5.4_

  - [x] 5.2 Add rotation animation
    - Create `@keyframes rotateGradient` animation
    - Rotate from 0deg to 360deg
    - Set duration to 10s with linear timing
    - Apply infinite loop
    - _Requirements: 5.3, 5.5_

  - [x] 5.3 Ensure proper z-index layering
    - Set form content to `position: relative` with `z-index: 1`
    - Verify gradient stays behind form fields
    - Test input focus states
    - _Requirements: 5.4_

  - [x] 5.4 Add reduced motion support
    - Create media query for `prefers-reduced-motion: reduce`
    - Disable animation when user prefers reduced motion
    - Optionally reduce gradient opacity when static
    - _Requirements: 5.6_

- [ ] 6. Verify responsive behavior
  - [ ] 6.1 Test mobile layout (< 768px)
    - Verify vertical stacking of columns
    - Check gradient background scales appropriately
    - Test social links on touch devices
    - Validate form usability
    - _Requirements: 6.1, 6.2, 6.4_

  - [ ] 6.2 Test tablet layout (768px - 992px)
    - Verify layout transitions smoothly
    - Check spacing and readability
    - _Requirements: 6.1, 6.2_

  - [ ] 6.3 Test desktop layout (> 992px)
    - Verify two-column grid layout
    - Check gradient animation performance
    - Validate all interactions
    - _Requirements: 6.3_

- [ ] 7. Validate accessibility compliance
  - [ ] 7.1 Test keyboard navigation
    - Tab through all interactive elements
    - Verify focus indicators are visible
    - Test social link keyboard activation
    - Ensure form fields are keyboard accessible
    - _Requirements: 7.2, 7.4_

  - [ ] 7.2 Verify ARIA labels and semantic HTML
    - Check social links have descriptive aria-labels
    - Verify form labels are properly associated
    - Validate semantic structure
    - _Requirements: 7.1_

  - [ ] 7.3 Test color contrast
    - Verify text contrast over gradient background
    - Check icon visibility
    - Validate link colors meet WCAG standards
    - _Requirements: 7.2_

  - [ ] 7.4 Verify reduced motion preference
    - Test with system reduced motion enabled
    - Confirm animation is disabled
    - Validate static appearance
    - _Requirements: 7.5_

- [ ]\* 8. Performance optimization
  - [ ]\* 8.1 Monitor animation performance
    - Check FPS during gradient animation
    - Test on lower-end devices
    - Optimize if frame drops detected
    - _Requirements: 5.5_

  - [ ]\* 8.2 Validate paint performance
    - Check for layout thrashing
    - Verify composite layers
    - Monitor backdrop-filter performance
    - _Requirements: 5.5_
