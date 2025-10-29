/**
 * Technology Icon Configuration
 *
 * This file defines the list of technologies to fetch icons for.
 * Icons are sourced from Simple Icons (simpleicons.org).
 *
 * Each technology includes:
 * - name: The Simple Icons slug (used for fetching)
 * - displayName: Human-readable name for display
 * - category: Technology category for organization
 * - color: Brand color from Simple Icons (optional, for future use)
 */

const technologies = [
  // Frontend Frameworks
  {
    name: 'react',
    displayName: 'React',
    category: 'framework',
    color: '#61DAFB',
  },
  {
    name: 'vuedotjs',
    displayName: 'Vue.js',
    category: 'framework',
    color: '#4FC08D',
  },
  {
    name: 'angular',
    displayName: 'Angular',
    category: 'framework',
    color: '#DD0031',
  },
  {
    name: 'svelte',
    displayName: 'Svelte',
    category: 'framework',
    color: '#FF3E00',
  },
  {
    name: 'nextdotjs',
    displayName: 'Next.js',
    category: 'framework',
    color: '#000000',
  },

  // Languages
  {
    name: 'typescript',
    displayName: 'TypeScript',
    category: 'language',
    color: '#3178C6',
  },
  {
    name: 'javascript',
    displayName: 'JavaScript',
    category: 'language',
    color: '#F7DF1E',
  },
  {
    name: 'html5',
    displayName: 'HTML5',
    category: 'language',
    color: '#E34F26',
  },
  {
    name: 'css3',
    displayName: 'CSS3',
    category: 'language',
    color: '#1572B6',
  },

  // Styling & UI
  {
    name: 'sass',
    displayName: 'Sass',
    category: 'tool',
    color: '#CC6699',
  },
  {
    name: 'tailwindcss',
    displayName: 'Tailwind CSS',
    category: 'tool',
    color: '#06B6D4',
  },
  {
    name: 'bootstrap',
    displayName: 'Bootstrap',
    category: 'tool',
    color: '#7952B3',
  },
  {
    name: 'mui',
    displayName: 'Material UI',
    category: 'tool',
    color: '#007FFF',
  },
  {
    name: 'chakraui',
    displayName: 'Chakra UI',
    category: 'tool',
    color: '#319795',
  },

  // Build Tools
  {
    name: 'webpack',
    displayName: 'Webpack',
    category: 'tool',
    color: '#8DD6F9',
  },
  {
    name: 'vite',
    displayName: 'Vite',
    category: 'tool',
    color: '#646CFF',
  },
  {
    name: 'rollup',
    displayName: 'Rollup',
    category: 'tool',
    color: '#EC4A3F',
  },
  {
    name: 'babel',
    displayName: 'Babel',
    category: 'tool',
    color: '#F9DC3E',
  },

  // Code Quality
  {
    name: 'eslint',
    displayName: 'ESLint',
    category: 'tool',
    color: '#4B32C3',
  },
  {
    name: 'prettier',
    displayName: 'Prettier',
    category: 'tool',
    color: '#F7B93E',
  },

  // Testing
  {
    name: 'jest',
    displayName: 'Jest',
    category: 'tool',
    color: '#C21325',
  },
  {
    name: 'vitest',
    displayName: 'Vitest',
    category: 'tool',
    color: '#6E9F18',
  },
  {
    name: 'cypress',
    displayName: 'Cypress',
    category: 'tool',
    color: '#17202C',
  },
  {
    name: 'playwright',
    displayName: 'Playwright',
    category: 'tool',
    color: '#2EAD33',
  },

  // Version Control & Platforms
  {
    name: 'git',
    displayName: 'Git',
    category: 'platform',
    color: '#F05032',
  },
  {
    name: 'github',
    displayName: 'GitHub',
    category: 'platform',
    color: '#181717',
  },
  {
    name: 'gitlab',
    displayName: 'GitLab',
    category: 'platform',
    color: '#FC6D26',
  },

  // DevOps & Containers
  {
    name: 'docker',
    displayName: 'Docker',
    category: 'platform',
    color: '#2496ED',
  },
  {
    name: 'kubernetes',
    displayName: 'Kubernetes',
    category: 'platform',
    color: '#326CE5',
  },

  // Runtime & Package Managers
  {
    name: 'nodedotjs',
    displayName: 'Node.js',
    category: 'platform',
    color: '#339933',
  },
  {
    name: 'npm',
    displayName: 'npm',
    category: 'tool',
    color: '#CB3837',
  },
  {
    name: 'yarn',
    displayName: 'Yarn',
    category: 'tool',
    color: '#2C8EBB',
  },
  {
    name: 'pnpm',
    displayName: 'pnpm',
    category: 'tool',
    color: '#F69220',
  },

  // Design & Documentation
  {
    name: 'figma',
    displayName: 'Figma',
    category: 'tool',
    color: '#F24E1E',
  },
  {
    name: 'storybook',
    displayName: 'Storybook',
    category: 'tool',
    color: '#FF4785',
  },

  // 3D & Animation
  {
    name: 'threedotjs',
    displayName: 'Three.js',
    category: 'tool',
    color: '#000000',
  },
];

module.exports = {
  technologies,
  getTechnologyNames: () => technologies.map((tech) => tech.name),
  getTechnologyByName: (name) =>
    technologies.find((tech) => tech.name === name),
  getTechnologiesByCategory: (category) =>
    technologies.filter((tech) => tech.category === category),
};
