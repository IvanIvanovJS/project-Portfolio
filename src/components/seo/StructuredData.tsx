import { siteConfig } from '@/config/seo';

interface StructuredDataProps {
  type?: 'website' | 'person' | 'portfolio';
}

export function StructuredData({ type = 'website' }: StructuredDataProps) {
  const personData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.author.name,
    url: siteConfig.url,
    email: siteConfig.author.email,
    jobTitle: 'Full Stack Developer',
    description: siteConfig.description,
    sameAs: [siteConfig.social.github, siteConfig.social.linkedin],
    knowsAbout: [
      'Web Development',
      'React',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Three.js',
      'Node.js',
      'Full Stack Development',
      'Frontend Development',
      'Backend Development',
    ],
  };

  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.title,
    url: siteConfig.url,
    description: siteConfig.description,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const portfolioData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: `${siteConfig.name} Portfolio`,
    description: siteConfig.description,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
    url: siteConfig.url,
    inLanguage: 'en',
  };

  let structuredData;
  switch (type) {
    case 'person':
      structuredData = personData;
      break;
    case 'portfolio':
      structuredData = portfolioData;
      break;
    default:
      structuredData = websiteData;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
