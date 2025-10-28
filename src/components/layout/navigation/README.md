# Adaptive Navigation System

This directory contains the implementation of an adaptive navigation system that supports both horizontal and vertical navigation modes with full mobile responsiveness.

## Components

### NavigationProvider

- **Location**: `src/providers/NavigationProvider.tsx`
- **Purpose**: Manages navigation mode state and persistence
- **Features**:
  - Toggle between horizontal and vertical navigation modes
  - Persist user preference in localStorage
  - Handle responsive behavior for mobile devices
  - Manage vertical navigation open/close state

### VerticalNavigation

- **Location**: `VerticalNavigation.tsx`
- **Purpose**: Sidebar navigation component for vertical mode
- **Features**:
  - Fixed positioning on the left side (desktop)
  - Glassmorphism styling with blur effects
  - Smooth animations for navigation items
  - Keyboard navigation support (Escape key)
  - Mobile responsive (slides from right on mobile)

### MobileNavigation

- **Location**: `MobileNavigation.tsx`
- **Purpose**: Mobile-specific navigation overlay
- **Features**:
  - Different behaviors for horizontal vs vertical modes
  - Horizontal mode: slides from top, full screen
  - Vertical mode: slides from right, 80% width
  - Touch gesture support for closing
  - Glassmorphism overlay background

### NavigationToggle

- **Location**: `src/components/ui/navigation-toggle/NavigationToggle.tsx`
- **Purpose**: Button to switch between navigation modes
- **Features**:
  - Visual icons indicating current mode
  - Glassmorphism button styling
  - Hover and focus states

## Usage

### Basic Setup

```tsx
import { NavigationProvider } from '../providers/NavigationProvider';
import { LayoutWrapper } from '../components/layout/LayoutWrapper';

function App() {
  return (
    <NavigationProvider>
      <LayoutWrapper>{/* Your app content */}</LayoutWrapper>
    </NavigationProvider>
  );
}
```

### Using Navigation Context

```tsx
import { useNavigation } from '../providers/NavigationProvider';

function MyComponent() {
  const {
    navigationMode,
    isVerticalNavOpen,
    toggleNavigationMode,
    toggleVerticalNav,
  } = useNavigation();

  // Use navigation state and controls
}
```

## Responsive Behavior

### Desktop (≥ 768px)

- **Horizontal Mode**: Traditional header navigation
- **Vertical Mode**: Fixed sidebar navigation (280px width)
- Content automatically adjusts margin when vertical nav is open

### Mobile (< 768px)

- **Horizontal Mode**: Mobile overlay slides from top (full screen)
- **Vertical Mode**: Mobile overlay slides from right (80% width)
- Touch gestures supported for closing navigation

## Touch Gestures

### Vertical Mode Mobile

- **Swipe Right**: Close navigation (swipe distance > 100px)

### Horizontal Mode Mobile

- **Swipe Up**: Close navigation (swipe distance > 100px)

## Styling

All components use CSS modules with glassmorphism effects:

- Backdrop blur filters
- Semi-transparent backgrounds
- Subtle borders and shadows
- Smooth transitions and animations

## Accessibility

- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- Semantic HTML structure

## State Persistence

Navigation mode preference is automatically saved to localStorage and restored on page reload.

## Hydration Compatibility

The navigation system is designed to prevent hydration mismatches by:

- Using consistent initial state between server and client
- Deferring localStorage access until after hydration
- Properly handling client-side only features

## Navigation Behavior

### Link Clicks

- Clicking navigation links automatically closes mobile navigation
- Smooth scrolling to target sections with proper header offset
- Active section highlighting based on scroll position

### Mobile Navigation Closing

- Automatic close when clicking navigation links
- Touch gesture support for manual closing
- Overlay click to close
- Escape key support
