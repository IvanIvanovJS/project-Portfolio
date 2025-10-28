import { Theme, ThemeColors } from '../types/theme';

// Dark theme configuration
const darkThemeColors: ThemeColors = {
  background: '#171717',
  foreground: 'rgba(255, 255, 255, 0.8)',
  primary: '#baffe9',
  secondary: '#4a5568',
  accent: '#9f7aea',
};

// Light theme configuration
const lightThemeColors: ThemeColors = {
  background: '#fafafa',
  foreground: 'rgba(23, 23, 23, 0.8)',
  primary: '#ff8800',
  secondary: '#718096',
  accent: '#805ad5',
};

// Dark theme
export const darkTheme: Theme = {
  name: 'dark',
  colors: darkThemeColors,
  glassmorphism: {
    blur: 10,
    opacity: 0.05,
    borderOpacity: 0.1,
  },
};

// Light theme
export const lightTheme: Theme = {
  name: 'light',
  colors: lightThemeColors,
  glassmorphism: {
    blur: 10,
    opacity: 0.25,
    borderOpacity: 0.3,
  },
};

// Theme map for easy access
export const themes = {
  dark: darkTheme,
  light: lightTheme,
} as const;

// Chakra UI theme configuration (for components that still use Chakra)
export const portfolioTheme = {
  colors: {
    brand: {
      50: '#e6fff5',
      100: '#baffe9',
      200: '#8effdd',
      300: '#62ffd1',
      400: '#36ffc5',
      500: '#baffe9', // Primary color for dark theme
      600: '#00cc99',
      700: '#009973',
      800: '#00664d',
      900: '#003326',
    },
    orange: {
      50: '#fff5e6',
      100: '#ffe0b3',
      200: '#ffcc80',
      300: '#ffb74d',
      400: '#ffa31a',
      500: '#ff8800', // Primary color for light theme
      600: '#e67300',
      700: '#cc5e00',
      800: '#b34900',
      900: '#993400',
    },
  },
  breakpoints: {
    sm: '480px',
    md: '768px',
    lg: '992px',
    xl: '1280px',
    '2xl': '1536px',
  },
  fonts: {
    heading: `'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif`,
    body: `'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif`,
    mono: `'SF Mono', Monaco, monospace`,
  },
};

export default portfolioTheme;
