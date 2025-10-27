# Portfolio Site Design Document

## Overview

Този документ описва архитектурата и дизайна на portfolio сайт с glassmorphism стил, използвайки Next.js 14 с App Router, TypeScript, Chakra UI, Framer Motion, Three.js и Lucide React. Сайтът ще бъде напълно responsive и оптимизиран за Vercel deployment.

## Architecture

### Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: Chakra UI v2
- **Animation**: Framer Motion
- **3D Graphics**: Three.js + @react-three/fiber + @react-three/drei
- **Icons**: Lucide React
- **Styling**: CSS Modules + Chakra UI
- **Deployment**: Vercel
- **Package Manager**: npm/yarn

### Project Structure

```
portfolio-site/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── loading.tsx
│   ├── components/                   # Reusable components
│   │   ├── ui/                      # Base UI components
│   │   │   ├── glass-container/
│   │   │   │   ├── GlassContainer.tsx
│   │   │   │   ├── GlassContainer.module.css
│   │   │   │   └── README.md
│   │   │   ├── glass-button/
│   │   │   │   ├── GlassButton.tsx
│   │   │   │   ├── GlassButton.module.css
│   │   │   │   └── README.md
│   │   │   └── theme-toggle/
│   │   │       ├── ThemeToggle.tsx
│   │   │       ├── ThemeToggle.module.css
│   │   │       └── README.md
│   │   ├── layout/                  # Layout components
│   │   │   ├── header/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Header.module.css
│   │   │   │   └── README.md
│   │   │   ├── navigation/
│   │   │   │   ├── Navigation.tsx
│   │   │   │   ├── Navigation.module.css
│   │   │   │   └── README.md
│   │   │   └── footer/
│   │   │       ├── Footer.tsx
│   │   │       ├── Footer.module.css
│   │   │       └── README.md
│   │   └── sections/                # Page sections
│   │       ├── hero/
│   │       │   ├── HeroSection.tsx
│   │       │   ├── HeroSection.module.css
│   │       │   ├── ThreeScene.tsx
│   │       │   └── README.md
│   │       ├── projects/
│   │       │   ├── ProjectsSection.tsx
│   │       │   ├── ProjectsSection.module.css
│   │       │   ├── ProjectCard.tsx
│   │       │   ├── ProjectCard.module.css
│   │       │   └── README.md
│   │       └── about/
│   │           ├── AboutSection.tsx
│   │           ├── AboutSection.module.css
│   │           ├── ImageCarousel.tsx
│   │           ├── ImageCarousel.module.css
│   │           └── README.md
│   ├── hooks/                       # Custom hooks
│   │   ├── useTheme.ts
│   │   ├── useScrollSpy.ts
│   │   └── useIntersectionObserver.ts
│   ├── providers/                   # Context providers
│   │   ├── ThemeProvider.tsx
│   │   └── ChakraProvider.tsx
│   ├── styles/                      # Global styles
│   │   ├── globals.css
│   │   ├── themes.ts
│   │   └── glassmorphism.css
│   ├── types/                       # TypeScript types
│   │   ├── theme.ts
│   │   ├── project.ts
│   │   └── index.ts
│   └── utils/                       # Utility functions
│       ├── constants.ts
│       └── animations.ts
├── public/                          # Static assets
│   ├── images/
│   │   ├── projects/
│   │   ├── about/
│   │   └── backgrounds/
│   └── models/                      # 3D models
└── package.json
```

## Components and Interfaces

### Core UI Components

#### GlassContainer Component
```typescript
interface GlassContainerProps {
  children: React.ReactNode;
  blur?: number;
  highlightOpacity?: number;
  innerGlowOpacity?: number;
  specularIntensity?: number;
  className?: string;
  variant?: 'card' | 'button' | 'panel';
}
```

#### GlassButton Component
```typescript
interface GlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'cta';
  size?: 'sm' | 'md' | 'lg';
  glowColor?: string;
  disabled?: boolean;
  className?: string;
}
```

