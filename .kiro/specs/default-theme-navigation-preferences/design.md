# Design Document

## Overview

This design implements a robust preference management system that ensures the portfolio website loads with dark theme and vertical navigation as defaults for new visitors, while seamlessly remembering and applying user preferences on subsequent visits. The solution prevents FOUC (Flash of Unstyled Content) by using a blocking inline script in the HTML head to apply preferences before the first paint.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    HTML Document                         │
│  ┌────────────────────────────────────────────────────┐ │
│  │  <head>                                            │ │
│  │    <script> (blocking - reads localStorage)       │ │
│  │      - Sets data-theme attribute                  │ │
│  │      - Sets data-navigation attribute             │ │
│  │      - Defaults: dark + vertical                  │ │
│  │    </script>                                       │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │  <body>                                            │ │
│  │    React Hydration                                 │ │
│  │      ↓                                             │ │
│  │    ThemeProvider (syncs with data-theme)          │ │
│  │    NavigationProvider (syncs with data-navigation)│ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

```
User Visits Site
      ↓
Blocking Script Executes (before paint)
      ↓
Read localStorage
      ↓
Apply Preferences or Defaults
      ↓
Set HTML Attributes
      ↓
CSS Applies Correct Styles
      ↓
React Hydrates
      ↓
Providers Sync with HTML Attributes
      ↓
User Interacts
      ↓
Provider Updates State
      ↓
Save to localStorage
      ↓
Update HTML Attributes
```

## Components and Interfaces

### 1. Inline Blocking Script

**Location:** `src/app/layout.tsx` (injected in `<head>`)

**Purpose:** Execute before first paint to prevent FOUC

**Implementation:**

```typescript
// Inline script to be injected in <head>
const preloadScript = `
(function() {
  try {
    // Default values
    const DEFAULT_THEME = 'dark';
    const DEFAULT_NAVIGATION = 'vertical';
    
    // Storage keys
    const THEME_KEY = 'portfolio-theme';
    const NAV_KEY = 'portfolio-navigation';
    
    // Read from localStorage or use defaults
    const savedTheme = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
    const savedNav = localStorage.getItem(NAV_KEY) || DEFAULT_NAVIGATION;
    
    // Validate values
    const theme = (savedTheme === 'light' || savedTheme === 'dark') 
      ? savedTheme 
      : DEFAULT_THEME;
    const navigation = (savedNav === 'horizontal' || savedNav === 'vertical')
      ? savedNav
      : DEFAULT_NAVIGATION;
    
    // Apply to document immediately
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-navigation', navigation);
  } catch (e) {
    // Fallback to defaults if localStorage fails
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.setAttribute('data-navigation', 'vertical');
  }
})();
`;
```

**Key Design Decisions:**

- Uses IIFE (Immediately Invoked Function Expression) to avoid polluting global scope
- Validates localStorage values to prevent injection attacks
- Graceful fallback to defaults on any error
- Synchronous execution blocks rendering until complete
- Minimal code size for fast execution

### 2. Updated ThemeProvider

**Location:** `src/providers/ThemeProvider.tsx`

**Changes:**

1. Remove system preference detection (`prefers-color-scheme`)
2. Default to 'dark' theme
3. Sync with `data-theme` attribute on mount
4. Update storage key to match blocking script

**Interface:**

```typescript
interface ThemeContextType {
  theme: ThemeMode; // 'light' | 'dark'
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  isLoading: boolean; // false after hydration
}
```

**Implementation Strategy:**

```typescript
// On mount (client-side only)
useEffect(() => {
  // Read from HTML attribute (set by blocking script)
  const htmlTheme = document.documentElement.getAttribute('data-theme');
  const initialTheme =
    htmlTheme === 'light' || htmlTheme === 'dark' ? htmlTheme : 'dark';

  setThemeState(initialTheme);
  setIsLoading(false);
}, []);

// On theme change
useEffect(() => {
  if (!isLoading) {
    // Update HTML attribute
    document.documentElement.setAttribute('data-theme', theme);

    // Persist to localStorage
    try {
      localStorage.setItem('portfolio-theme', theme);
    } catch (e) {
      console.warn('Failed to save theme preference');
    }
  }
}, [theme, isLoading]);
```

### 3. Updated NavigationProvider

**Location:** `src/providers/NavigationProvider.tsx`

**Changes:**

1. Default to 'vertical' navigation mode
2. Sync with `data-navigation` attribute on mount
3. Update storage key to match blocking script
4. Maintain existing responsive behavior

**Interface:**

```typescript
interface NavigationContextType {
  navigationMode: NavigationMode; // 'horizontal' | 'vertical'
  isVerticalNavOpen: boolean;
  toggleNavigationMode: () => void;
  toggleVerticalNav: () => void;
  setVerticalNavOpen: (open: boolean) => void;
  setNavigationMode: (mode: NavigationMode) => void;
}
```

**Implementation Strategy:**

