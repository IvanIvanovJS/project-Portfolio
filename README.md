# Portfolio Site

A modern portfolio website built with Next.js 14, TypeScript, and glassmorphism design. Features interactive 3D elements, responsive design, and smooth animations.

## 🚀 Features

- **Modern Tech Stack**: Next.js 14, TypeScript, Chakra UI, Framer Motion
- **Glassmorphism Design**: Beautiful glass-like UI components with blur effects
- **3D Graphics**: Interactive Three.js scenes and animations
- **Responsive Design**: Mobile-first approach with fluid layouts
- **Theme System**: Light/dark mode with smooth transitions
- **Performance Optimized**: Built for speed and Core Web Vitals
- **Accessibility**: WCAG compliant with keyboard navigation

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [Chakra UI](https://chakra-ui.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **3D Graphics**: [Three.js](https://threejs.org/) with [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: CSS Modules + Tailwind CSS
- **Linting**: ESLint + Prettier
- **Deployment**: [Vercel](https://vercel.com/)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher (comes with Node.js)
- **Git**: For version control

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd portfolio-site
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint to check for code issues |
| `npm run lint:fix` | Fix ESLint issues automatically |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check if code is properly formatted |
| `npm run type-check` | Run TypeScript type checking |

## 📁 Project Structure

```
portfolio-site/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── globals.css         # Global styles and CSS variables
│   │   ├── layout.tsx          # Root layout component
│   │   └── page.tsx            # Home page
│   ├── components/             # Reusable components
│   │   ├── ui/                 # Base UI components
│   │   │   ├── glass-container/
│   │   │   ├── glass-button/
│   │   │   └── theme-toggle/
│   │   ├── layout/             # Layout components
│   │   │   ├── header/
│   │   │   ├── navigation/
│   │   │   └── footer/
│   │   └── sections/           # Page sections
│   │       ├── hero/
│   │       ├── projects/
│   │       └── about/
│   ├── hooks/                  # Custom React hooks
│   ├── providers/              # Context providers
│   ├── styles/                 # Global styles and themes
│   ├── types/                  # TypeScript type definitions
│   └── utils/                  # Utility functions
├── public/                     # Static assets
├── .vscode/                    # VS Code configuration
└── package.json
```

## 🎨 Design System

### Color Schemes

#### Dark Theme (Default)
- **Background**: `#171717`
- **Foreground**: `rgba(255, 255, 255, 0.8)`
- **Primary**: `#baffe9`
- **Secondary**: `#4a5568`
- **Accent**: `#9f7aea`

#### Light Theme
- **Background**: `#fafafa`
- **Foreground**: `rgba(23, 23, 23, 0.8)`
- **Primary**: `#ff8800`
- **Secondary**: `#718096`
- **Accent**: `#805ad5`

### Typography

- **Primary Font**: IBM Plex Sans
- **Monospace Font**: SF Mono
- **Responsive Scaling**: Uses `clamp()` for fluid typography

### Glassmorphism Effects

- **Card Variant**: `blur(10px)` with subtle transparency
- **Button Variant**: `blur(15px)` with hover animations
- **Panel Variant**: `blur(20px)` for enhanced depth

## 🔧 Development Workflow

### Code Quality

1. **Linting**: ESLint with Next.js and TypeScript rules
2. **Formatting**: Prettier with consistent code style
3. **Type Safety**: Strict TypeScript configuration
4. **Git Hooks**: Pre-commit hooks for code quality (optional)

### Component Development

1. Create component in appropriate directory
2. Include TypeScript interfaces
3. Add CSS Module for styling
4. Write README.md with usage examples
5. Export from index files

### Styling Guidelines

1. Use CSS custom properties for theming
2. Implement mobile-first responsive design
3. Follow glassmorphism design patterns
4. Use semantic HTML elements
5. Ensure accessibility compliance

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables (if any)
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Coding Standards

- Use TypeScript for all new code
- Follow the existing component structure
- Write meaningful commit messages
- Add documentation for new features
- Ensure all tests pass before submitting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed description
3. Include steps to reproduce the problem

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Chakra UI](https://chakra-ui.com/) for the component library
- [Three.js](https://threejs.org/) for 3D graphics capabilities
- [Framer Motion](https://www.framer.com/motion/) for smooth animations