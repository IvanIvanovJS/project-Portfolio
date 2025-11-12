import { Metadata } from 'next';

export const siteConfig = {
  name: 'Ivan Ivanov',
  title: 'Ivan Ivanov - Full Stack Developer & Creative Technologist',
  description:
    'Full-stack developer specializing in modern web technologies, React, Next.js, TypeScript, and 3D web experiences. Explore my portfolio of innovative projects with glassmorphism design.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://webmorphism.com',
  ogImage: '/images/og-image.jpg',
  keywords: [
    'Full Stack Developer',
    'Web Developer',
    'React Developer',
    'Next.js',
    'TypeScript',
    'Three.js',
    'Frontend Developer',
    'Backend Developer',
    'Portfolio',
    'Glassmorphism',
    'UI/UX Design',
    'JavaScript',
    'Node.js',
    'Web Development',
    'Creative Developer',
    'Software Engineer',
  ],
  author: {
    name: 'Ivan Ivanov',
    email: 'ivanov@webmorphism.com',
    url: 'https://webmorphism.com',
  },
  social: {
    github: 'https://github.com/IvanIvanovJS',
    linkedin: 'https://linkedin.com/in/ivan-webmorphism',
  },
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
  ],
  creator: siteConfig.author.name,
  publisher: siteConfig.author.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@ivanivanov',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  alternates: {
    canonical: siteConfig.url,
  },
};
