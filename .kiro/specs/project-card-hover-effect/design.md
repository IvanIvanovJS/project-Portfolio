# Design Document

## Overview

This design implements a modern hover interaction for project cards where the default state shows project information (title, description, status, technologies), and on hover, smoothly transitions to reveal the project image with overlaid action buttons. The design leverages CSS transitions, absolute positioning, and opacity changes to create a seamless, space-efficient user experience.

## Architecture

### Component Structure

The ProjectCard component will maintain its existing React structure but reorganize the DOM layout to support layered content with smooth transitions:

```
ProjectCard (motion.div)
├── Decorative Background Elements (existing)
│   ├── cardBackground
│   └── cardBackgroundBlur
└── Content Container
    ├── Image Layer (absolute positioned)
    │   ├── Project Image
    │   └── Action Buttons Overlay
    │       ├── GitHub Button (conditional)
    │       └── Live Demo Button (conditional)
    └── Info Layer (absolute positioned)
        ├── Title
        ├── Status Badge
        ├── Description
        └── Technology Tags
```

### State Management

The component will use CSS-based state management through the `:hover` and `:focus-within` pseudo-classes, eliminating the need for JavaScript state management for the hover effect. This approach provides:

- Better performance (GPU-accelerated CSS transitions)
- Automatic accessibility support for keyboard navigation
- Simpler implementation without additional React state

## Components and Interfaces

### Modified ProjectCard Component

**File:** `src/components/sections/projects/ProjectCard.tsx`

**Changes:**

1. Restructure JSX to create two absolute-positioned layers
2. Move action buttons from bottom of card to overlay on image
3. Add wrapper divs for proper layering and positioning
4. Maintain existing Framer Motion animations for card entrance
5. Update Next.js Image component usage (addressing existing warning)

**Props Interface:** (No changes to existing interface)

```typescript
interface ProjectCardProps {
  project: ProjectData;
  index: number;
}
```

### CSS Module Structure

**File:** `src/components/sections/projects/ProjectCard.module.css`

**New Classes:**

- `.contentWrapper` - Container for layered content with relative positioning
- `.imageLayer` - Absolute positioned layer for image and buttons
- `.infoLayer` - Absolute positioned layer for text content
- `.actionButtons` - Overlay container for GitHub and Live Demo buttons
- `.actionButton` - Individual button styling with glassmorphism

**Modified Classes:**

- `.content` - Update to support layered children
- `.imageContainer` - Adjust for full card coverage
- `.projectInfo` - Convert to absolute positioning
- `.links` - Remove (replaced by `.actionButtons`)
- `.link` - Remove (replaced by `.actionButton`)

## Data Models

No changes to existing data models. The component continues to use:

```typescript
interface ProjectData {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: Technology[];
  status: 'completed' | 'in-progress' | 'planned';
  links: {
    live?: string;
    github?: string;
  };
  // ... other fields
}
```

## Detailed Design

### Layer Transition Mechanism

**Default State (No Hover):**

- Info Layer: `opacity: 1`, `pointer-events: auto`, `z-index: 20`
- Image Layer: `opacity: 0`, `pointer-events: none`, `z-index: 10`

**Hover State:**

- Info Layer: `opacity: 0`, `pointer-events: none`, `z-index: 10`
- Image Layer: `opacity: 1`, `pointer-events: auto`, `z-index: 20`

**Transition Properties:**

```css
transition:
  opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
  z-index 0s 0.15s; /* Delay z-index change to middle of transition */
```

### Action Buttons Overlay Design

The action buttons will be centered over the image using flexbox:

```css
.actionButtons {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 16px;
  z-index: 30;
}
```

**Button Styling - Liquid Glass Effect:**

- Backdrop filter with saturation: `backdrop-filter: blur(10px) saturate(180%)`
- Semi-transparent background: `rgba(255, 255, 255, 0.15)`
- Border with subtle gradient: `1px solid rgba(255, 255, 255, 0.3)`
- **Inset shadows for depth:** `inset 0 1px 1px rgba(255, 255, 255, 0.4), inset 0 -1px 1px rgba(0, 0, 0, 0.1)`
- **Outer glow:** `0 8px 32px rgba(0, 0, 0, 0.1)`
- Combined box-shadow for liquid glass effect
- Padding: `12px 24px`
- Border radius: `12px`
- Icon + text layout with 8px gap
- Hover state: Increase opacity, add subtle scale (1.05), enhance glow to `0 12px 48px rgba(0, 0, 0, 0.15)`

