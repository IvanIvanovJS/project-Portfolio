import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '../providers/ThemeProvider';
import { ChakraProvider } from '../providers/ChakraProvider';
import { NavigationProvider } from '../providers/NavigationProvider';
import { LayoutWrapper } from '../components/layout/LayoutWrapper';

export const metadata: Metadata = {
  title: 'Portfolio Site',
  description: 'A modern portfolio site with glassmorphism design',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
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
