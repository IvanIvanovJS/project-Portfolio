export * from './theme';
export * from './project';

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
}

export interface CarouselImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

export interface Skill {
  name: string;
  level: number; // 1-100
  category: 'frontend' | 'backend' | 'tools' | 'soft';
  icon?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface AboutData {
  personalInfo: {
    name: string;
    title: string;
    bio: string;
    location: string;
    email: string;
    phone?: string;
  };
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  images: CarouselImage[];
}
