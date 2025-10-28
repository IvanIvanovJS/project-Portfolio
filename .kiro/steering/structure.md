# Project Structure & Organization

## Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Home page component
├── components/            # Reusable React components
│   ├── layout/           # Layout-specific components
│   │   ├── header/       # Header components (Header, MobileHeader)
│   │   ├── navigation/   # Navigation components (Vertical, Mobile)
│   │   └── footer/       # Footer components
│   ├── sections/         # Page section components
│   │   ├── hero/         # Hero section
│   │   ├── about/        # About section
│   │   ├── projects/     # Projects showcase
│   │   └── contact/      # Contact section
│   └── ui/               # Base UI components
│       ├── glass-container/  # Glassmorphism containers
│       ├── glass-button/     # Glass-styled buttons
│       ├── theme-toggle/     # Theme switching component
│       └── navigation-toggle/ # Navigation mode toggle
├── hooks/                 # Custom React hooks
│   ├── useIntersectionObserver.ts
│   ├── useScrollSpy.ts   # Section tracking for navigation
│   └── useTheme.ts       # Theme management
├── providers/            # React Context providers
│   ├── ChakraProvider.tsx    # Chakra UI configuration
│   ├── NavigationProvider.tsx # Navigation state management
│   └── ThemeProvider.tsx     # Theme state management
├── styles/               # Global styles and themes
│   ├── glassmorphism.css     # Glassmorphism effect styles
│   └── themes.ts             # Theme definitions
├── types/                # TypeScript type definitions
│   ├── index.ts              # Common types
│   ├── project.ts            # Project-related types
│   └── theme.ts              # Theme-related types
└── utils/                # Utility functions
    ├── animations.ts         # Animation configurations
    └── constants.ts          # App constants
```

## Component Organization

### Naming Conventions

- **Components**: PascalCase (e.g., `VerticalNavigation.tsx`)
- **CSS Modules**: `ComponentName.module.css`
- **Hooks**: camelCase with `use` prefix (e.g., `useScrollSpy.ts`)
- **Types**: PascalCase interfaces/types (e.g., `NavigationItem`)
- **Constants**: UPPER_SNAKE_CASE for constants

### Component Structure

Each component follows this pattern:

```
ComponentName/
├── ComponentName.tsx          # Main component file
├── ComponentName.module.css   # Component-specific styles
├── index.ts                   # Export barrel (optional)
└── README.md                  # Component documentation (optional)
```

### File Organization Rules

1. **Layout Components**: Components that define page structure go in `src/components/layout/`
2. **UI Components**: Reusable, generic components go in `src/components/ui/`
3. **Section Components**: Page-specific sections go in `src/components/sections/`
4. **Provider Pattern**: All context providers are centralized in `src/providers/`
5. **Custom Hooks**: Business logic hooks are in `src/hooks/`
6. **Type Definitions**: Shared types are in `src/types/`

## Import Conventions

### Path Aliases

- Use `@/` for all imports from `src/` directory
- Example: `import { useNavigation } from '@/providers/NavigationProvider'`

### Import Order

1. React and Next.js imports
2. Third-party library imports
3. Internal component imports (using `@/`)
4. Relative imports
5. Type-only imports (with `type` keyword)

### Export Patterns

- Use named exports for components: `export const ComponentName`
- Use default exports for pages and layouts
- Create index files for barrel exports when needed

## CSS Architecture

### CSS Modules

- Each component has its own `.module.css` file
- Use semantic class names (`.navContainer`, `.activeLink`)
- Leverage CSS custom properties for theming

### Global Styles

- `app/globals.css`: CSS variables, reset styles, global utilities
- `src/styles/`: Theme definitions and shared style utilities

### Glassmorphism Patterns

- Consistent blur effects: `backdrop-filter: blur(10px-20px)`
- Transparency levels: `rgba(255, 255, 255, 0.05-0.1)`
- Border styling: `1px solid rgba(255, 255, 255, 0.1)`

## State Management

### Context Providers

- **NavigationProvider**: Navigation mode and state management
- **ThemeProvider**: Theme switching and persistence
- **ChakraProvider**: UI library configuration

### Local State

- Use `useState` for component-specific state
- Use `useEffect` for side effects and lifecycle management
- Custom hooks for reusable stateful logic

## Performance Patterns

- **Code Splitting**: Dynamic imports for heavy components
- **Memoization**: `React.memo` for expensive renders
- **Lazy Loading**: `React.lazy` for route-based splitting
- **CSS-in-JS Optimization**: Emotion with Chakra UI for runtime efficiency
