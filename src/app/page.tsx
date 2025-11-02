'use client';

import { HeroSection } from '../components/sections/hero/HeroSection';
import { ProjectsSection } from '../components/sections/projects/ProjectsSection';
import { AboutSection } from '../components/sections/about/AboutSection';
import { ContactSection } from '../components/sections/contact/ContactSection';

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* Projects Gallery Section */}
      <ProjectsSection />

      {/* About Section with Image Carousel */}
      <AboutSection />

      {/* Contact Section */}
      <ContactSection />
    </>
  );
}
