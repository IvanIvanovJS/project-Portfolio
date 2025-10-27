# Navigation Component

A responsive navigation component with glassmorphism styling and active section highlighting.

## Props

- `items`: NavigationItem[] - Array of navigation items
- `activeSection`: string - Currently active section ID
- `isMobile`: boolean - Whether to render mobile version (default: false)

## NavigationItem Interface

```typescript
interface NavigationItem {
  id: string;
  label: string;
  href: string;
}
```

## Usage

```tsx
import { Navigation } from '@/components/layout/navigation/Navigation';

const navItems = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'projects', label: 'Projects', href: '#projects' },
];

<Navigation items={navItems} activeSection="home" />;
```
