# Design Document

## Overview

This design enhances the About Section by restructuring the layout into a balanced two-column grid, integrating professional SVG icons from Simple Icons, and simplifying the Experience section styling. The changes improve visual hierarchy, professional appearance, and content scanability while maintaining responsive behavior across all device sizes.

## Architecture

### Component Structure

```
AboutSection
├── Title (centered)
└── Content Grid (2 columns on desktop, 1 on mobile)
    ├── Left Column
    │   ├── Personal Info Card (no glass effect)
    │   └── Skills Section (glass card)
    └── Right Column
        ├── Image Carousel (sticky positioning)
        └── Experience Section (minimal styling)
```

### Layout Grid System

**Desktop Layout (>768px):**

```
┌─────────────────────────────────────────────────┐
│                   About Me                      │
├────────────────────────┬────────────────────────┤
│  Personal Info Card    │   Image Carousel       │
│  (transparent)         │   (sticky, glass)      │
├────────────────────────┼────────────────────────┤
│  Skills Section        │   Experience Section   │
│  (glass card)          │   (minimal, no glass)  │
└────────────────────────┴────────────────────────┘
```

**Mobile Layout (<768px):**

```
┌─────────────────────────┐
│      About Me           │
├─────────────────────────┤
│   Image Carousel        │
├─────────────────────────┤
│   Personal Info Card    │
├─────────────────────────┤
│   Skills Section        │
├─────────────────────────┤
│   Experience Section    │
└─────────────────────────┘
```

## Components and Interfaces

### 1. AboutSection Component Modifications

**Current Structure:**

- Single left column containing Personal Info, Skills, and Experience
- Right column with Image Carousel

**New Structure:**

- Two-column grid with equal widths
- Left column: Personal Info + Skills
- Right column: Image Carousel + Experience

**CSS Grid Changes:**

```css
.content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg, 3rem);
  align-items: start;
}

/* Left column remains as flex container */
.infoColumn {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md, 2rem);
}

/* Right column becomes flex container */
.carouselColumn {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md, 2rem);
  position: sticky;
  top: 100px;
}
```

### 2. Experience Section Styling

**Remove Glass Effect:**

- Remove `.glassCard` class from Experience container
- Create new `.experienceSection` class with minimal styling
- Remove hover effects and transitions
- Maintain timeline visual structure

**New CSS Class:**

```css
.experienceSection {
  /* No background, border, or glass effects */
  padding: 0;
}

.experienceSection .sectionHeading {
  /* Keep heading styles */
  margin-bottom: var(--spacing-md, 1.5rem);
}

/* Timeline styles remain unchanged */
.timeline {
  /* Existing timeline styles */
}
```

### 3. Skills Icon Integration

**Icon Component:**

```tsx
interface SkillIconProps {
  name: string;
  size?: number;
}

const SkillIcon: React.FC<SkillIconProps> = ({ name, size = 24 }) => {
  const iconPath = `/icons/skills/${name.toLowerCase()}.svg`;

  return (
    <img
      src={iconPath}
      alt={`${name} icon`}
      width={size}
      height={size}
      className={styles.skillIcon}
    />
  );
};
```

**Icon Mapping:**

```typescript
const SKILL_ICON_MAP: Record<string, string> = {
  React: 'react',
  TypeScript: 'typescript',
  'Node.js': 'nodedotjs',
  'Three.js': 'threedotjs',
  'CSS/SCSS': 'css3',
};
```

**Updated Skills Rendering:**

```tsx
<div className={styles.skillHeader}>
  <SkillIcon name={SKILL_ICON_MAP[skill.name] || skill.name} />
  <span className={styles.skillName}>{skill.name}</span>
  <span className={styles.skillLevel}>{skill.level}%</span>
</div>
```

### 4. Icon Fetcher Script

**New Script: `scripts/fetchSkillIcons.js`**

Purpose: Download specific SVG icons for skills section from Simple Icons CDN.

**Configuration:**

```javascript
const SKILL_ICONS = [
  { name: 'React', slug: 'react' },
  { name: 'TypeScript', slug: 'typescript' },
  { name: 'Node.js', slug: 'nodedotjs' },
  { name: 'Three.js', slug: 'threedotjs' },
  { name: 'CSS3', slug: 'css3' },
];

const OUTPUT_DIR = path.join(__dirname, '../public/icons/skills');
const SIMPLE_ICONS_CDN = 'https://cdn.simpleicons.org';
```

**Features:**

- Downloads only required skill icons
- Saves to `/public/icons/skills/` directory
- Retry logic with exponential backoff
- Error logging and progress reporting
- Graceful fallback handling

## Data Models

### Skill Interface Update

```typescript
interface Skill {
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'tools';
  icon?: string; // Optional: emoji fallback if SVG not available
  iconSlug?: string; // Simple Icons slug name
}
```

### Default Data Update

