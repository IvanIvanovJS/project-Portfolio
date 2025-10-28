# Layout Components

This directory contains the main layout components for the portfolio site, including the header with navigation and footer.

## Components

### Header (`header/Header.tsx`)

The main header component with glassmorphism styling that includes:

- **Fixed positioning** with scroll-responsive background
- **Desktop navigation** with smooth scroll to sections
- **Mobile hamburger menu** with glassmorphism overlay
- **Active section highlighting** using scroll spy
- **Theme toggle integration**

#### Props

```typescript
interface HeaderProps {
  isScrolled?: boolean; // Optional prop to control scroll state externally
}
```

#### Features

- Automatic scroll detection (when `isScrolled` prop not provided)
- Smooth scrolling to page sections
- Mobile-responsive hamburger menu
- Active section highlighting based on scroll position
- Glassmorphism styling with blur effects

### Navigation (`navigation/Navigation.tsx`)

Reusable navigation component used in both desktop and mobile contexts:

#### Props

```typescript
interface NavigationProps {
  items: NavigationItem[];
  activeSection: string;
  isMobile?: boolean;
  onItemClick?: (href: string) => void;
}
```

#### Features

- Smooth scroll navigation
- Active section highlighting
- Mobile and desktop variants
- Glassmorphism hover effects
- Keyboard accessible

### Footer (`footer/Footer.tsx`)

Comprehensive footer with contact information and social links:

#### Features

- **Contact information** with email, phone, and location
- **Social media links** with hover animations
- **Quick navigation links** with smooth scrolling
- **Responsive grid layout**
- **Glassmorphism styling** consistent with site theme

## Usage

```tsx
import { Header } from './components/layout/header/Header';
import { Footer } from './components/layout/footer/Footer';

function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
```

## Styling

All components use CSS modules with glassmorphism effects:

- **Backdrop blur** for glass effect
- **Responsive design** with mobile-first approach
- **CSS custom properties** for theming
- **Smooth animations** and transitions
- **Accessibility** considerations

## Dependencies

- `lucide-react` for icons
- Custom hooks: `useScrollSpy`
- Theme system integration
- CSS custom properties for styling
