# Webmorphism Portfolio

A modern, interactive portfolio website showcasing glassmorphism design with cutting-edge web technologies. Features immersive 3D graphics, an innovative iPhone widget interface, and a fully functional contact system.

## ✨ Key Features

### 🎨 Design & UI

- **Liquid Glass Effects**: Advanced glassmorphism with layered shadows, backdrop filters, and animated gradients
- **Dual Navigation Modes**: Switch between horizontal header and vertical sidebar navigation
- **Theme System**: Seamless light/dark mode with FOUC prevention
- **Responsive Design**: Mobile-first approach with fluid layouts and touch-optimized interactions

### 🚀 Interactive Elements

- **3D Hero Scene**: Interactive Three.js sphere with tech icon tiles and explosion animations
- **iPhone Widget**: Fully functional iOS-style widget with working apps (Phone, Mail, Projects, GitHub, LinkedIn)
- **Image Carousel**: Auto-playing photo gallery with smooth transitions
- **Smooth Animations**: Framer Motion powered transitions and scroll-based reveals

### 📧 Contact System

- **Email Integration**: Resend API for reliable email delivery
- **Dual Forms**: Main contact form + iPhone Mail app integration
- **Security Features**: Rate limiting, honeypot protection, input sanitization
- **Auto-Reply**: Automated confirmation emails to visitors

### ⚡ Performance

- **Next.js 16**: Latest App Router with React 19 and Turbopack
- **Image Optimization**: Next.js Image component with WebP support
- **Code Splitting**: Dynamic imports for below-the-fold sections
- **SEO Optimized**: Structured data, meta tags, sitemap, and robots.txt

## 🛠️ Tech Stack

### Core Framework

