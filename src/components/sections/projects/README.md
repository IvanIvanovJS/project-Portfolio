# Projects Section

This section displays a gallery of portfolio projects with glassmorphism styling and interactive hover effects.

## Components

### ProjectsSection

The main container component that displays all projects in a responsive grid layout.

**Features:**

- Responsive grid layout that adapts to different screen sizes
- Category filtering (All, Web, Mobile, Desktop, API, Other)
- Loading and error states
- Smooth animations with Framer Motion
- Project count display

**Usage:**

```tsx
import { ProjectsSection } from '@/components/sections/projects/ProjectsSection';

<ProjectsSection />;
```

### ProjectCard

Individual project card component with glassmorphism effects.

**Features:**

- Glassmorphism styling based on reference CSS
- Animated hover effects with floating glass elements
- Project image with overlay
- Technology tags with custom colors
- Status badges (Completed, In Progress, Planned)
- Links to live demo and GitHub repository
- Responsive design for mobile devices

**Props:**

```typescript
interface ProjectCardProps {
  project: ProjectData;
  index: number; // Used for staggered animations
}
```

## Data Management

Project data is managed through utility functions in `@/utils/projectData.ts`:

- `getAllProjects()` - Get all projects
- `getProjectsByCategory(category)` - Filter by category
- `getProjectsByStatus(status)` - Filter by status
- `getProjectById(id)` - Get single project
- `getProjectCategories()` - Get all unique categories
- `searchProjects(searchTerm)` - Search projects

## Styling

The section uses CSS Modules with glassmorphism effects:

- **ProjectsSection.module.css** - Section layout and filtering UI
- **ProjectCard.module.css** - Card styling with glassmorphism effects

### Key Glassmorphism Features

- Backdrop blur effects
- Transparent backgrounds with RGBA colors
- Animated decorative elements on hover
- Floating glass effect animations
- Smooth transitions

## Customization

### Adding New Projects

Edit `src/utils/projectData.ts` and add new project objects to the `MOCK_PROJECTS` array:

```typescript
{
  id: 'unique-id',
  title: 'Project Title',
  description: 'Short description',
  longDescription: 'Detailed description',
  image: '/images/projects/project-image.jpg',
  technologies: [
    { name: 'React', color: '#61DAFB' },
    // ... more technologies
  ],
  category: 'web',
  status: 'completed',
  startDate: '2024-01-01',
  endDate: '2024-06-30',
  links: {
    live: 'https://example.com',
    github: 'https://github.com/username/repo',
  },
  features: ['Feature 1', 'Feature 2'],
}
```

### Modifying Glassmorphism Effects

Adjust the CSS custom properties in the module files:

- Background opacity: `rgba(255, 255, 255, 0.05)`
- Blur amount: `backdrop-filter: blur(10px)`
- Border opacity: `rgba(255, 255, 255, 0.1)`
- Shadow intensity: `box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1)`

## Accessibility

- Semantic HTML structure with proper heading hierarchy
- ARIA labels for links and buttons
- Keyboard navigation support
- Focus visible states
- Alt text for images
- Proper button states (aria-pressed)

## Performance

- Lazy loading for images
- Intersection Observer for scroll animations
- Optimized animations with Framer Motion
- Responsive images
- Efficient filtering with useMemo

## Requirements Covered

- **5.1**: Projects section layout with responsive grid
- **5.2**: ProjectCard with glassmorphism styling
- **5.3**: Hover effects with glassmorphism animations
- **5.4**: Project data management and filtering
- **5.5**: Proper semantic structure and responsive design
