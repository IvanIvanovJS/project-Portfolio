# Design Document

## Overview

This design transforms the Contact section into a minimalist, creative interface by removing heavy glass card styling, simplifying icons, adding social links, tightening form spacing, and introducing an animated conic-gradient background. The result is a cleaner, more modern aesthetic that maintains functionality while enhancing visual appeal.

## Architecture

### Component Structure

```
ContactSection (Container)
├── Header (Title + Subtitle)
├── Content Grid
│   ├── ContactInfo (Left Column)
│   │   ├── Contact Items (Email, Phone, Location)
│   │   └── Social Links (GitHub, LinkedIn)
│   └── ContactForm (Right Column)
│       ├── Animated Background Layer
│       └── Form Fields
```

### Layout Changes

**Before:**

- Two separate glass cards with backgrounds and borders
- Wide spacing between form fields
- Colorful gradient icon backgrounds
- No social media links

**After:**

- Open layout without card containers
- Compact form field spacing
- Minimal monochrome icons
- GitHub and LinkedIn links added
- Animated gradient background on form area

## Components and Interfaces

### ContactSection Component

**Changes:**

- Remove `.glassCard` wrapper from both columns
- Apply minimal styling directly to content areas
- Maintain grid layout for desktop, stack for mobile

**Props:** No changes to existing interface

```typescript
interface ContactSectionProps {
  contactInfo?: {
    email: string;
    phone?: string;
    location?: string;
    github?: string; // New
    linkedin?: string; // New
  };
}
```

### ContactInfo Subsection

**Visual Design:**

1. **Icon Styling:**
   - Remove gradient backgrounds from `.iconWrapper`
   - Use simple circular containers with subtle border
   - Monochrome icons with theme-aware colors
   - Size: 40px × 40px (reduced from 48px)

2. **Contact Items:**
   - Remove individual item backgrounds and borders
   - Use simple flex layout with icon + text
   - Hover effect: subtle opacity change only
   - Spacing: 1.5rem between items (reduced)

3. **Social Links:**
   - Add GitHub and LinkedIn icons from lucide-react
   - Same styling as contact items
   - Open in new tab with `target="_blank"` and `rel="noopener noreferrer"`
   - Position after location item

**CSS Changes:**

```css
/* Remove glass card styling */
.contactInfo {
  /* No background, no border, no padding */
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Simplified icon wrapper */
.iconWrapper {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Minimal item styling */
.infoItem {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0;
  background: transparent;
  border: none;
  transition: opacity 0.2s ease;
}

.infoItem:hover {
  opacity: 0.8;
}
```

### ContactForm Subsection

**Visual Design:**

1. **Container:**
   - Remove glass card background and border
   - Add animated gradient background layer
   - Position form content above gradient

2. **Animated Background:**
   - Conic gradient with multiple color stops
   - Centered positioning (50% 50%)
   - Blur filter: 60-80px for soft diffusion
   - Rotation animation: 8-10s duration
   - Size: 400px × 400px circle
   - Opacity: 0.3-0.4 for subtlety

3. **Form Fields:**
   - Reduce gap from 1.5rem to 0.75rem
   - Maintain input padding for usability
   - Keep existing glass input styling
   - Ensure labels remain visible

**CSS Implementation:**

```css
.formContainer {
  position: relative;
  display: flex;
  flex-direction: column;
}

/* Animated gradient background */
.formContainer::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 400px;
  background: conic-gradient(
    from 0deg,
    var(--color-primary),
    var(--color-accent),
    var(--color-primary-60),
    var(--color-accent),
    var(--color-primary)
  );
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.35;
  animation: rotateGradient 10s linear infinite;
  z-index: 0;
  pointer-events: none;
}

@keyframes rotateGradient {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

/* Ensure form content is above gradient */
.form {
  position: relative;
  z-index: 1;
  gap: 0.75rem; /* Reduced from 1.5rem */
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .formContainer::before {
    animation: none;
  }
}
```

## Data Models

### Extended Contact Info

```typescript
interface ContactInfo {
  email: string;
  phone?: string;
  location?: string;
  github?: string; // GitHub profile URL
  linkedin?: string; // LinkedIn profile URL
}
```

### Social Link Item