```typescript
// On mount (client-side only)
useEffect(() => {
  // Read from HTML attribute (set by blocking script)
  const htmlNav = document.documentElement.getAttribute('data-navigation');
  const initialMode =
    htmlNav === 'horizontal' || htmlNav === 'vertical' ? htmlNav : 'vertical';

  setNavigationMode(initialMode);

  // Set vertical nav open state based on screen size
  if (initialMode === 'vertical' && window.innerWidth >= 769) {
    setIsVerticalNavOpen(true);
  }

  setIsHydrated(true);
}, []);

// On navigation mode change
useEffect(() => {
  if (isHydrated) {
    // Update HTML attribute
    document.documentElement.setAttribute('data-navigation', navigationMode);

    // Persist to localStorage
    try {
      localStorage.setItem('portfolio-navigation', navigationMode);
    } catch (e) {
      console.warn('Failed to save navigation preference');
    }
  }
}, [navigationMode, isHydrated]);
```

### 4. CSS Updates

**Location:** `src/app/globals.css`

**Purpose:** Ensure CSS respects HTML attributes set by blocking script

**Implementation:**

```css
/* Theme-based CSS variables */
:root[data-theme='light'] {
  /* Light theme variables */
}

:root[data-theme='dark'] {
  /* Dark theme variables */
}

/* Navigation-based layout adjustments */
:root[data-navigation='horizontal'] {
  /* Horizontal navigation styles */
}

:root[data-navigation='vertical'] {
  /* Vertical navigation styles */
}
```

## Data Models

### Storage Keys

```typescript
const STORAGE_KEYS = {
  THEME: 'portfolio-theme',
  NAVIGATION: 'portfolio-navigation',
} as const;
```

### Theme Type

```typescript
type ThemeMode = 'light' | 'dark';
```

### Navigation Type

```typescript
type NavigationMode = 'horizontal' | 'vertical';
```

### Default Values

```typescript
const DEFAULTS = {
  THEME: 'dark' as ThemeMode,
  NAVIGATION: 'vertical' as NavigationMode,
} as const;
```

## Error Handling

### localStorage Unavailable

**Scenario:** User has disabled localStorage or browser doesn't support it

**Handling:**

1. Blocking script catches error and applies defaults
2. Providers catch errors when reading/writing
3. Application continues to function with in-memory state
4. Preferences reset on page reload

### Invalid Stored Values

**Scenario:** localStorage contains corrupted or invalid data

**Handling:**

1. Validate values against allowed types
2. Fall back to defaults if validation fails
3. Overwrite invalid values with defaults

### Hydration Mismatch

**Scenario:** Server-rendered HTML doesn't match client state

**Handling:**

1. Blocking script ensures HTML attributes are set before React hydration
2. Providers read from HTML attributes (single source of truth)
3. No server-side rendering of theme/navigation state
4. Prevents React hydration warnings

## Testing Strategy

### Unit Tests

**ThemeProvider Tests:**

1. Initializes with dark theme by default
2. Reads theme from HTML attribute on mount
3. Updates HTML attribute when theme changes
4. Persists theme to localStorage
5. Handles localStorage errors gracefully
6. Validates theme values

**NavigationProvider Tests:**

1. Initializes with vertical navigation by default
2. Reads navigation mode from HTML attribute on mount
3. Updates HTML attribute when mode changes
4. Persists mode to localStorage
5. Handles localStorage errors gracefully
6. Validates navigation mode values
7. Manages vertical nav open state correctly

### Integration Tests

1. First-time visitor sees dark theme and vertical navigation
2. User changes theme, preference is saved and persists on reload
3. User changes navigation mode, preference is saved and persists on reload
4. No FOUC occurs during page load
5. Preferences work correctly with localStorage disabled

### Visual Regression Tests

1. Page loads with correct theme (no flash)
2. Page loads with correct navigation layout (no shift)
3. Theme toggle works smoothly
4. Navigation mode toggle works smoothly

## Performance Considerations

### Blocking Script Impact

- **Size:** ~500 bytes minified
- **Execution Time:** <1ms on modern browsers
- **Trade-off:** Small blocking time prevents FOUC, improving perceived performance

### localStorage Access

- **Read Operations:** 2 reads on page load (theme + navigation)
- **Write Operations:** 1 write per preference change
- **Caching:** Values cached in React state after initial read

### Hydration Performance

- No server-side rendering of dynamic preferences
- HTML attributes provide single source of truth
- Prevents hydration mismatches and re-renders

## Security Considerations

### Input Validation

- All localStorage values validated against allowed types
- Prevents XSS through localStorage injection
- Defaults applied for any invalid values

### CSP Compatibility

- Inline script requires `script-src 'unsafe-inline'` or nonce
- Consider using nonce-based CSP for production
- Alternative: Move script to external file with integrity hash

## Migration Strategy

### Phase 1: Add Blocking Script

1. Add inline script to layout.tsx
2. Update storage keys to match
3. Test with existing providers

### Phase 2: Update Providers

1. Update ThemeProvider to sync with HTML attributes
2. Update NavigationProvider to sync with HTML attributes
3. Remove system preference detection
4. Update default values

### Phase 3: Testing & Validation

1. Test first-time visitor experience
2. Test returning visitor experience
3. Test preference persistence
4. Test error scenarios

### Phase 4: Cleanup

1. Remove old storage keys from localStorage (migration script)
2. Update documentation
3. Remove deprecated code

## Accessibility

- Theme preference doesn't override system accessibility settings
- High contrast mode still respected by browser
- Keyboard navigation unaffected by preference system
- Screen readers announce theme/navigation changes

## Browser Compatibility

- **localStorage:** IE8+ (graceful degradation for older browsers)
- **HTML attributes:** All browsers
- **CSS attribute selectors:** All modern browsers
- **Fallback:** Defaults applied if features unavailable