```typescript
const defaultData: AboutData = {
  // ... other fields
  skills: [
    {
      name: 'React',
      level: 95,
      category: 'frontend',
      iconSlug: 'react',
    },
    {
      name: 'TypeScript',
      level: 90,
      category: 'frontend',
      iconSlug: 'typescript',
    },
    {
      name: 'Node.js',
      level: 75,
      category: 'backend',
      iconSlug: 'nodedotjs',
    },
    {
      name: 'Three.js',
      level: 85,
      category: 'frontend',
      iconSlug: 'threedotjs',
    },
    {
      name: 'CSS/SCSS',
      level: 92,
      category: 'frontend',
      iconSlug: 'css3',
    },
  ],
};
```

## Error Handling

### Icon Loading Fallback

**Strategy:**

1. Attempt to load SVG icon from `/public/icons/skills/`
2. If SVG fails to load, display first letter of skill name in styled circle
3. Log error to console for debugging

**Implementation:**

```tsx
const SkillIcon: React.FC<SkillIconProps> = ({ name, size = 24 }) => {
  const [hasError, setHasError] = useState(false);
  const iconPath = `/icons/skills/${name.toLowerCase()}.svg`;

  if (hasError) {
    return (
      <div className={styles.skillIconFallback}>
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={iconPath}
      alt={`${name} icon`}
      width={size}
      height={size}
      className={styles.skillIcon}
      onError={() => setHasError(true)}
    />
  );
};
```

### Script Error Handling

**Icon Fetch Script:**

- Network errors: Retry with exponential backoff (3 attempts)
- 404 errors: Log missing icon and continue
- File system errors: Create directories if missing
- All errors logged to `logs/icon-fetch.log`

## Testing Strategy

### Visual Testing

1. **Layout Verification:**
   - Verify two-column layout on desktop (>768px)
   - Verify single-column stack on mobile (<768px)
   - Check Skills and Experience alignment
   - Verify carousel sticky positioning

2. **Icon Display:**
   - Verify all 5 skill icons load correctly
   - Test fallback behavior with missing icon
   - Check icon sizing and alignment
   - Verify icon colors match theme

3. **Experience Section:**
   - Verify no glass background
   - Verify no borders
   - Verify no hover effects
   - Verify timeline structure intact

### Responsive Testing

**Breakpoints:**

- Desktop: 1024px+ (full two-column layout)
- Tablet: 768px-1023px (adjusted spacing)
- Mobile: <768px (single column stack)

**Test Cases:**

- Carousel height matches personal info card on desktop
- Experience section flows naturally below carousel
- Skills section maintains readability at all sizes
- Icons scale appropriately on mobile

### Accessibility Testing

1. **Icon Accessibility:**
   - All icons have descriptive `alt` text
   - Fallback text is readable
   - Color contrast meets WCAG AA standards

2. **Keyboard Navigation:**
   - All interactive elements remain focusable
   - Focus indicators visible on all elements

3. **Screen Reader:**
   - Icon alt text announces correctly
   - Section headings properly structured
   - Timeline content flows logically

## Performance Considerations

### Icon Optimization

1. **SVG Optimization:**
   - Icons downloaded from Simple Icons are pre-optimized
   - Average size: 1-3KB per icon
   - Total payload: ~10KB for 5 icons

2. **Loading Strategy:**
   - Icons loaded as static assets from `/public`
   - Browser caching enabled
   - No runtime API calls

### Layout Performance

1. **CSS Grid:**
   - Hardware-accelerated layout
   - No JavaScript layout calculations
   - Efficient responsive behavior

2. **Sticky Positioning:**
   - Native CSS `position: sticky`
   - No scroll event listeners
   - Minimal reflow/repaint

## Migration Path

### Phase 1: Script Creation

1. Create `scripts/fetchSkillIcons.js`
2. Add skill icon configuration
3. Test icon download functionality

### Phase 2: Layout Restructuring

1. Update CSS grid structure
2. Move Experience section to right column
3. Remove glass effects from Experience
4. Test responsive behavior

### Phase 3: Icon Integration

1. Create SkillIcon component
2. Update Skills section rendering
3. Add fallback handling
4. Update default data with iconSlug

### Phase 4: Testing & Refinement

1. Visual testing across breakpoints
2. Accessibility audit
3. Performance verification
4. Final styling adjustments

## Design Decisions

### Why Two-Column Layout?

**Rationale:**

- Better visual balance between content types
- Improved scanability with related content grouped
- More efficient use of horizontal space on desktop
- Natural reading flow: personal info → skills, carousel → experience

### Why Remove Glass Effect from Experience?

**Rationale:**

- Reduces visual clutter with multiple glass cards
- Creates visual hierarchy: Skills (emphasized) vs Experience (supporting)
- Improves readability of timeline content
- Maintains focus on carousel as primary visual element

### Why Simple Icons?

**Rationale:**

- Industry-standard icon library with 2000+ brand icons
- Consistent design language across all icons
- Free and open-source (CC0 license)
- CDN-hosted with high availability
- SVG format for perfect scaling and small file size

### Why Sticky Carousel?

**Rationale:**

- Keeps visual interest visible while scrolling
- Balances long text content in left column
- Creates dynamic scrolling experience
- Maintains two-column visual structure
