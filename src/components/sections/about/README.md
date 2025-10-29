# About Section

A comprehensive About section featuring personal information, skills visualization, experience timeline, and an interactive image carousel with glassmorphism styling.

## Components

### AboutSection

The main About section component that displays personal information, skills, experience, and an image carousel.

#### Props

```typescript
interface AboutSectionProps {
  data?: AboutData; // Optional custom data, uses default data if not provided
}
```

#### Features

- **Two-column responsive layout**: Personal info on left, carousel on right
- **Glassmorphism cards**: Beautiful glass-effect containers for content
- **Personal information display**: Name, title, bio, and contact details
- **Skills visualization**: Animated progress bars showing skill proficiency
- **Experience timeline**: Visual timeline with company, position, and technologies
- **Responsive design**: Stacks to single column on mobile devices
- **Smooth animations**: Framer Motion animations for scroll-triggered reveals

#### Usage

```tsx
import { AboutSection } from '@/components/sections/about/AboutSection';

// With default data
<AboutSection />

// With custom data
<AboutSection data={customAboutData} />
```

### ImageCarousel

An interactive image carousel with glassmorphism controls, automatic slideshow, and touch/swipe support.

#### Props

```typescript
interface ImageCarouselProps {
  images: CarouselImage[];
  autoPlay?: boolean; // Default: true
  interval?: number; // Default: 5000ms
}
```

#### Features

- **Automatic slideshow**: Auto-advances through images with configurable interval
- **Manual navigation**: Previous/Next buttons with glassmorphism styling
- **Touch/swipe support**: Swipe gestures for mobile devices
- **Keyboard navigation**: Arrow keys to navigate, spacebar to play/pause
- **Drag support**: Drag images to navigate
- **Progress indicators**: Dots showing current position
- **Play/pause control**: Toggle automatic slideshow
- **Image counter**: Shows current image number
- **Smooth transitions**: Framer Motion animations between slides
- **Responsive design**: Adapts to different screen sizes

#### Usage

```tsx
import { ImageCarousel } from '@/components/sections/about/ImageCarousel';

const images = [
  {
    id: '1',
    src: '/path/to/image1.jpg',
    alt: 'Description',
    caption: 'Optional caption',
  },
  { id: '2', src: '/path/to/image2.jpg', alt: 'Description' },
];

<ImageCarousel images={images} autoPlay={true} interval={5000} />;
```

## Data Structure

### AboutData

```typescript
interface AboutData {
  personalInfo: {
    name: string;
    title: string;
    bio: string;
    location: string;
    email: string;
    phone?: string;
  };
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  images: CarouselImage[];
}
```

### Skill

```typescript
interface Skill {
  name: string;
  level: number; // 1-100
  category: 'frontend' | 'backend' | 'tools' | 'soft';
  icon?: string; // Emoji or icon
}
```

### Experience

```typescript
interface Experience {
  company: string;
  position: string;
  startDate: string; // ISO date format
  endDate?: string; // ISO date format or undefined for current
  description: string;
  technologies: string[];
}
```

### CarouselImage

```typescript
interface CarouselImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}
```

## Styling

Both components use CSS Modules with glassmorphism effects:

- **Glass containers**: Transparent backgrounds with blur effects
- **Smooth animations**: Hover effects and transitions
- **Responsive typography**: Fluid font sizes using CSS clamp
- **Theme support**: Adapts to light/dark themes via CSS variables
- **Mobile optimization**: Touch-friendly controls and layouts

## Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus management
- Screen reader friendly
- Proper heading hierarchy

## Keyboard Shortcuts (Carousel)

- **Arrow Left**: Previous image
- **Arrow Right**: Next image
- **Spacebar**: Toggle play/pause

## Mobile Interactions

- **Swipe left/right**: Navigate between images
- **Tap indicators**: Jump to specific image
- **Tap play/pause**: Control slideshow
- **Touch-friendly buttons**: Larger touch targets
