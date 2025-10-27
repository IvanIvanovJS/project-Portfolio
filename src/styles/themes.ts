// Theme configuration for the portfolio
// This will be used with CSS custom properties instead of Chakra UI theme system

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