- **[Next.js 16.0.0](https://nextjs.org/)** - React framework with App Router
- **[React 19.2.0](https://react.dev/)** - Latest React with concurrent features
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe development

### UI & Styling

- **[Chakra UI 3.28.0](https://chakra-ui.com/)** - Component library
- **[Framer Motion 12.23.24](https://www.framer.com/motion/)** - Animation library
- **[Lucide React 0.548.0](https://lucide.dev/)** - Icon library
- **CSS Modules** - Component-scoped styling
- **Emotion** - CSS-in-JS for dynamic styling

### 3D Graphics

- **[Three.js 0.180.0](https://threejs.org/)** - WebGL 3D library
- **[@react-three/fiber 9.4.0](https://docs.pmnd.rs/react-three-fiber)** - React renderer for Three.js
- **[@react-three/drei 10.7.6](https://github.com/pmndrs/drei)** - Useful helpers for react-three-fiber
- **[@use-gesture/react 10.3.1](https://use-gesture.netlify.app/)** - Touch and mouse gesture library

### Backend & Services

- **[Resend 6.4.2](https://resend.com/)** - Email API for contact forms
- **Next.js API Routes** - Server-side endpoints

### Development Tools

- **ESLint 9** - Code linting
- **Prettier 3.6.2** - Code formatting
- **PostCSS** - CSS processing with Autoprefixer

## 📋 Prerequisites

- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher
- **Git**: For version control

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/IvanIvanovJS/project-Portfolio.git
cd project-Portfolio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file and configure your variables:

```bash
cp .env.example .env
```

Then edit `.env` and add your configuration:

- **RESEND_API_KEY**: Get your API key from [Resend](https://resend.com/api-keys) for email functionality
- **NEXT_PUBLIC_SITE_URL**: Your production domain (e.g., `https://webmorphism.com`)
- **NEXT_PUBLIC_GOOGLE_VERIFICATION**: Google Search Console verification code (optional)

> **Note**: The contact form requires a valid Resend API key to function. You can skip this for development if you're not testing email functionality.

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📜 Available Scripts

| Script                 | Description                             |
| ---------------------- | --------------------------------------- |
| `npm run dev`          | Start development server with Turbopack |
| `npm run build`        | Build the application for production    |
| `npm run start`        | Start the production server             |
| `npm run lint`         | Run ESLint to check for code issues     |
| `npm run lint:fix`     | Fix ESLint issues automatically         |
| `npm run format`       | Format code with Prettier               |
| `npm run format:check` | Check if code is properly formatted     |
| `npm run type-check`   | Run TypeScript type checking            |

## 📁 Project Structure

```
portfolio-site/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API routes
│   │   │   └── contact/              # Contact form endpoint
│   │   ├── [...slug]/                # Dynamic catch-all route
│   │   ├── globals.css               # Global styles and CSS variables
│   │   ├── layout.tsx                # Root layout with providers
│   │   ├── page.tsx                  # Home page
│   │   ├── robots.ts                 # Robots.txt configuration
│   │   └── sitemap.ts                # Sitemap generation
│   ├── components/
│   │   ├── layout/                   # Layout components
│   │   │   ├── header/               # Header with navigation
│   │   │   ├── navigation/           # Vertical/horizontal navigation
│   │   │   ├── footer/               # Footer component
│   │   │   └── LayoutWrapper.tsx     # Main layout wrapper
│   │   ├── sections/                 # Page sections
│   │   │   ├── hero/                 # Hero with 3D scene
│   │   │   ├── about/                # About with carousel & iPhone widget
│   │   │   ├── projects/             # Projects showcase
│   │   │   └── contact/              # Contact form section
│   │   ├── seo/                      # SEO components
│   │   │   └── StructuredData.tsx    # JSON-LD structured data
│   │   └── ui/                       # Reusable UI components
│   │       ├── glass-container/      # Glassmorphism containers
│   │       ├── glass-button/         # Glass-styled buttons
│   │       ├── theme-toggle/         # Theme switcher
│   │       ├── navigation-toggle/    # Navigation mode toggle
│   │       ├── unified-switcher/     # Combined theme/nav switcher
│   │       ├── optimized-image/      # Next.js Image wrapper
│   │       └── frosted-glass-logo/   # Animated logo
│   ├── hooks/                        # Custom React hooks
│   │   ├── useIntersectionObserver.ts
│   │   ├── useScrollSpy.ts           # Section tracking
│   │   ├── useTheme.ts               # Theme management
│   │   └── useNavigation.ts          # Navigation state
│   ├── providers/                    # React Context providers
│   │   ├── ChakraProvider.tsx        # Chakra UI setup
│   │   ├── NavigationProvider.tsx    # Navigation state
│   │   └── ThemeProvider.tsx         # Theme state
│   ├── lib/                          # Server-side utilities
│   │   ├── email/                    # Email service
│   │   │   ├── emailService.ts       # Resend integration
│   │   │   └── templates.ts          # Email templates
│   │   ├── security/                 # Security utilities
│   │   │   └── rateLimiter.ts        # Rate limiting
│   │   └── validation/               # Input validation
│   │       └── contactValidation.ts  # Form validation
│   ├── config/                       # Configuration files
│   │   └── seo.ts                    # SEO metadata
│   ├── styles/                       # Global styles
│   │   ├── glassmorphism.css         # Glass effect styles
│   │   └── themes.ts                 # Theme definitions
│   ├── types/                        # TypeScript types
│   │   ├── index.ts                  # Common types
│   │   ├── project.ts                # Project types
│   │   └── theme.ts                  # Theme types
│   └── utils/                        # Utility functions
│       ├── animations.ts             # Animation configs
│       ├── constants.ts              # App constants
│       ├── preferences.ts            # User preferences
│       ├── projectData.ts            # Project data
│       └── scroll.ts                 # Scroll utilities
├── public/                           # Static assets
│   ├── images/                       # Image assets
│   └── icons/                        # Favicon and icons
├── .kiro/                            # Kiro IDE configuration
│   ├── settings/                     # IDE settings
│   ├── specs/                        # Feature specifications
│   └── steering/                     # Development guidelines
└── package.json
```

## 🎨 Design System

### Color Schemes

#### Dark Theme (Default)

- **Background**: `#171717` (Neutral dark)
- **Foreground**: `rgba(255, 255, 255, 0.8)` (High contrast text)
- **Primary**: `#baffe9` (Mint green accent)
- **Secondary**: `#4a5568` (Muted gray)
- **Accent**: `#9f7aea` (Purple highlight)

#### Light Theme

- **Background**: `#fafafa` (Off-white)
- **Foreground**: `rgba(23, 23, 23, 0.8)` (Dark text)
- **Primary**: `#ff8800` (Orange accent)
- **Secondary**: `#718096` (Medium gray)
- **Accent**: `#805ad5` (Purple highlight)

### Typography

- **Primary Font**: IBM Plex Sans (300, 400, 500, 600, 700)
- **Responsive Scaling**: Fluid typography with `clamp()`
- **Line Height**: 1.6 for body text, 1.2 for headings

### Glassmorphism Effects

All glass surfaces use the "liquid glass" effect:

```css
.glass-element {
  background: rgba(255, 255, 255, 0.05-0.15);
  backdrop-filter: blur(10px) saturate(180%);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.3),
    inset 0 -1px 1px rgba(0, 0, 0, 0.1),
    0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px-16px;
}
```

## 🔧 Development Workflow

### Code Quality Standards

1. **Type Safety**: Strict TypeScript with no implicit any
2. **Linting**: ESLint with Next.js and Prettier rules
3. **Formatting**: Prettier with consistent style
4. **Path Aliases**: Use `@/` for imports from `src/`

### Component Development

1. Create component in appropriate directory
2. Include TypeScript interfaces/types
3. Add CSS Module for styling (`.module.css`)
4. Follow glassmorphism design patterns
5. Ensure accessibility (ARIA labels, keyboard navigation)
6. Export from index files for clean imports

### Styling Guidelines

1. **CSS Custom Properties**: Use for theming and reusability
2. **Mobile-First**: Start with mobile styles, add desktop breakpoints
3. **Glassmorphism**: Follow liquid glass standards (see `.kiro/steering/glassmorphism.md`)
4. **Vendor Prefixes**: `-webkit-` prefix BEFORE standard property
5. **Semantic HTML**: Use appropriate HTML5 elements

### Performance Best Practices

1. **Image Optimization**: Always use Next.js `<Image>` component
2. **Code Splitting**: Dynamic imports for heavy components
3. **Lazy Loading**: Load below-the-fold sections on demand
4. **Memoization**: Use `React.memo` for expensive renders
5. **Backdrop Filter**: Use sparingly, limit blur radius

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to [Vercel](https://vercel.com)
2. Configure environment variables in Vercel dashboard:
   - `RESEND_API_KEY`
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_GOOGLE_VERIFICATION`
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Environment Variables

Ensure all required environment variables are set in your deployment platform:

```env
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_GOOGLE_VERIFICATION=your_verification_code
```

## 🔒 Security Features

- **Rate Limiting**: Prevents spam and abuse (3 requests per 15 minutes per IP)
- **Honeypot Protection**: Hidden field to catch bots
- **Input Sanitization**: Validates and sanitizes all user inputs
- **CSRF Protection**: Server-side validation
- **Environment Variables**: Sensitive data never exposed to client

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Coding Standards

- Use TypeScript for all new code
- Follow existing component structure
- Write meaningful commit messages
- Add documentation for new features
- Run `npm run type-check` and `npm run lint` before committing
- Ensure accessibility compliance

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - Amazing React framework
- [Chakra UI](https://chakra-ui.com/) - Excellent component library
- [Three.js](https://threejs.org/) - Powerful 3D graphics
- [Framer Motion](https://www.framer.com/motion/) - Smooth animations
- [Resend](https://resend.com/) - Reliable email API

## 📧 Contact

**Ivan Ivanov**

- Website: [webmorphism.com](https://webmorphism.com)
- Email: ivanov@webmorphism.com
- GitHub: [@IvanIvanovJS](https://github.com/IvanIvanovJS)
- LinkedIn: [ivan-webmorphism](https://linkedin.com/in/ivan-webmorphism)

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
