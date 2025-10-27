# HeroSection Component

The main hero section with title, subtitle, CTA button, and Three.js scene.

## Props

- `title`: string - Main title text
- `subtitle`: string - Subtitle text
- `ctaText`: string - Call-to-action button text
- `onCtaClick`: () => void - CTA button click handler

## Usage

```tsx
import { HeroSection } from '@/components/sections/hero/HeroSection';

<HeroSection
  title="Welcome to My Portfolio"
  subtitle="I'm a software engineer passionate about creating amazing experiences"
  ctaText="Get Started"
  onCtaClick={() => console.log('CTA clicked')}
/>;
```
