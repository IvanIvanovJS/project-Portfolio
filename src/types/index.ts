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
  subCaption?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies: string[];
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
  experience: Experience[];
  images: CarouselImage[];
}
