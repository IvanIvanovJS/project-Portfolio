# Design Document

## Overview

The Frosted Glass Logo is an interactive branding component that displays "i i" in its default state and expands to reveal "Ivan Ivanov" on hover. The component leverages the site's existing glassmorphism design system with enhanced frosted glass effects, smooth animations, and accessibility features. It will replace the current "Portfolio" text logo in the header.

## Architecture

### Component Structure

```
src/components/ui/frosted-glass-logo/
├── FrostedGlassLogo.tsx          # Main component
├── FrostedGlassLogo.module.css   # Component styles
├── README.md                      # Component documentation
└── index.ts                       # Export barrel
```

### Integration Points

1. **Header Component** (`src/components/layout/header/Header.tsx`)
   - Replace the existing logo div with FrostedGlassLogo component
   - Maintain responsive behavior and layout

2. **Glassmorphism System** (`src/styles/glassmorphism.css`)
   - Extend existing glass utilities if needed
   - Follow established patterns for consistency

## Components and Interfaces

### FrostedGlassLogo Component

**Props Interface:**

```typescript
interface FrostedGlassLogoProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  href?: string;
  ariaLabel?: string;
}
```

**Component Features:**

1. **Default State**: Displays "i i" with spacing
2. **Hover/Focus State**: Expands to "Ivan Ivanov"
3. **Interactive**: Clickable/tappable with keyboard support
4. **Responsive**: Scales appropriately for mobile devices
5. **Accessible**: ARIA labels, keyboard navigation, screen reader support

### State Management

The component uses internal state to manage:

- `isExpanded`: Boolean tracking hover/focus/tap state
- Animation triggers for smooth transitions

### Animation Strategy

**CSS-based animations** for optimal performance:

- Width transition with `cubic-bezier(0.4, 0, 0.2, 1)` easing
- Opacity fade for revealing letters
- Transform scale for hover feedback
- Duration: 400ms for expansion, 300ms for collapse

## Data Models

### Typography Configuration

```typescript
const LOGO_CONFIG = {
  defaultText: 'i i',
  expandedText: 'Ivan Ivanov',
  fontSize: {
    desktop: '1.5rem', // 24px
    mobile: '1.25rem', // 20px
  },
  letterSpacing: {
    default: '0.1em',
    expanded: '0.05em',
  },
  fontWeight: 600,
  fontFamily: 'var(--font-family-primary)',
};
```

### Animation Timing

```typescript
const ANIMATION_CONFIG = {
  expandDuration: 400, // ms
  collapseDuration: 300, // ms
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  hoverDelay: 0, // Immediate response
  scaleOnHover: 1.03,
};
```

## Styling Architecture

### Frosted Glass Effect

Following the glassmorphism design standards with enhanced frosting:

```css
.logo {
  /* Base glass effect */
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px) saturate(180%);
  -webkit-backdrop-filter: blur(15px) saturate(180%);

  /* Layered shadows for depth */
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.3),
    inset 0 -1px 1px rgba(0, 0, 0, 0.1),
    0 8px 32px rgba(0, 0, 0, 0.1);

  /* Subtle border */
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;

  /* Smooth transitions */
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Hover State Enhancement

```css
.logo:hover,
.logo.expanded {
  /* Enhanced glass effect */
  background: rgba(255, 255, 255, 0.1);

  /* Increased glow */
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.4),
    inset 0 -1px 1px rgba(0, 0, 0, 0.1),
    0 12px 48px rgba(0, 0, 0, 0.15);

  /* Subtle scale */
  transform: scale(1.03);

  /* Brighter border */
  border-color: rgba(255, 255, 255, 0.25);
}
```

### Text Animation

```css
.logoText {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Individual letter animation */
.letter {
  display: inline-block;
  opacity: 0;
  transform: translateX(-10px);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.letter.visible {
  opacity: 1;
  transform: translateX(0);
}

/* Stagger animation for letters */
.letter:nth-child(1) {
  transition-delay: 0ms;
}
.letter:nth-child(2) {
  transition-delay: 50ms;
}
.letter:nth-child(3) {
  transition-delay: 100ms;
}
/* ... and so on */
```

### Theme Support

```css
/* Dark theme (default) */
:global([data-theme='dark']) .logo {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.05);
}

/* Light theme */
:global([data-theme='light']) .logo {
  color: rgba(23, 23, 23, 0.9);
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.3);
}
```

### Responsive Design

```css
/* Desktop (default) */
.logo {
  padding: 12px 20px;
  font-size: 1.5rem;
  min-height: 48px;
}

