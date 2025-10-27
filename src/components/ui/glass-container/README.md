# GlassContainer Component

A reusable glassmorphism container component with configurable properties.

## Props

- `children`: React.ReactNode - Content to render inside the container
- `blur`: number - Blur intensity (default: 10)
- `highlightOpacity`: number - Highlight opacity (default: 0.2)
- `innerGlowOpacity`: number - Inner glow opacity (default: 0.1)
- `specularIntensity`: number - Specular intensity (default: 0.3)
- `className`: string - Additional CSS classes
- `variant`: 'card' | 'button' | 'panel' - Container variant (default: 'card')

## Usage

```tsx
import { GlassContainer } from '@/components/ui/glass-container/GlassContainer';

<GlassContainer variant="card">
  <p>Content goes here</p>
</GlassContainer>;
```
