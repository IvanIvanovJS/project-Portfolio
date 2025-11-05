# Technology Stack

## Framework & Core Technologies

- **Next.js 16.0.0**: React framework with App Router for server-side rendering and static generation
- **React 19.2.0**: Latest React with concurrent features and improved performance
- **TypeScript 5**: Strict type checking with path aliases (`@/*` → `./src/*`)
- **Node.js 18+**: Required runtime environment

## UI & Styling

- **Chakra UI 3.28.0**: Component library for consistent design system
- **Tailwind CSS 4**: Utility-first CSS framework for rapid styling
- **CSS Modules**: Component-scoped styling with `.module.css` files
- **Framer Motion 12.23.24**: Animation library for smooth transitions and interactions
- **Emotion**: CSS-in-JS for dynamic styling with Chakra UI

## 3D Graphics & Animation

- **Three.js 0.180.0**: 3D graphics library for WebGL rendering
- **@react-three/fiber 9.4.0**: React renderer for Three.js
- **@react-three/drei 10.7.6**: Useful helpers and abstractions for react-three-fiber

## Icons & Assets

- **Lucide React 0.548.0**: Modern icon library with consistent design

## Development Tools

- **ESLint 9**: Code linting with Next.js and Prettier configurations
- **Prettier 3.6.2**: Code formatting with consistent style rules
- **PostCSS**: CSS processing with Tailwind integration

## Common Commands

### Development

```bash
npm run dev          # Start development server with webpack
npm run build        # Build for production
npm run start        # Start production server
```

### Code Quality

```bash
npm run lint         # Check for linting errors
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run type-check   # Run TypeScript type checking
```

## Build Configuration

- **Webpack**: Custom webpack configuration enabled via `--webpack` flag
- **TypeScript**: Strict mode enabled with incremental compilation
- **Path Aliases**: `@/*` maps to `./src/*` for clean imports
- **CSS Processing**: PostCSS with Tailwind CSS integration

## Performance Considerations

- Server-side rendering with Next.js App Router
- Code splitting and lazy loading for optimal bundle sizes
- Image optimization with Next.js built-in features
- CSS-in-JS with runtime optimization via Emotion

## Image Optimization Rules

**MANDATORY: Always use Next.js `<Image />` component instead of HTML `<img>` tags**

### Why Next.js Image Component?

- Automatic image optimization and compression
- Lazy loading by default for better performance
- Responsive images with automatic srcset generation
- Prevents Cumulative Layout Shift (CLS)
- Better Core Web Vitals scores
- Optimized for images from `/public` folder

### Usage Examples

```tsx
import Image from 'next/image';

// For static images from /public folder
<Image
  src="/images/profile.jpg"
  alt="Profile photo"
  width={800}
  height={600}
  className={styles.image}
  priority={false} // Set to true for above-the-fold images
/>

// For dynamic images with object-fit
<Image
  src="/images/hero.jpg"
  alt="Hero image"
  fill
  className={styles.coverImage}
  style={{ objectFit: 'cover' }}
/>
```

### Configuration

Add to `next.config.js` for external images:

```js
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
    },
  ],
}
```

### Best Practices

1. **Always specify width and height** for static images to prevent layout shift
2. **Use `fill` prop** for images that need to fill their container (with `position: relative` parent)
3. **Set `priority={true}`** for above-the-fold images (hero sections, etc.)
4. **Use appropriate `sizes` prop** for responsive images
5. **Optimize source images** before adding to `/public` folder (recommended max 2000px width)
6. **Use WebP format** when possible for better compression
7. **Add descriptive `alt` text** for accessibility

### Common Patterns

```tsx
// Cover image in container
<div className={styles.imageContainer}>
  <Image
    src="/images/about/photo.jpg"
    alt="Description"
    fill
    style={{ objectFit: 'cover', objectPosition: 'center' }}
  />
</div>

// Responsive image with sizes
<Image
  src="/images/project.jpg"
  alt="Project screenshot"
  width={1200}
  height={800}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### Migration from `<img>` to `<Image>`

When you see `<img>` tags in the code, replace them with Next.js `<Image>` component following these steps:

1. Import Image component: `import Image from 'next/image'`
2. Replace `<img>` with `<Image>`
3. Add `width` and `height` props OR use `fill` prop
4. Keep `src`, `alt`, and `className` props
5. Add `style={{ objectFit: 'cover' }}` if needed for layout
