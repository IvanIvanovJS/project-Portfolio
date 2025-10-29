export const BREAKPOINTS = {
  sm: '480px',
  md: '768px',
  lg: '992px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const THEME_COLORS = {
  dark: {
    background: '#171717',
    foreground: 'rgba(255, 255, 255, 0.8)',
    primary: '#baffe9',
    secondary: '#4a5568',
    accent: '#9f7aea',
  },
  light: {
    background: '#fafafa',
    foreground: 'rgba(23, 23, 23, 0.8)',
    primary: '#ff8800',
    secondary: '#718096',
    accent: '#805ad5',
  },
} as const;

export const GLASSMORPHISM_VARIANTS = {
  card: {
    background: 'rgba(255, 255, 255, 0.05)',
    blur: 10,
    border: 'rgba(255, 255, 255, 0.1)',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  button: {
    background: 'rgba(255, 255, 255, 0.1)',
    blur: 15,
    border: 'rgba(255, 255, 255, 0.2)',
    shadow: 'rgba(0, 0, 0, 0.2)',
  },
  panel: {
    background: 'rgba(255, 255, 255, 0.03)',
    blur: 20,
    border: 'rgba(255, 255, 255, 0.1)',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
} as const;

export const NAVIGATION_ITEMS = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'contact', label: 'Contact', href: '#contact' },
] as const;