### Image Presentation

**Dimensions:**

- Full card height coverage
- Maintain aspect ratio with `object-fit: cover`
- Dark overlay gradient for button contrast: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5))`

**Optimization:**

- Use Next.js `Image` component instead of `<img>` tag
- Lazy loading enabled
- Responsive sizes attribute for optimal bandwidth

### Responsive Behavior

**Desktop (> 768px):**

- Full hover effect as described
- Buttons display side-by-side

**Tablet (768px - 480px):**

- Maintain hover effect
- Buttons stack vertically if both present
- Slightly larger touch targets (48x48px minimum)

**Mobile (< 480px):**

- Disable hover effect
- Show info layer by default
- Add "View Project" button at bottom that toggles to image layer
- Tap image layer to return to info
- Alternative: Show both layers with reduced opacity, tap to focus

### Accessibility Considerations

**Keyboard Navigation:**

```css
.projectCard:focus-within .imageLayer {
  opacity: 1;
  pointer-events: auto;
  z-index: 20;
}

.projectCard:focus-within .infoLayer {
  opacity: 0;
  pointer-events: none;
  z-index: 10;
}
```

**Screen Readers:**

- Maintain semantic HTML structure
- Add `aria-label` to action buttons
- Include visually hidden text for context
- Ensure image has descriptive `alt` text

**Reduced Motion:**

```css
@media (prefers-reduced-motion: reduce) {
  .imageLayer,
  .infoLayer {
    transition: opacity 0.1s linear;
  }
}
```

**Color Contrast:**

- Action buttons: Ensure 4.5:1 contrast ratio
- Add dark overlay on image to guarantee button visibility
- Test with various image backgrounds

## Error Handling

### Missing Image

If `project.image` is undefined or fails to load:

- Display placeholder gradient background
- Show action buttons over placeholder
- Maintain same interaction pattern

**Implementation:**

```typescript
{project.image ? (
  <Image src={project.image} alt={project.title} ... />
) : (
  <div className={styles.imagePlaceholder} />
)}
```

### Missing Links

- If no GitHub link: Hide GitHub button
- If no Live Demo link: Hide Live Demo button
- If no links at all: Show message "Coming Soon" centered
- Adjust button layout dynamically based on available links

### Touch Device Detection

Use CSS media query for hover capability:

```css
@media (hover: none) {
  /* Mobile-specific styles */
}
```

## Testing Strategy

### Visual Testing

1. **Default State Verification**
   - Confirm info layer visible, image layer hidden
   - Check all text content renders correctly
   - Verify technology tags display properly

2. **Hover State Verification**
   - Smooth transition timing (300ms)
   - Image layer fully visible
   - Action buttons properly positioned and styled
   - Info layer completely hidden

3. **Transition Smoothness**
   - No flickering during state change
   - Z-index changes at correct timing
   - Easing function creates natural motion

### Interaction Testing

1. **Mouse Hover**
   - Hover triggers transition
   - Mouse leave reverses transition
   - Rapid hover/unhover doesn't break state

2. **Keyboard Navigation**
   - Tab to card triggers hover state
   - Tab through action buttons maintains hover
   - Tab away returns to default state

3. **Touch Interaction**
   - Tap toggles between states on mobile
   - Touch targets meet 44x44px minimum
   - No hover state stuck on touch devices

### Responsive Testing

1. **Desktop (1920px, 1440px, 1024px)**
   - Full hover effect works
   - Buttons side-by-side
   - Proper spacing and sizing

2. **Tablet (768px, 834px)**
   - Hover effect maintained
   - Buttons adjust layout if needed
   - Touch targets adequate

3. **Mobile (375px, 414px, 390px)**
   - Alternative interaction pattern works
   - All content accessible
   - No horizontal scroll

### Accessibility Testing

1. **Keyboard Navigation**
   - All interactive elements reachable via Tab
   - Focus indicators visible
   - Logical tab order maintained

2. **Screen Reader**
   - Test with NVDA/JAWS/VoiceOver
   - Verify button labels announced correctly
   - Ensure state changes communicated

3. **Reduced Motion**
   - Verify transitions respect prefers-reduced-motion
   - Functionality maintained with minimal animation

4. **Color Contrast**
   - Test with various image backgrounds
   - Verify button text meets WCAG AA (4.5:1)
   - Check status badge contrast

### Browser Compatibility

Test in:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

Verify:

- CSS backdrop-filter support
- CSS transitions work correctly
- Hover/focus states behave consistently

## Performance Considerations

### CSS Optimization

- Use `transform` and `opacity` for animations (GPU-accelerated)
- Avoid animating `height`, `width`, or `top/left` positions
- Use `will-change: opacity` sparingly and only during transitions

### Image Optimization

- Implement Next.js Image component with proper sizing
- Use WebP format with fallbacks
- Lazy load images below the fold
- Provide appropriate `sizes` attribute for responsive images

### Rendering Performance

- Minimize repaints by using absolute positioning
- Avoid layout thrashing with CSS-only transitions
- Use `pointer-events: none` to prevent unnecessary event handling on hidden layers

## Implementation Notes

### Migration from Current Design

1. **Preserve existing features:**
   - Framer Motion entrance animations
   - Decorative background elements
   - Status badge styling
   - Technology tags display

2. **Remove:**
   - Bottom-positioned action links
   - Current image container positioning

3. **Add:**
   - Layered content structure
   - Image overlay with buttons
   - Hover/focus state transitions
   - Mobile toggle functionality

### CSS Custom Properties

Leverage existing CSS variables:

- `--spacing-*` for consistent spacing
- `--font-size-*` for typography
- `--color-primary`, `--color-accent` for theming
- `--fg-primary`, `--bg-primary` for colors

### Z-Index Management

Establish clear z-index hierarchy:

- Decorative backgrounds: 0-5
- Image layer (default): 10
- Info layer (default): 20
- Image layer (hover): 20
- Info layer (hover): 10
- Action buttons: 30

## Future Enhancements

1. **Animation Variants**
   - Slide transitions instead of fade
   - Flip card effect
   - Scale and rotate combinations

2. **Interactive Elements**
   - Quick preview modal on button click
   - Technology tag filtering
   - Project comparison feature

3. **Advanced Accessibility**
   - Voice control support
   - Customizable animation speeds
   - High contrast mode

4. **Performance**
   - Intersection Observer for lazy animation
   - Progressive image loading
   - Skeleton loading states

## Liquid Glass Effect Enhancement

### Background Animation

Add animated gradient background for depth and visual interest:

```css
@keyframes moveGradient {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.cardBackground {
  background: linear-gradient(
    315deg,
    var(--bg-primary),
    var(--color-accent),
    var(--color-primary-20),
    var(--color-accent)
  );
  background-size: 200% 200%;
  animation: moveGradient 8s ease infinite;
}
```

### Enhanced Glassmorphism

Apply liquid glass effect to all glass surfaces:

**Card Content:**

```css
.content {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px) saturate(180%);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.3),
    inset 0 -1px 1px rgba(0, 0, 0, 0.1),
    0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

