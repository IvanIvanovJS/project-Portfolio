# GlassContainer Component

A reusable glassmorphism container component with configurable properties and multiple variants.

## Features

- **Configurable glassmorphism effects**: Adjustable blur, highlight, glow, and specular intensity
- **Multiple variants**: Card, button, and panel styles
- **Theme-aware**: Automatically adapts to light/dark themes
- **Responsive**: Optimized for mobile devices
- **Accessible**: Supports reduced motion preferences

## Usage

```tsx
import { GlassContainer } from '@/components/ui/glass-container/GlassContainer';

// Basic usage
<GlassContainer>
  <p>Content goes here</p>
</GlassContainer>

// With custom properties
<GlassContainer
  variant="card"
  blur={15}
  highlightOpacity={0.3}
  className="custom-class"
>
  <div>Custom content</div>
</GlassContainer>
```

## Props

| Prop                | Type                            | Default  | Description                            |
| ------------------- | ------------------------------- | -------- | -------------------------------------- |
| `children`          | `React.ReactNode`               | -        | Content to render inside the container |
| `blur`              | `number`                        | `10`     | Backdrop blur intensity in pixels      |
| `highlightOpacity`  | `number`                        | `0.2`    | Opacity of the highlight effect        |
| `innerGlowOpacity`  | `number`                        | `0.1`    | Opacity of the inner glow effect       |
| `specularIntensity` | `number`                        | `0.3`    | Intensity of the specular reflection   |
| `className`         | `string`                        | `''`     | Additional CSS classes                 |
| `variant`           | `'card' \| 'button' \| 'panel'` | `'card'` | Visual variant of the container        |
| `style`             | `CSSProperties`                 | `{}`     | Additional inline styles               |

## Variants

### Card

- Default variant for content containers
- Includes padding and hover effects
- Best for displaying information or media

### Button

- Interactive variant with cursor pointer
- Enhanced hover and active states
- Suitable for clickable elements

### Panel

- Large container variant with enhanced blur
- More prominent borders and shadows
- Ideal for major sections or modals

## Theming

The component automatically adapts to the current theme:

- **Dark theme**: Lower opacity backgrounds, white highlights
- **Light theme**: Higher opacity backgrounds, enhanced contrast

## Accessibility

- Supports `prefers-reduced-motion` for users who prefer minimal animations
- Maintains proper contrast ratios across themes
- Keyboard navigation support when used as interactive elements