#### ThemeToggle Component
```typescript
interface ThemeToggleProps {
  className?: string;
}
```

### Layout Components

#### Header Component
```typescript
interface HeaderProps {
  isScrolled: boolean;
}
```

#### Navigation Component
```typescript
interface NavigationItem {
  id: string;
  label: string;
  href: string;
}

interface NavigationProps {
  items: NavigationItem[];
  activeSection: string;
  isMobile?: boolean;
}
```

### Section Components

#### HeroSection Component
```typescript
interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  onCtaClick: () => void;
}
```

#### ThreeScene Component
```typescript
interface ThreeSceneProps {
  theme: 'light' | 'dark';
  isVisible: boolean;
}
```

#### ProjectCard Component
```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
}
```

#### ImageCarousel Component
```typescript
interface CarouselImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  autoPlay?: boolean;
  interval?: number;
}
```

## Data Models

### Theme Configuration
```typescript
interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  secondary?: string;
  accent?: string;
}

interface Theme {
  name: 'light' | 'dark';
  colors: ThemeColors;
  glassmorphism: {
    blur: number;
    opacity: number;
    borderOpacity: number;
  };
}
```

### Project Data Model
```typescript
interface ProjectData {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  gallery?: string[];
  technologies: Technology[];
  category: ProjectCategory;
  status: 'completed' | 'in-progress' | 'planned';
  startDate: string;
  endDate?: string;
  links: {
    live?: string;
    github?: string;
    demo?: string;
  };
  features: string[];
}

interface Technology {
  name: string;
  icon?: string;
  color?: string;
}

type ProjectCategory = 'web' | 'mobile' | 'desktop' | 'api' | 'other';
```

### About Data Model
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

interface Skill {
  name: string;
  level: number; // 1-100
  category: 'frontend' | 'backend' | 'tools' | 'soft';
  icon?: string;
}

interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies: string[];
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description?: string;
}
```

## Design System

### Color Schemes

#### CSS Custom Properties Structure
```css
:root {
  /* Typography */
  --font-family-primary: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-family-mono: 'SF Mono', Monaco, monospace;
  
  /* Responsive Font Sizes */
  --font-size-xs: clamp(0.7rem, 0.66rem + 0.2vw, 0.75rem);
  --font-size-sm: clamp(0.8rem, 0.75rem + 0.25vw, 0.875rem);
  --font-size-base: clamp(0.9rem, 0.85rem + 0.25vw, 1rem);
  --font-size-lg: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --font-size-xl: clamp(1.1rem, 1rem + 0.5vw, 1.25rem);
  --font-size-2xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  --font-size-3xl: clamp(1.5rem, 1.25rem + 1.25vw, 1.875rem);
  --font-size-4xl: clamp(1.75rem, 1.5rem + 1.25vw, 2.25rem);
  --font-size-5xl: clamp(2rem, 1.75rem + 1.25vw, 3rem);
  --font-size-6xl: clamp(2.5rem, 2rem + 2.5vw, 3.75rem);
  --font-size-7xl: clamp(3rem, 2.5rem + 2.5vw, 4.5rem);
  
  /* Line Heights */
  --line-height-tight: 1.25em;
  --line-height-snug: 1.375em;
  --line-height-normal: 1.5em;
  --line-height-relaxed: 1.625em;
  --line-height-loose: 2em;
  
  /* Letter Spacing */
  --letter-spacing-tighter: -0.05em;
  --letter-spacing-tight: -0.025em;
  --letter-spacing-normal: 0em;
  --letter-spacing-wide: 0.025em;
  --letter-spacing-wider: 0.05em;
  --letter-spacing-widest: 0.1em;
  
  /* Spacing */
  --spacing-1: 0.25em;
  --spacing-2: 0.5em;
  --spacing-3: 0.75em;
  --spacing-4: 1em;
  --spacing-5: 1.25em;
  --spacing-6: 1.5em;
  --spacing-8: 2em;
  --spacing-10: 2.5em;
  --spacing-12: 3em;
  --spacing-16: 4em;
  --spacing-20: 5em;
  
  /* Responsive Spacing */
  --spacing-xs: clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem);
  --spacing-sm: clamp(0.75rem, 0.6rem + 0.75vw, 1rem);
  --spacing-md: clamp(1rem, 0.8rem + 1vw, 1.5rem);
  --spacing-lg: clamp(1.5rem, 1.2rem + 1.5vw, 2.5rem);
  --spacing-xl: clamp(2rem, 1.5rem + 2.5vw, 4rem);
  --spacing-2xl: clamp(3rem, 2rem + 5vw, 6rem);
  --spacing-3xl: clamp(4rem, 3rem + 5vw, 8rem);
}
```

#### Dark Theme
```css
:root[data-theme="dark"] {
  /* Colors */
  --bg-primary: #171717;
  --fg-primary: rgba(255, 255, 255, 0.8);
  --color-primary: #baffe9;
  --color-secondary: #4a5568;
  --color-accent: #9f7aea;
  
  /* Glassmorphism */
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-highlight: rgba(255, 255, 255, 0.2);
  --glass-shadow: rgba(0, 0, 0, 0.3);
  
  /* Gradients */
  --gradient-primary: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  --gradient-glass: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
}
```

#### Light Theme
```css
:root[data-theme="light"] {
  /* Colors */
  --bg-primary: #fafafa;
  --fg-primary: rgba(23, 23, 23, 0.8);
  --color-primary: #ff8800;
  --color-secondary: #718096;
  --color-accent: #805ad5;
  
  /* Glassmorphism */
  --glass-bg: rgba(255, 255, 255, 0.25);
  --glass-border: rgba(255, 255, 255, 0.3);
  --glass-highlight: rgba(255, 255, 255, 0.4);
  --glass-shadow: rgba(0, 0, 0, 0.1);
  
  /* Gradients */
  --gradient-primary: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  --gradient-glass: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
}
```

### Glassmorphism Variants

#### Card Variant
- Background: `rgba(255, 255, 255, 0.05)`
- Backdrop Filter: `blur(10px)`
- Border: `1px solid rgba(255, 255, 255, 0.1)`
- Box Shadow: `0 8px 32px rgba(0, 0, 0, 0.1)`

#### Button Variant
- Background: `rgba(255, 255, 255, 0.1)`
- Backdrop Filter: `blur(15px)`
- Hover Effects: Glow animation
- Active States: Scale transform

#### Panel Variant
- Background: `rgba(255, 255, 255, 0.03)`
- Backdrop Filter: `blur(20px)`
- Enhanced borders and shadows

### Typography System

#### Font Families
```css
--font-family-primary: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
--font-family-mono: 'SF Mono', Monaco, monospace;
```

#### Responsive Typography Scale (using clamp for fluid scaling)
```css
--font-size-xs: clamp(0.7rem, 0.66rem + 0.2vw, 0.75rem);
--font-size-sm: clamp(0.8rem, 0.75rem + 0.25vw, 0.875rem);
--font-size-base: clamp(0.9rem, 0.85rem + 0.25vw, 1rem);
--font-size-lg: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
--font-size-xl: clamp(1.1rem, 1rem + 0.5vw, 1.25rem);
--font-size-2xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
--font-size-3xl: clamp(1.5rem, 1.25rem + 1.25vw, 1.875rem);
--font-size-4xl: clamp(1.75rem, 1.5rem + 1.25vw, 2.25rem);
--font-size-5xl: clamp(2rem, 1.75rem + 1.25vw, 3rem);
--font-size-6xl: clamp(2.5rem, 2rem + 2.5vw, 3.75rem);
--font-size-7xl: clamp(3rem, 2.5rem + 2.5vw, 4.5rem);
```

#### Line Heights (using em for relative scaling)
```css
--line-height-tight: 1.25em;
--line-height-snug: 1.375em;
--line-height-normal: 1.5em;
--line-height-relaxed: 1.625em;
--line-height-loose: 2em;
```

#### Letter Spacing (using em for relative scaling)
```css
--letter-spacing-tighter: -0.05em;
--letter-spacing-tight: -0.025em;
--letter-spacing-normal: 0em;
--letter-spacing-wide: 0.025em;
--letter-spacing-wider: 0.05em;
--letter-spacing-widest: 0.1em;
```

### Spacing System (using em for relative scaling)
```css
--spacing-1: 0.25em;
--spacing-2: 0.5em;
--spacing-3: 0.75em;
--spacing-4: 1em;
--spacing-5: 1.25em;
--spacing-6: 1.5em;
--spacing-8: 2em;
--spacing-10: 2.5em;
--spacing-12: 3em;
--spacing-16: 4em;
--spacing-20: 5em;
--spacing-24: 6em;
--spacing-32: 8em;
```

### Responsive Spacing (using clamp for fluid scaling)
```css
--spacing-xs: clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem);
--spacing-sm: clamp(0.75rem, 0.6rem + 0.75vw, 1rem);
--spacing-md: clamp(1rem, 0.8rem + 1vw, 1.5rem);
--spacing-lg: clamp(1.5rem, 1.2rem + 1.5vw, 2.5rem);
--spacing-xl: clamp(2rem, 1.5rem + 2.5vw, 4rem);
--spacing-2xl: clamp(3rem, 2rem + 5vw, 6rem);
--spacing-3xl: clamp(4rem, 3rem + 5vw, 8rem);
```

## Responsive Design

### Breakpoints
```typescript
const breakpoints = {
  sm: '480px',
  md: '768px',
  lg: '992px',
  xl: '1280px',
  '2xl': '1536px'
};
```

### Mobile-First Approach
- Base styles for mobile (320px+)
- Progressive enhancement for larger screens
- Touch-friendly interactions
- Optimized glassmorphism effects for performance

### Layout Adaptations

#### Mobile (< 768px)
- Single column layout
- Collapsible navigation
- Reduced glassmorphism complexity
- Touch-optimized button sizes
- Simplified Three.js scenes

#### Tablet (768px - 1024px)
- Two-column layouts where appropriate
- Enhanced glassmorphism effects
- Full Three.js capabilities
- Hover states enabled

#### Desktop (> 1024px)
- Multi-column layouts
- Full glassmorphism effects
- Complex animations
- Enhanced Three.js scenes

## Animation Strategy

### Framer Motion Variants
```typescript
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const glassHover = {
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 }
  }
};
```

### Three.js Scene Design
- Floating glassmorphism shapes
- Particle systems
- Interactive elements responding to mouse movement
- Smooth camera animations
- Performance-optimized rendering

## Error Handling

### Error Boundaries
- Component-level error boundaries
- Graceful fallbacks for Three.js scenes
- Image loading error handling
- Network request error handling

### Loading States
- Skeleton loaders for content
- Progressive image loading
- Three.js scene loading indicators
- Smooth transitions between states

## Testing Strategy

### Unit Testing
- Component rendering tests
- Hook functionality tests
- Utility function tests
- Theme switching tests

### Integration Testing
- Navigation flow tests
- Theme persistence tests
- Responsive behavior tests
- Animation completion tests

### Performance Testing
- Lighthouse audits
- Three.js performance monitoring
- Mobile performance optimization
- Bundle size analysis

### Accessibility Testing
- Screen reader compatibility
- Keyboard navigation
- Color contrast validation
- Focus management

## SEO and Performance

### Next.js Optimizations
- Static generation where possible
- Image optimization with next/image
- Font optimization
- Bundle splitting

### Meta Tags and Schema
- Dynamic meta tags per section
- Open Graph tags
- Twitter Card tags
- JSON-LD structured data

### Performance Targets
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

## Deployment Configuration

### Vercel Settings
- Environment variables for themes
- Build optimizations
- Edge functions for dynamic content
- Analytics integration

### Build Process
- TypeScript compilation
- CSS optimization
- Image optimization
- Bundle analysis