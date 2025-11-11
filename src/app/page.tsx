'use client';

import dynamic from 'next/dynamic';
import { HeroSection } from '../components/sections/hero/HeroSection';

// Lazy load sections that are below the fold
const ProjectsSection = dynamic(
  () =>
    import('../components/sections/projects/ProjectsSection').then(
      (mod) => mod.ProjectsSection
    ),
  {
    loading: () => <div style={{ minHeight: '100vh' }} />,
    ssr: true,
  }
);

const AboutSection = dynamic(
  () =>
    import('../components/sections/about/AboutSection').then(
      (mod) => mod.AboutSection
    ),
  {
    loading: () => <div style={{ minHeight: '100vh' }} />,
    ssr: true,
  }
);

const ContactSection = dynamic(
  () =>
    import('../components/sections/contact/ContactSection').then(
      (mod) => mod.ContactSection
    ),
  {
    loading: () => <div style={{ minHeight: '100vh' }} />,
    ssr: true,
  }
);

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* About Section with Image Carousel */}
      <AboutSection />

      {/* Projects Gallery Section */}
      <ProjectsSection />

      {/* Contact Section */}
      <ContactSection />
    </>
  );
}
