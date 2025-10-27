# About Section Components

Components for the about section with personal information and image carousel.

## AboutSection

Main container for the about section.

## ImageCarousel

Image carousel component with glassmorphism controls.

### Props

- `images`: CarouselImage[] - Array of images to display
- `autoPlay`: boolean - Enable automatic slideshow (default: true)
- `interval`: number - Slideshow interval in milliseconds (default: 5000)

### CarouselImage Interface

```typescript
interface CarouselImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}
```

## Usage

```tsx
import { AboutSection } from '@/components/sections/about/AboutSection';
import { ImageCarousel } from '@/components/sections/about/ImageCarousel';

const images = [
  { id: '1', src: '/image1.jpg', alt: 'Description 1' },
  { id: '2', src: '/image2.jpg', alt: 'Description 2' },
];

<ImageCarousel images={images} autoPlay={true} interval={3000} />;
```
