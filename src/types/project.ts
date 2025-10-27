export interface Technology {
  name: string;
  icon?: string;
  color?: string;
}

export type ProjectCategory = 'web' | 'mobile' | 'desktop' | 'api' | 'other';

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  gallery?: string[];
  technologies: Technology[];
  category: ProjectCategory;
  status: 'completed' | 'in-progress' | 'planned';
  startDate: string;
  endDate?: string;
  links: {
    live?: string;
    github?: string;
    demo?: string;
  };
  features: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
}