```typescript
interface SocialLink {
  icon: LucideIcon;
  label: string;
  url: string;
  ariaLabel: string;
}
```

## Error Handling

### Missing Social Links

- If `github` or `linkedin` are undefined, don't render those items
- Gracefully handle empty or invalid URLs
- Provide console warning in development mode

### Animation Performance

- Use `will-change: transform` on animated gradient
- Monitor frame rate, disable animation if performance degrades
- Respect `prefers-reduced-motion` media query

## Testing Strategy

### Visual Testing

1. **Layout Verification:**
   - Verify removal of glass card backgrounds
   - Check icon simplification
   - Confirm social links appear correctly
   - Validate form spacing reduction
   - Inspect gradient animation

2. **Responsive Testing:**
   - Test on mobile (320px-768px)
   - Test on tablet (768px-1024px)
   - Test on desktop (1024px+)
   - Verify stacking behavior

3. **Theme Testing:**
   - Test in light theme
   - Test in dark theme
   - Verify icon colors adapt
   - Check gradient visibility

### Interaction Testing

1. **Social Links:**
   - Click GitHub link → opens in new tab
   - Click LinkedIn link → opens in new tab
   - Verify `rel="noopener noreferrer"` security

2. **Form Functionality:**
   - Fill and submit form
   - Verify gradient doesn't interfere with input focus
   - Test keyboard navigation

3. **Accessibility:**
   - Screen reader navigation
   - Keyboard-only navigation
   - Focus indicators visible
   - ARIA labels present

### Performance Testing

1. **Animation Performance:**
   - Monitor FPS during gradient animation
   - Test on lower-end devices
   - Verify reduced motion preference

2. **Paint Performance:**
   - Check for layout thrashing
   - Verify backdrop-filter performance
   - Monitor composite layers

## Implementation Notes

### Icon Library

Use lucide-react icons:

- `Mail` - existing
- `Phone` - existing
- `MapPin` - existing
- `Github` - new
- `Linkedin` - new

### Color Variables

Leverage existing CSS custom properties:

- `--color-primary` - for gradient
- `--color-accent` - for gradient
- `--fg-primary` - for text and icons
- `--glass-border` - for icon borders

### Gradient Colors

Use theme-aware colors in conic-gradient:

- Primary color
- Accent color
- Primary with 60% opacity
- Cycle back to create smooth loop

### Z-Index Management

```
Layers (bottom to top):
1. Animated gradient (z-index: 0)
2. Form content (z-index: 1)
```

## Accessibility Considerations

### ARIA Labels

```tsx
<a
  href={github}
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Visit my GitHub profile"
>
  <Github />
</a>
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .formContainer::before {
    animation: none;
    opacity: 0.2; /* Reduce opacity when static */
  }
}
```

### Focus Management

- Maintain visible focus indicators
- Ensure gradient doesn't obscure focus rings
- Test with keyboard navigation

### Color Contrast

- Verify text remains readable over gradient
- Ensure minimum 4.5:1 contrast ratio
- Test with contrast checking tools

## Migration Path

1. Update ContactSection.module.css
   - Remove glass card styles
   - Add gradient animation
   - Adjust spacing

2. Update ContactSection.tsx
   - Add social links to contact info
   - Remove glass card wrappers
   - Add GitHub and LinkedIn icons

3. Update ContactForm.module.css
   - Reduce form gap
   - Ensure z-index layering

4. Test thoroughly across devices and themes

5. Validate accessibility compliance

## Visual Reference

### Icon Styling Comparison

**Before:**

```
[Gradient Background Circle]
  [White Icon]
```

**After:**

```
[Transparent Circle with Border]
  [Theme-colored Icon]
```

### Layout Comparison

**Before:**

```
┌─────────────────┐  ┌─────────────────┐
│ Glass Card      │  │ Glass Card      │
│ [Contact Info]  │  │ [Form]          │
│                 │  │                 │
└─────────────────┘  └─────────────────┘
```

**After:**

```
[Contact Info]       [Animated Gradient]
                     [Form on top]
```

## Performance Targets

- First Contentful Paint: < 1.5s
- Animation FPS: 60fps
- Layout Shift: < 0.1
- Interaction Latency: < 100ms
