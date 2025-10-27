# Projects Section Components

Components for displaying project portfolio with glassmorphism styling.

## ProjectsSection

Main container for the projects section.

## ProjectCard

Individual project card component.

### Props

- `project`: Project - Project data object
- `index`: number - Card index for animations

### Project Interface

```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
}
```

## Usage

```tsx
import { ProjectsSection } from '@/components/sections/projects/ProjectsSection';
import { ProjectCard } from '@/components/sections/projects/ProjectCard';

const project = {
  id: '1',
  title: 'My Project',
  description: 'Project description',
  image: '/project-image.jpg',
  technologies: ['React', 'TypeScript'],
  liveUrl: 'https://example.com',
  githubUrl: 'https://github.com/user/repo',
};

<ProjectCard project={project} index={0} />;
```
