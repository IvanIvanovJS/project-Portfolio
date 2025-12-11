import { ProjectData } from '@/types/project';

/**
 * Mock project data for demonstration
 * This data can be replaced with API calls or CMS integration
 */
export const MOCK_PROJECTS: ProjectData[] = [
  {
    id: 'project-1',
    title: 'xArtify Art Platform',
    description:
      'Modern art marketplace and learning platform designed to connect artists with art enthusiasts worldwide.',
    longDescription:
      'xArtify is a comprehensive art marketplace and learning platform designed to connect artists with art enthusiasts worldwide. Built with modern web technologies, it provides a seamless experience for discovering, purchasing, and learning about art while empowering artists with professional tools to showcase and monetize their work.',
    image: 'xArtify-pricing',
    gallery: [
      '/images/projects/ecommerce-1.jpg',
      '/images/projects/ecommerce-2.jpg',
      '/images/projects/ecommerce-3.jpg',
    ],
    technologies: [
      { name: 'React', color: '#61DAFB' },
      { name: 'Next.js', color: '#000000' },
      { name: 'TypeScript', color: '#3178C6' },
      { name: 'Node.js', color: '#339933' },
      { name: 'PostgreSQL', color: '#4169E1' },
      { name: 'Stripe', color: '#008CDD' },
    ],
    category: 'web',
    status: 'completed',
    startDate: '2025-08-30',
    endDate: '',
    links: {
      live: 'https://xartify.com',
      github: 'https://github.com/IvanIvanovJS/xArtify-structure-preview',
    },
    features: [
      'Real-time inventory management',
      'Secure payment processing with Stripe',
      'Advanced search and filtering',
      'Responsive design for all devices',
      'Admin dashboard with analytics',
    ],
  },
  {
    id: 'project-2',
    title: 'Webmorphism Portfolio',
    description:
      'Portfolio website - Features interactive 3D elements, responsive design, and smooth animations',
    longDescription:
      'Portfolio website built with Next.js 14, TypeScript, and glassmorphism design. Features interactive 3D elements, responsive design, and smooth animations',
    image: 'Portfolio-HomeV2',
    gallery: [
      '/images/projects/taskmanager-1.jpg',
      '/images/projects/taskmanager-2.jpg',
    ],
    technologies: [
      { name: 'React', color: '#61DAFB' },
      { name: 'TypeScript', color: '#3178C6' },
      { name: 'Three.js', color: '#000' },
      { name: 'Chakra-UI', color: '#007FFF' },
      { name: 'Resend', color: '#000' },
    ],
    category: 'web',
    status: 'completed',
    startDate: '2025-10-27',
    endDate: '2025-11-12',
    links: {
      github: 'https://github.com/IvanIvanovJS/project-Portfolio',
    },
    features: [
      'Advanced 3D elements',
      'Custom made',
      'Mobile-responsive interface',
    ],
  },
  {
    id: 'project-3',
    title: 'Simple Express.js App ',
    description:
      'Web application for managing myths and legends, developed as a final exam project.',
    longDescription:
      ' Web application for managing myths and legends, developed as a final exam project',
    image: 'Myth-and-Legends-Banner',
    technologies: [
      { name: 'Node.js', color: '' },
      { name: 'JavaScript', color: '' },
      { name: 'Express.js', color: '' },
      { name: 'Handlebars', color: '' },
      { name: 'MongoDB', color: '' },
    ],
    category: 'api',
    status: 'completed',
    startDate: '2025-10-01',
    endDate: '2025-10-21',
    links: {
      github: 'https://github.com/IvanIvanovJS/Back-End-exam-oct-2025',
    },
    features: [
      'User registration and login',
      'JWT token-based authentication',
      'CRUD operations for myths and legends',
      'Dynamic views with Handlebars',
      'RESTful API endpoints',
    ],
  },
  {
    id: 'project-4',
    title: 'Kirka - AI Agent',
    description:
      'Visual AI Agent for creating websites, focusing on component-based design and an interactive AI assistant.',
    longDescription:
      'Built a flexible CMS specifically designed for portfolio websites, featuring a visual page builder, media management, and SEO optimization tools. Supports multiple themes and custom component creation.',
    image: 'Kirka-Landing',
    technologies: [
      { name: 'React', color: '' },
      { name: 'JavaScript', color: '' },
      { name: 'Vite', color: '' },
      { name: 'CSS', color: '' },
    ],
    category: 'web',
    status: 'completed',
    startDate: '2025-11-13',
    endDate: '2025-12-10',
    links: {github: 'https://github.com/IvanIvanovJS/Kirka-Coding-Agent',},
    features: [
      'Personalized AI assistant',
      'Component-based design',
      'Fast and robust template generator',
    ],
  },
];

/**
 * Get all projects
 */
export const getAllProjects = (): ProjectData[] => {
  return MOCK_PROJECTS;
};

/**
 * Get projects by category
 */
export const getProjectsByCategory = (
  category: ProjectData['category']
): ProjectData[] => {
  return MOCK_PROJECTS.filter((project) => project.category === category);
};

/**
 * Get projects by status
 */
export const getProjectsByStatus = (
  status: ProjectData['status']
): ProjectData[] => {
  return MOCK_PROJECTS.filter((project) => project.status === status);
};

/**
 * Get project by ID
 */
export const getProjectById = (id: string): ProjectData | undefined => {
  return MOCK_PROJECTS.find((project) => project.id === id);
};

/**
 * Get all unique categories
 */
export const getProjectCategories = (): ProjectData['category'][] => {
  const categories = new Set(MOCK_PROJECTS.map((project) => project.category));
  return Array.from(categories);
};

/**
 * Filter projects by search term
 */
export const searchProjects = (searchTerm: string): ProjectData[] => {
  const term = searchTerm.toLowerCase();
  return MOCK_PROJECTS.filter(
    (project) =>
      project.title.toLowerCase().includes(term) ||
      project.description.toLowerCase().includes(term) ||
      project.technologies.some((tech) =>
        tech.name.toLowerCase().includes(term)
      )
  );
};
