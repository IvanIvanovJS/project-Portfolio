import type { Metadata } from 'next';
import { IBM_Plex_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../providers/ThemeProvider';
import { ChakraProvider } from '../providers/ChakraProvider';
import { NavigationProvider } from '../providers/NavigationProvider';
import { LayoutWrapper } from '../components/layout/LayoutWrapper';
import { SplashScreen } from '../components/splash/SplashScreen';
import { defaultMetadata } from '../config/seo';
import { StructuredData } from '../components/seo/StructuredData';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const ibmPlexSans = IBM_Plex_Sans({
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ibm-plex-sans',
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={ibmPlexSans.variable} suppressHydrationWarning>
      <head>
        {/* Rubik Glitch Font for Splash Screen */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Rubik+Glitch&display=swap"
          rel="stylesheet"
        />
        <link rel="canonical" href="https://webmorphism.com" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  try {
    // Default values - MUST match DEFAULTS in src/utils/preferences.ts
    const DEFAULT_THEME = 'dark';
    const DEFAULT_NAVIGATION = 'vertical';
    
    // Storage keys - MUST match STORAGE_KEYS in src/utils/preferences.ts
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
        {/*
          FOUC Prevention Script
          
          This blocking script executes before the first paint to prevent Flash of
          Unstyled Content (FOUC) when loading user preferences.
          
          ## How It Works:
          
          1. Reads theme and navigation preferences from localStorage
          2. Validates values to prevent injection attacks
          3. Sets data-theme and data-navigation attributes on <html> element
          4. Falls back to defaults (dark theme, vertical nav) on any error
          
          ## Why Blocking?
          
          This script MUST execute synchronously before React hydration to ensure:
          - No visual flash when switching between themes
          - No layout shift when switching between navigation modes
          - Consistent initial render matching user preferences
          
          ## Coordination with React Providers:
          
          - ThemeProvider (src/providers/ThemeProvider.tsx) syncs with data-theme
          - NavigationProvider (src/providers/NavigationProvider.tsx) syncs with data-navigation
          - Both providers use the same storage keys and defaults
          
          ## Storage Keys:
          
          IMPORTANT: These keys must match STORAGE_KEYS in src/utils/preferences.ts
          - Theme: 'portfolio-theme'
          - Navigation: 'portfolio-navigation'
          
          ## Default Values:
          
          IMPORTANT: These defaults must match DEFAULTS in src/utils/preferences.ts
          - Theme: 'dark' (optimal for glassmorphism design)
          - Navigation: 'vertical' (better content focus)
          
          ## Error Handling:
          
          - localStorage unavailable: Uses defaults
          - Invalid stored values: Uses defaults
          - Any exception: Uses defaults and continues
        */}
      </head>
      <body className={ibmPlexSans.className} suppressHydrationWarning>
        <StructuredData type="person" />
        <ThemeProvider>
          <ChakraProvider>
            <NavigationProvider>
              {/* Splash screen OUTSIDE LayoutWrapper - covers everything */}
              <SplashScreen />

              {/* LayoutWrapper with navigation and content - loads normally */}
              <LayoutWrapper>{children}</LayoutWrapper>
            </NavigationProvider>
          </ChakraProvider>
        </ThemeProvider>
        {/* Vercel Analytics - placed outside providers to avoid hydration issues */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
