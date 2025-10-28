# GlassButton Component

A glassmorphism-styled button component with advanced hover effects, glow animations, and accessibility features.

## Features

- **Glassmorphism styling**: Blur effects, transparency, and glass-like appearance
- **Advanced animations**: Shimmer effects, glow animations, and letter spacing transitions
- **Multiple variants**: Primary, secondary, and CTA (call-to-action) styles
- **Size options**: Small, medium, and large sizes
- **Theme-aware**: Automatically adapts to light/dark themes
- **Fully accessible**: Keyboard navigation, focus indicators, and ARIA support
- **Responsive**: Optimized for mobile devices
- **Customizable**: Custom glow colors and styling options

## Usage

```tsx
import { GlassButton } from '@/components/ui/glass-button/GlassButton';

// Basic usage
<GlassButton onClick={() => console.log('Clicked!')}>
  Click Me
</GlassButton>

// With variants and sizes
<GlassButton variant="cta" size="lg" onClick={handleSubmit}>
  Get Started
</GlassButton>

// With custom glow color
<GlassButton
  variant="primary"
  glowColor="#ff6b6b"
  onClick={handleAction}
>
  Custom Glow
</GlassButton>

// Disabled state
<GlassButton disabled>
  Disabled Button
</GlassButton>
```

## Props

| Prop         | Type                                | Default     | Description                         |
| ------------ | ----------------------------------- | ----------- | ----------------------------------- |
| `children`   | `React.ReactNode`                   | -           | Button content (text, icons, etc.)  |
| `onClick`    | `() => void`                        | -           | Click handler function              |
| `variant`    | `'primary' \| 'secondary' \| 'cta'` | `'primary'` | Visual style variant                |
| `size`       | `'sm' \| 'md' \| 'lg'`              | `'md'`      | Button size                         |
| `glowColor`  | `string`                            | -           | Custom glow color (CSS color value) |
| `disabled`   | `boolean`                           | `false`     | Whether the button is disabled      |
| `className`  | `string`                            | `''`        | Additional CSS classes              |
| `type`       | `'button' \| 'submit' \| 'reset'`   | `'button'`  | HTML button type                    |
| `aria-label` | `string`                            | -           | Accessibility label                 |
| `tabIndex`   | `number`                            | -           | Tab order index                     |

## Variants

### Primary

- Default variant with theme-appropriate colors
- Subtle glow effect matching the theme's primary color
- Best for standard actions

### Secondary

- Muted colors using theme's secondary palette
- Less prominent than primary variant
- Suitable for secondary actions

### CTA (Call-to-Action)

- Enhanced visibility with primary color text and border
- Stronger glow effects and visual prominence
- Perfect for important actions like "Sign Up" or "Get Started"

## Sizes

### Small (`sm`)

- Padding: 8px 16px (mobile: 10px 18px)
- Min height: 36px (mobile: 40px)
- Font size: Small

### Medium (`md`)

- Padding: 12px 24px (mobile: 14px 26px)
- Min height: 44px (mobile: 48px)
- Font size: Base

### Large (`lg`)

- Padding: 16px 32px (mobile: 18px 34px)
- Min height: 52px (mobile: 56px)
- Font size: Large

## Animations

### Hover Effects

- **Letter spacing**: Expands from 1px to 3px on hover
- **Shimmer**: Animated light sweep across the button
- **Glow**: Expanding glow effect with custom colors
- **Transform**: Subtle upward movement (-2px)

### Focus Effects

- Visible focus ring for keyboard navigation
- Maintains all hover effects when focused

## Theming

The component automatically adapts to the current theme:

### Dark Theme

- Light text on dark glass background
- White-based shimmer and highlight effects
- Primary color: #baffe9 (mint green)

### Light Theme

- Dark text on light glass background
- Enhanced contrast and visibility
- Primary color: #ff8800 (orange)

## Accessibility

- **Keyboard navigation**: Full support for Enter and Space key activation
- **Focus indicators**: Visible focus rings with proper contrast
- **ARIA support**: Accepts aria-label and other ARIA attributes
- **Disabled state**: Proper disabled styling and behavior
- **Reduced motion**: Respects user's motion preferences
- **Screen readers**: Semantic button element with proper labeling

## Performance

- **CSS-only animations**: No JavaScript animations for better performance
- **Mobile optimizations**: Reduced blur effects on mobile devices
- **Efficient transitions**: Uses CSS transforms and opacity for smooth animations
- **Reduced motion support**: Disables animations for users who prefer minimal motion

## Browser Support

- Modern browsers with backdrop-filter support
- Graceful degradation for older browsers
- Mobile Safari and Chrome optimizations
- Webkit-specific prefixes included
