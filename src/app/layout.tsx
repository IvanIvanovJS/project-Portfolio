import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '../providers/ThemeProvider';
import { ChakraProvider } from '../providers/ChakraProvider';

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
          <ChakraProvider>{children}</ChakraProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