**Action Buttons:**

```css
.actionButton {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px) saturate(180%);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.4),
    inset 0 -1px 1px rgba(0, 0, 0, 0.1),
    0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.actionButton:hover {
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.5),
    inset 0 -1px 1px rgba(0, 0, 0, 0.1),
    0 12px 48px rgba(0, 0, 0, 0.15);
  transform: scale(1.05);
}
```

**Info Layer Elements:**

```css
.statusBadge,
.techTag {
  backdrop-filter: blur(5px) saturate(180%);
  box-shadow:
    inset 0 1px 0.5px rgba(255, 255, 255, 0.2),
    0 4px 16px rgba(0, 0, 0, 0.05);
}
```

### Depth Layers

Create visual depth with multiple reflection layers:

1. **Primary reflection** - Top inset highlight: `inset 0 1px 1px rgba(255, 255, 255, 0.3-0.5)`
2. **Secondary reflection** - Bottom inset shadow: `inset 0 -1px 1px rgba(0, 0, 0, 0.1)`
3. **Ambient shadow** - Outer glow: `0 8px 32px rgba(0, 0, 0, 0.1)`
4. **Hover enhancement** - Increased glow on interaction: `0 12px 48px rgba(0, 0, 0, 0.15)`

### Performance Considerations

- Use `will-change: transform, box-shadow` only during hover/animation
- Combine multiple box-shadows in single declaration
- Limit backdrop-filter blur radius to 10-15px for performance
- Use CSS containment: `contain: layout style paint`
