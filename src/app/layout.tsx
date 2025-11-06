import type { Metadata } from 'next';
import { IBM_Plex_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../providers/ThemeProvider';
import { ChakraProvider } from '../providers/ChakraProvider';
import { NavigationProvider } from '../providers/NavigationProvider';
import { LayoutWrapper } from '../components/layout/LayoutWrapper';

const ibmPlexSans = IBM_Plex_Sans({
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ibm-plex-sans',
});

export const metadata: Metadata = {
  title: 'Portfolio Site',
  description: 'A modern portfolio site with glassmorphism design',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={ibmPlexSans.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  try {
    // Default values
    const DEFAULT_THEME = 'dark';
    const DEFAULT_NAVIGATION = 'vertical';
    
    // Storage keys
    const THEME_KEY = 'portfolio-theme';
    const NAV_KEY = 'portfolio-navigation';
    
    // Read from localStorage or use defaults
    const savedTheme = localStorage.getItem(THEME_KEY);
    const savedNav = localStorage.getItem(NAV_KEY);
    
    // Validate values to prevent injection attacks
    const theme = (savedTheme === 'light' || savedTheme === 'dark') 
      ? savedTheme 
      : DEFAULT_THEME;
    const navigation = (savedNav === 'horizontal' || savedNav === 'vertical')
      ? savedNav
      : DEFAULT_NAVIGATION;
    
    // Apply to document immediately before first paint
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-navigation', navigation);
  } catch (e) {
    // Fallback to defaults if localStorage fails or is unavailable
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.setAttribute('data-navigation', 'vertical');
  }
})();
            `,
          }}
        />
      </head>
      <body className={ibmPlexSans.className}>
        <ThemeProvider>
          <ChakraProvider>
            <NavigationProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
            </NavigationProvider>
          </ChakraProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