/* Tablet */
@media (max-width: 1024px) {
  .logo {
    padding: 10px 18px;
    font-size: 1.375rem;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .logo {
    padding: 8px 16px;
    font-size: 1.25rem;
    min-height: 44px;
    backdrop-filter: blur(10px) saturate(150%);
  }
}
```

## Implementation Details

### Component Structure

```tsx
export const FrostedGlassLogo: React.FC<FrostedGlassLogoProps> = ({
  className = '',
  style,
  onClick,
  href = '#hero',
  ariaLabel = 'Ivan Ivanov - Portfolio Home',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch device
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window);
  }, []);

  // Handle mouse events
  const handleMouseEnter = () => {
    if (!isTouchDevice) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice) {
      setIsExpanded(false);
    }
  };

  // Handle touch/click events
  const handleClick = (e: React.MouseEvent) => {
    if (isTouchDevice) {
      e.preventDefault();
      setIsExpanded(!isExpanded);

      // Auto-collapse after 2 seconds on touch devices
      setTimeout(() => setIsExpanded(false), 2000);
    }

    if (onClick) {
      onClick();
    } else if (href) {
      // Smooth scroll to section
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  // Render letters with animation
  const renderText = () => {
    const text = isExpanded ? 'Ivan Ivanov' : 'i i';
    return text.split('').map((char, index) => (
      <span
        key={index}
        className={`${styles.letter} ${isExpanded ? styles.visible : ''}`}
        style={{ transitionDelay: `${index * 50}ms` }}
      >
        {char}
      </span>
    ));
  };

  return (
    <a
      href={href}
      className={`${styles.logo} ${isExpanded ? styles.expanded : ''} ${className}`}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      role="button"
      tabIndex={0}
    >
      <span className={styles.logoText}>{renderText()}</span>
    </a>
  );
};
```

### Alternative Simpler Approach

For better performance and simpler implementation, use CSS-only animation with pseudo-content:

```tsx
export const FrostedGlassLogo: React.FC<FrostedGlassLogoProps> = ({
  className = '',
  style,
  onClick,
  href = '#hero',
  ariaLabel = 'Ivan Ivanov - Portfolio Home',
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    } else if (href) {
      e.preventDefault();
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <a
      href={href}
      className={`${styles.logo} ${className}`}
      style={style}
      onClick={handleClick}
      aria-label={ariaLabel}
      tabIndex={0}
    >
      <span className={styles.logoText} data-text="Ivan Ivanov">
        i i
      </span>
    </a>
  );
};
```

With CSS:

```css
.logoText {
  position: relative;
  display: inline-block;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo:hover .logoText,
.logo:focus-visible .logoText {
  /* Hide default text */
  color: transparent;
}

.logo:hover .logoText::after,
.logo:focus-visible .logoText::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
  color: inherit;
  opacity: 1;
  animation: expandText 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes expandText {
  from {
    opacity: 0;
    letter-spacing: 0.2em;
  }
  to {
    opacity: 1;
    letter-spacing: 0.05em;
  }
}
```

**Recommendation**: Use the simpler CSS-only approach for better performance and maintainability.

## Error Handling

### Fallback Strategies

1. **Backdrop Filter Unsupported**:

   ```css
   @supports not (backdrop-filter: blur(10px)) {
     .logo {
       background: rgba(255, 255, 255, 0.9);
       backdrop-filter: none;
     }
   }
   ```

2. **JavaScript Disabled**: Component still functions as a link with default "i i" text

3. **Touch Device Detection Failure**: Defaults to hover behavior

### Edge Cases

- **Rapid hover on/off**: Debounce not needed due to CSS transitions
- **Multiple simultaneous interactions**: CSS handles state naturally
- **Screen reader navigation**: ARIA labels provide context
- **Keyboard-only navigation**: Full support with focus states

## Testing Strategy

### Unit Tests

1. **Component Rendering**:
   - Renders with default "i i" text
   - Applies custom className and style props
   - Renders as anchor element with correct href

2. **Interaction Tests**:
   - Expands on mouse enter (desktop)
   - Collapses on mouse leave (desktop)
   - Toggles on click (touch devices)
   - Responds to keyboard Enter/Space

3. **Accessibility Tests**:
   - Has proper ARIA label
   - Keyboard focusable with tabIndex
   - Focus visible indicator present
   - Screen reader announces correctly

### Integration Tests

1. **Header Integration**:
   - Logo renders in header
   - Maintains header layout
   - Responsive behavior works
   - Navigation functionality preserved

2. **Theme Integration**:
   - Styles adapt to dark theme
   - Styles adapt to light theme
   - Smooth theme transitions

### Visual Regression Tests

1. Default state appearance
2. Hover state appearance
3. Focus state appearance
4. Mobile responsive layout
5. Theme variations

### Manual Testing Checklist

- [ ] Hover animation smooth on desktop
- [ ] Touch interaction works on mobile
- [ ] Keyboard navigation functional
- [ ] Focus indicator visible
- [ ] Glassmorphism effect renders correctly
- [ ] Works in Safari (webkit-backdrop-filter)
- [ ] Works in Firefox
- [ ] Works in Chrome/Edge
- [ ] Reduced motion preference respected
- [ ] High contrast mode accessible

## Performance Considerations

### Optimization Strategies

1. **CSS-only animations**: No JavaScript animation loops
2. **GPU acceleration**: Use `transform` and `opacity` for animations
3. **Will-change hint**: Apply sparingly on hover
4. **Debouncing**: Not needed due to CSS transitions
5. **Lazy loading**: Component is critical, no lazy loading needed

### Performance Metrics

- **First Paint**: No impact (small component)
- **Interaction Latency**: < 16ms (CSS transitions)
- **Animation FPS**: 60fps target
- **Bundle Size**: ~2KB (component + styles)

### Browser Compatibility

- **Modern browsers**: Full support with backdrop-filter
- **Safari**: Requires `-webkit-backdrop-filter` prefix (included)
- **Firefox**: Full support (v103+)
- **Older browsers**: Graceful degradation with solid background

## Accessibility Features

### WCAG 2.1 Compliance

1. **Perceivable**:
   - Sufficient color contrast (4.5:1 minimum)
   - Text remains readable in all states
   - Visual focus indicator

2. **Operable**:
   - Keyboard accessible (Tab, Enter, Space)
   - Touch target size ≥ 44x44px
   - No time-based interactions required

3. **Understandable**:
   - Clear ARIA label
   - Predictable behavior
   - Consistent with site navigation

4. **Robust**:
   - Semantic HTML (anchor element)
   - ARIA attributes for enhanced context
   - Works with assistive technologies

### Screen Reader Support

```tsx
aria-label="Ivan Ivanov - Portfolio Home"
role="button"  // Indicates interactive element
tabIndex={0}   // Keyboard focusable
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .logo,
  .logoText {
    transition-duration: 0.1s;
  }

  .logo:hover {
    transform: none;
  }
}
```

## Design Decisions and Rationale

### 1. CSS-Only Animation vs JavaScript

**Decision**: Use CSS-only animation with `::after` pseudo-element

**Rationale**:

- Better performance (GPU-accelerated)
- Simpler implementation
- Fewer edge cases
- Automatic state management
- Reduced bundle size

### 2. Anchor Element vs Button

**Decision**: Use `<a>` element with `role="button"`

**Rationale**:

- Semantic navigation element
- Works without JavaScript
- Better SEO
- Maintains href for accessibility
- Keyboard navigation built-in

### 3. Touch Device Behavior

**Decision**: Toggle on tap with auto-collapse after 2s

**Rationale**:

- No hover state on touch devices
- Provides feedback for interaction
- Auto-collapse prevents stuck state
- Intuitive mobile UX

### 4. Letter Spacing vs Width Animation

**Decision**: Animate both width and letter-spacing

**Rationale**:

- Smoother visual transition
- More natural text expansion
- Better readability during animation
- Follows glassmorphism aesthetic

### 5. Frosted Glass Intensity

**Decision**: `blur(15px) saturate(180%)`

**Rationale**:

- Stronger than standard glass (10px)
- Matches "frosted" aesthetic from image
- Maintains readability
- Consistent with site's glass system
- Performance acceptable on modern devices

## Migration Plan

### Step 1: Create Component

- Implement FrostedGlassLogo component
- Add styles with glassmorphism effects
- Create index.ts export

### Step 2: Update Header

- Import FrostedGlassLogo
- Replace existing logo div
- Test responsive behavior

### Step 3: Verify Integration

- Check all breakpoints
- Test theme switching
- Verify accessibility
- Test on multiple browsers

### Step 4: Documentation

- Add README.md with usage examples
- Document props and behavior
- Include accessibility notes

## SVG Favicon Design

### Overview

Create a simplified SVG version of the "i i" logo for use as a favicon. The design should be recognizable at small sizes (16x16px to 48x48px) without the complex glassmorphism effects.

### SVG Structure

```svg
<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#baffe9;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7dd3fc;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background circle with subtle glow -->
  <circle cx="24" cy="24" r="22" fill="rgba(186, 255, 233, 0.1)"
          stroke="url(#logoGradient)" stroke-width="2"/>

  <!-- Left "i" -->
  <g id="left-i">
    <!-- Dot -->
    <circle cx="16" cy="14" r="2.5" fill="url(#logoGradient)"/>
    <!-- Stem -->
    <rect x="14" y="20" width="4" height="14" rx="2" fill="url(#logoGradient)"/>
  </g>

  <!-- Right "i" -->
  <g id="right-i">
    <!-- Dot -->
    <circle cx="32" cy="14" r="2.5" fill="url(#logoGradient)"/>
    <!-- Stem -->
    <rect x="30" y="20" width="4" height="14" rx="2" fill="url(#logoGradient)"/>
  </g>
</svg>
```

### Design Specifications

**Colors**:

- Primary gradient: `#baffe9` to `#7dd3fc` (cyan-mint gradient)
- Background: Transparent or subtle glow
- Stroke: 2px with gradient

**Dimensions**:

- Canvas: 48x48px (scales down to 16x16, 32x32)
- Letter height: 14px
- Dot radius: 2.5px
- Letter width: 4px
- Spacing between letters: 12px

**Simplifications**:

- No backdrop blur (not supported in SVG favicons)
- Solid gradient instead of glassmorphism
- Simple geometric shapes (circles and rounded rectangles)
- High contrast for visibility at small sizes

### File Locations

```
public/
├── favicon.svg           # Main SVG favicon
├── favicon.ico          # Generated ICO for legacy browsers
└── icons/
    ├── icon-16x16.png   # PNG fallback 16x16
    ├── icon-32x32.png   # PNG fallback 32x32
    └── icon-48x48.png   # PNG fallback 48x48
```

### Next.js Metadata Configuration

Update `src/app/layout.tsx`:

```tsx
export const metadata: Metadata = {
  title: 'Ivan Ivanov - Portfolio',
  description: 'Modern portfolio showcasing web development projects',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/icons/icon-48x48.png',
  },
};
```

### Alternative Dark/Light Theme Favicons

For theme-aware favicons (optional enhancement):

```html
<!-- In layout.tsx head -->
<link
  rel="icon"
  href="/favicon-light.svg"
  media="(prefers-color-scheme: light)"
/>
<link
  rel="icon"
  href="/favicon-dark.svg"
  media="(prefers-color-scheme: dark)"
/>
```

**Dark theme variant**: Lighter colors for visibility on dark browser UI
**Light theme variant**: Darker colors for visibility on light browser UI

### Generation Tools

To create PNG fallbacks from SVG:

```bash
# Using ImageMagick or similar tool
convert favicon.svg -resize 16x16 public/icons/icon-16x16.png
convert favicon.svg -resize 32x32 public/icons/icon-32x32.png
convert favicon.svg -resize 48x48 public/icons/icon-48x48.png

# Generate ICO file
convert public/icons/icon-16x16.png public/icons/icon-32x32.png public/favicon.ico
```

Or use online tools:

- https://realfavicongenerator.net/
- https://favicon.io/

### Testing Checklist

- [ ] SVG displays correctly in Chrome/Edge
- [ ] SVG displays correctly in Firefox
- [ ] SVG displays correctly in Safari
- [ ] ICO fallback works in older browsers
- [ ] Favicon visible in browser tab
- [ ] Favicon visible in bookmarks
- [ ] Favicon visible on mobile home screen
- [ ] Correct size at 16x16px
- [ ] Correct size at 32x32px
- [ ] Correct size at 48x48px

## Future Enhancements

Potential improvements for future iterations:

1. **Customizable Colors**: Accept color props for theming
2. **Animation Variants**: Different animation styles (slide, fade, etc.)
3. **Sound Effects**: Optional audio feedback on interaction
4. **Particle Effects**: Subtle particle animation on hover
5. **3D Transform**: Slight 3D rotation effect
6. **Glow Animation**: Pulsing glow effect around logo
7. **Custom Font**: Special font for logo text
8. **Animated SVG Favicon**: Subtle animation in browser tab (browser support limited)
