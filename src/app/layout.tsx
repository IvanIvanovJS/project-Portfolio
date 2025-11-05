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
