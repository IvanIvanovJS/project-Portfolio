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
