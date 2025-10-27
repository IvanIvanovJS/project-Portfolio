# GlassButton Component

A glassmorphism-styled button component with hover effects and variants.

## Props

- `children`: React.ReactNode - Button content
- `onClick`: () => void - Click handler
- `variant`: 'primary' | 'secondary' | 'cta' - Button variant (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' - Button size (default: 'md')
- `glowColor`: string - Custom glow color
- `disabled`: boolean - Disabled state (default: false)
- `className`: string - Additional CSS classes

## Usage

```tsx
import { GlassButton } from '@/components/ui/glass-button/GlassButton';

<GlassButton variant="cta" size="lg" onClick={() => console.log('clicked')}>
  Get Started
</GlassButton>;
```
