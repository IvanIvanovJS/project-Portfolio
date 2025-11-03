# GlassSwitcher Examples

## Real-world implementations in the project

### 1. Theme Toggle (Light/Dark)

Located in: `src/components/ui/theme-toggle/ThemeToggle.tsx`

```tsx
import { Sun, Moon } from 'lucide-react';
import { GlassSwitcher } from '../glass-switcher';

const themeOptions = [
  {
    value: 'light',
    label: 'Light',
    icon: <Sun size={18} />,
    ariaLabel: 'Switch to light mode',
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: <Moon size={18} />,
    ariaLabel: 'Switch to dark mode',
  },
];

<GlassSwitcher
  options={themeOptions}
  value={theme}
  onChange={(value) => setTheme(value as 'light' | 'dark')}
  legend="Theme selector"
/>;
```

**Features:**

- 2 options with icons
- Integrated with ThemeProvider
- Persists to localStorage
- Smooth theme transitions

---

### 2. Navigation Mode Toggle (Horizontal/Vertical)

Located in: `src/components/ui/navigation-toggle/NavigationToggle.tsx`

```tsx
import { LayoutGrid, Menu } from 'lucide-react';
import { GlassSwitcher } from '../glass-switcher';

const navigationOptions = [
  {
    value: 'horizontal',
    label: 'Horizontal',
    icon: <Menu size={18} />,
    ariaLabel: 'Switch to horizontal navigation',
  },
  {
    value: 'vertical',
    label: 'Vertical',
    icon: <LayoutGrid size={18} />,
    ariaLabel: 'Switch to vertical navigation',
  },
];

<GlassSwitcher
  options={navigationOptions}
  value={navigationMode}
  onChange={(value) => setNavigationMode(value as NavigationMode)}
  legend="Navigation mode selector"
/>;
```

**Features:**

- 2 options with icons
- Integrated with NavigationProvider
- Automatically manages sidebar state
- Responsive behavior

---

### 3. Project Category Filter (All/Web/API)

Located in: `src/components/sections/projects/ProjectsSection.tsx`

```tsx
import { GlassSwitcher } from '@/components/ui/glass-switcher';

const categories = ['web', 'api']; // from getProjectCategories()

<GlassSwitcher
  options={[
    { value: 'all', label: 'All Projects' },
    ...categories.map((cat) => ({
      value: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
    })),
  ]}
  value={selectedCategory}
  onChange={handleCategoryChange}
  legend="Project category filter"
/>;
```

**Features:**

- 3 options with text labels
- Dynamic category generation
- Filters project list
- Loading states during transitions

---

## Custom Examples

### Simple Text Toggle

```tsx
const options = [
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: 'List' },
];

<GlassSwitcher options={options} value={viewMode} onChange={setViewMode} />;
```

### With Custom Styling

```tsx
<GlassSwitcher
  options={options}
  value={selected}
  onChange={setSelected}
  className="my-custom-class"
  legend="Custom switcher"
/>
```

### Three Options with Icons

```tsx
import { Sun, Moon, Sunset } from 'lucide-react';

const themeOptions = [
  { value: 'light', label: 'Light', icon: <Sun size={18} /> },
  { value: 'dark', label: 'Dark', icon: <Moon size={18} /> },
  { value: 'dim', label: 'Dim', icon: <Sunset size={18} /> },
];

<GlassSwitcher
  options={themeOptions}
  value={theme}
  onChange={setTheme}
  legend="Theme selector with 3 options"
/>;
```

---

## Styling Tips

### Adjusting Size

```css
.myCustomSwitcher {
  height: 60px;
  padding: 8px 12px;
}

.myCustomSwitcher .switcherOption {
  padding: 0 18px;
  min-width: 64px;
}
```

### Custom Colors

```css
:root {
  --glass-bg: rgba(255, 255, 255, 0.12);
  --fg-primary: rgba(255, 255, 255, 0.9);
  --color-primary: #baffe9;
  --saturation: 150%;
}
```

### Dark Mode Adjustments

```css
[data-theme='dark'] {
  --glass-bg: rgba(255, 255, 255, 0.08);
  --fg-primary: rgba(255, 255, 255, 0.95);
}
```

---

## Best Practices

1. **Use 2-3 options max** - More options make the component too wide
2. **Provide clear labels** - Users should understand what each option does
3. **Use icons for common actions** - Theme, view mode, etc.
4. **Add ARIA labels** - Improve accessibility for screen readers
5. **Keep legend descriptive** - Helps screen reader users understand context
6. **Test on mobile** - Ensure touch targets are large enough
7. **Consider loading states** - Show feedback when changing options triggers async actions

---

## Accessibility Checklist

- ✅ Uses semantic HTML (fieldset, legend, radio inputs)
- ✅ Provides ARIA labels for each option
- ✅ Keyboard navigable (Tab, Arrow keys, Space/Enter)
- ✅ Focus indicators visible
- ✅ Screen reader friendly
- ✅ Touch targets meet minimum size (48x48px)
- ✅ Color contrast meets WCAG AA standards
