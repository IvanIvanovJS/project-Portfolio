import { ProjectData } from '@/types/project';

/**
 * Mock project data for demonstration
 * This data can be replaced with API calls or CMS integration
 */
export const MOCK_PROJECTS: ProjectData[] = [
  {
    id: 'project-1',
    title: 'E-Commerce Platform',
    description:
      'A modern e-commerce platform with real-time inventory management and seamless checkout experience.',
    longDescription:
      'Built a full-stack e-commerce solution featuring real-time inventory tracking, secure payment processing, and an intuitive admin dashboard. Implemented advanced search and filtering capabilities with optimized performance.',
    image: '/images/projects/ecommerce.jpg',
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
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    links: {
      live: 'https://example-ecommerce.com',
      github: 'https://github.com/username/ecommerce-platform',
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
    title: 'Task Management App',
    description:
      'Collaborative task management application with real-time updates and team collaboration features.',
    longDescription:
      'Developed a comprehensive task management solution with drag-and-drop functionality, real-time collaboration, and advanced project tracking. Features include Kanban boards, Gantt charts, and team analytics.',
    image: '/images/projects/taskmanager.jpg',
    gallery: [
      '/images/projects/taskmanager-1.jpg',
      '/images/projects/taskmanager-2.jpg',
    ],
    technologies: [
      { name: 'React', color: '#61DAFB' },
      { name: 'TypeScript', color: '#3178C6' },
      { name: 'Firebase', color: '#FFCA28' },
      { name: 'Material-UI', color: '#007FFF' },
      { name: 'Redux', color: '#764ABC' },
    ],
    category: 'web',
    status: 'completed',
    startDate: '2023-09-01',
    endDate: '2023-12-15',
    links: {
      live: 'https://example-taskmanager.com',
      github: 'https://github.com/username/task-manager',
      demo: 'https://demo.example-taskmanager.com',
    },
    features: [
      'Drag-and-drop Kanban boards',
      'Real-time collaboration',
      'Team analytics and reporting',
      'Custom workflows',
      'Mobile-responsive interface',
    ],
  },
  {
    id: 'project-3',
    title: 'Weather Dashboard',
    description:
      'Interactive weather dashboard with real-time data visualization and location-based forecasts.',
    longDescription:
      'Created an elegant weather dashboard featuring interactive maps, detailed forecasts, and historical weather data analysis. Integrated multiple weather APIs for accurate and comprehensive weather information.',
    image: '/images/projects/weather.jpg',
    technologies: [
      { name: 'React', color: '#61DAFB' },
      { name: 'TypeScript', color: '#3178C6' },
      { name: 'D3.js', color: '#F9A03C' },
      { name: 'OpenWeather API', color: '#EB6E4B' },
      { name: 'Tailwind CSS', color: '#06B6D4' },
    ],
    category: 'web',
    status: 'completed',
    startDate: '2023-06-01',
    endDate: '2023-08-30',
    links: {
      live: 'https://example-weather.com',
      github: 'https://github.com/username/weather-dashboard',
    },
    features: [
      'Real-time weather updates',
      'Interactive data visualizations',
      'Location-based forecasts',
      'Historical weather data',
      'Customizable dashboard widgets',
    ],
  },
  {
    id: 'project-4',
    title: 'Portfolio CMS',
    description:
      'Content management system for portfolio websites with drag-and-drop page builder.',
    longDescription:
      'Built a flexible CMS specifically designed for portfolio websites, featuring a visual page builder, media management, and SEO optimization tools. Supports multiple themes and custom component creation.',
    image: '/images/projects/cms.jpg',
    technologies: [
      { name: 'Next.js', color: '#000000' },
      { name: 'TypeScript', color: '#3178C6' },
      { name: 'MongoDB', color: '#47A248' },
      { name: 'GraphQL', color: '#E10098' },
      { name: 'AWS S3', color: '#FF9900' },
    ],
    category: 'web',
    status: 'in-progress',
    startDate: '2024-07-01',
    links: {
      github: 'https://github.com/username/portfolio-cms',
    },
    features: [
      'Visual drag-and-drop page builder',
      'Media library management',
      'SEO optimization tools',
      'Custom component system',
      'Multi-theme support',
    ],
  },
  {
    id: 'project-5',
    title: 'Fitness Tracker API',
    description:
      'RESTful API for fitness tracking applications with comprehensive workout and nutrition data.',
    longDescription:
      'Developed a robust API service for fitness applications, providing endpoints for workout tracking, nutrition logging, and progress analytics. Includes authentication, rate limiting, and comprehensive documentation.',
    image: '/images/projects/fitness-api.jpg',
    technologies: [
      { name: 'Node.js', color: '#339933' },
      { name: 'Express', color: '#000000' },
      { name: 'TypeScript', color: '#3178C6' },
      { name: 'PostgreSQL', color: '#4169E1' },
      { name: 'Redis', color: '#DC382D' },
      { name: 'Docker', color: '#2496ED' },
    ],
    category: 'api',
    status: 'completed',
    startDate: '2023-03-01',
    endDate: '2023-07-15',
    links: {
      github: 'https://github.com/username/fitness-tracker-api',
      demo: 'https://api-docs.example-fitness.com',
    },
    features: [
      'RESTful API architecture',
      'JWT authentication',
      'Rate limiting and caching',
      'Comprehensive API documentation',
      'Workout and nutrition tracking',
    ],
  },
  {
    id: 'project-6',
    title: 'Social Media Analytics',
    description:
      'Analytics dashboard for social media metrics with AI-powered insights and recommendations.',
    longDescription:
      'Created an advanced analytics platform that aggregates data from multiple social media platforms, providing actionable insights through machine learning algorithms and interactive visualizations.',
    image: '/images/projects/analytics.jpg',
    technologies: [
      { name: 'React', color: '#61DAFB' },
      { name: 'Python', color: '#3776AB' },
      { name: 'TensorFlow', color: '#FF6F00' },
      { name: 'PostgreSQL', color: '#4169E1' },
      { name: 'Chart.js', color: '#FF6384' },
    ],
    category: 'web',
    status: 'completed',
    startDate: '2023-10-01',
    endDate: '2024-02-28',
    links: {
      live: 'https://example-analytics.com',
    },
    features: [
      'Multi-platform data aggregation',
      'AI-powered insights',
      'Interactive data visualizations',
      'Custom report generation',
      'Automated recommendations',
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
