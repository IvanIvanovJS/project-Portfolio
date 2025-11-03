# UnifiedSwitcher Component

Unified glass-morphism switcher that combines theme selection (Light/Dark) and navigation mode toggle in a single elegant component.

## Features

- ✨ Glassmorphism design with layered shadows
- 🎨 3 options: Light theme, Dark theme, Navigation toggle
- 🎯 Only theme options are marked as "active" (with sliding indicator)
- 🔄 Navigation button toggles between horizontal/vertical modes
- 🎭 Dynamic icon for navigation (changes based on current mode)
- ⚡ Smooth animations
- ♿ Fully accessible
- 📱 Responsive design

## Design Philosophy

This component solves the problem of having multiple separate toggle buttons by combining them into one cohesive control:

1. **Light/Dark Theme** - Radio buttons with sliding indicator showing active theme
2. **Navigation Toggle** - Regular button that switches navigation mode without being "selected"

The navigation icon dynamically changes:

- Shows **LayoutGrid** icon when in horizontal mode (click to switch to vertical)
- Shows **Menu** icon when in vertical mode (click to switch to horizontal)

## Usage

### Basic Implementation

```tsx
import { UnifiedSwitcher } from '@/components/ui/unified-switcher';

function MyComponent() {
  return <UnifiedSwitcher />;
}
```

That's it! The component automatically connects to:

- `ThemeProvider` for theme management
- `NavigationProvider` for navigation mode management

### With Custom Styling

```tsx
<UnifiedSwitcher className="my-custom-class" />
```

## How It Works

### Theme Selection (Options 1 & 2)

- Uses radio inputs for Light/Dark
- Sliding indicator shows which theme is active
- Clicking changes the theme via `ThemeProvider`

### Navigation Toggle (Option 3)

- Uses a regular button (not a radio)
- No sliding indicator
- Icon changes based on current navigation mode
- Clicking toggles navigation mode via `NavigationProvider`

## Component Structure

```
┌─────────────────────────────────────┐
│  ☀️  Light  │  🌙  Dark  │  📱  Nav  │
│  [Active]   │           │  [Button] │
└─────────────────────────────────────┘
     ↑                         ↑
  Radio inputs            Regular button
  (with indicator)        (no indicator)
```

## Integration Points

### Used In:

- `Header.tsx` - Desktop horizontal navigation header
- `MobileHeader.tsx` - Mobile header
- `VerticalNavigation.tsx` - Vertical sidebar footer

### Providers:

- `ThemeProvider` - Manages light/dark theme state
- `NavigationProvider` - Manages horizontal/vertical navigation mode

## Styling

The component uses CSS modules with custom properties:

```css
--glass-bg: Background with transparency --fg-primary: Foreground/text color
  --bg-primary: Background for shadows --color-primary: Accent color for hover
  --saturation: Backdrop filter saturation;
```

## Accessibility

- ✅ Semantic HTML (fieldset, legend)
- ✅ Radio inputs for theme selection
- ✅ Button for navigation toggle
- ✅ ARIA labels for all controls
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Screen reader friendly

## Animation Details

### Sliding Indicator

- Animates between Light and Dark options only
- Uses `translate` for smooth movement
- Scale animation on transition
- Transform-origin based on direction

### Hover Effects

- Icon scales up on hover
- Color changes to accent color
- Smooth transitions

## Browser Support

- Modern browsers with CSS backdrop-filter
- Graceful degradation for older browsers
- Mobile-optimized touch targets

## Examples

### In Header

```tsx
<header>
  <Navigation items={items} />
  <UnifiedSwitcher />
</header>
```

### In Vertical Navigation Footer

```tsx
<aside>
  <nav>{/* navigation items */}</nav>
  <footer>
    <UnifiedSwitcher />
  </footer>
</aside>
```

## Comparison with Previous Approach

### Before (2 separate components):

```tsx
<NavigationToggle />
<ThemeToggle />
```

### After (1 unified component):

```tsx
<UnifiedSwitcher />
```

**Benefits:**

- Cleaner UI with single control
- Consistent glassmorphism design
- Less visual clutter
- Better mobile experience
- Unified interaction pattern
