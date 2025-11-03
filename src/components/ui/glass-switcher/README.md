# GlassSwitcher Component

A beautiful glass-morphism styled switcher component with smooth animations and multiple option support.

## Features

- ✨ Glassmorphism design with layered shadows and reflections
- 🎯 Supports 2 or 3 options
- 🎨 Icon or text labels
- ⚡ Smooth sliding animations
- ♿ Fully accessible with ARIA labels
- 📱 Responsive design

## Usage

### Basic Example (2 Options)

```tsx
import { GlassSwitcher, SwitcherOption } from '@/components/ui/glass-switcher';

const options: SwitcherOption[] = [
  {
    value: 'option1',
    label: 'Option 1',
    ariaLabel: 'Select option 1',
  },
  {
    value: 'option2',
    label: 'Option 2',
    ariaLabel: 'Select option 2',
  },
];

function MyComponent() {
  const [selected, setSelected] = useState('option1');

  return (
    <GlassSwitcher
      options={options}
      value={selected}
      onChange={setSelected}
      legend="Choose an option"
    />
  );
}
```

### With Icons (Theme Toggle Example)

```tsx
import { Sun, Moon } from 'lucide-react';
import { GlassSwitcher } from '@/components/ui/glass-switcher';

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
  onChange={setTheme}
  legend="Theme selector"
/>;
```

### Three Options Example

```tsx
const categoryOptions = [
  { value: 'all', label: 'All' },
  { value: 'web', label: 'Web' },
  { value: 'api', label: 'API' },
];

<GlassSwitcher
  options={categoryOptions}
  value={category}
  onChange={setCategory}
  legend="Category filter"
/>;
```

## Props

| Prop        | Type                      | Required | Default            | Description                          |
| ----------- | ------------------------- | -------- | ------------------ | ------------------------------------ |
| `options`   | `SwitcherOption[]`        | Yes      | -                  | Array of options to display          |
| `value`     | `string`                  | Yes      | -                  | Currently selected value             |
| `onChange`  | `(value: string) => void` | Yes      | -                  | Callback when selection changes      |
| `className` | `string`                  | No       | `''`               | Additional CSS classes               |
| `legend`    | `string`                  | No       | `'Switch options'` | Accessible legend for screen readers |

## SwitcherOption Interface

```typescript
interface SwitcherOption {
  value: string; // Unique identifier
  label: string; // Display text
  icon?: React.ReactNode; // Optional icon (replaces label when provided)
  ariaLabel?: string; // Optional ARIA label (defaults to label)
}
```

## Styling

The component uses CSS modules and CSS custom properties for theming:

- `--glass-bg`: Background color with transparency
- `--fg-primary`: Foreground/text color
- `--bg-primary`: Background for shadows
- `--color-primary`: Accent color for hover states
- `--saturation`: Backdrop filter saturation level

## Accessibility

- Uses semantic `<fieldset>` and `<legend>` elements
- Radio inputs with proper labels
- ARIA labels for screen readers
- Keyboard navigation support
- Focus indicators

## Animation

The component features smooth sliding animations when switching between options:

- Scale animation on the sliding indicator
- Hover scale effects on options
- Smooth color transitions

## Browser Support

- Modern browsers with CSS backdrop-filter support
- Graceful degradation for older browsers
