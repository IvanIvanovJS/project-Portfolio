'use client';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { STORAGE_KEYS, DEFAULTS } from '@/utils/preferences';

/**
 * Navigation mode type
 *
 * - 'horizontal': Header-based navigation at the top of the page
 * - 'vertical': Sidebar navigation on the left side of the page
 */
export type NavigationMode = 'horizontal' | 'vertical';

/**
 * Navigation context type definition
 *
 * Provides navigation state and methods for managing navigation preferences
 */
interface NavigationContextType {
  /** Current navigation mode (horizontal or vertical) */
  navigationMode: NavigationMode;
  /** Whether the vertical navigation sidebar is open (only relevant in vertical mode) */
  isVerticalNavOpen: boolean;
  /** Toggle between horizontal and vertical navigation modes */
  toggleNavigationMode: () => void;
  /** Toggle the vertical navigation sidebar open/closed state */
  toggleVerticalNav: () => void;
  /** Set the vertical navigation sidebar open state */
  setVerticalNavOpen: (open: boolean) => void;
  /** Set a specific navigation mode */
  setNavigationMode: (mode: NavigationMode) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

interface NavigationProviderProps {
  children: ReactNode;
}

/**
 * NavigationProvider Component
 *
 * Manages navigation mode state (horizontal/vertical) and sidebar state for the application.
 *
 * ## Architecture
 *
 * This provider works in conjunction with a blocking script in layout.tsx to prevent
 * Flash of Unstyled Content (FOUC):
 *
 * 1. **Blocking Script (runs before first paint)**:
 *    - Reads navigation mode from localStorage
 *    - Sets data-navigation attribute on <html> element
 *    - Applies default (vertical) if no preference exists
 *
 * 2. **NavigationProvider (runs after React hydration)**:
 *    - Syncs with data-navigation attribute (single source of truth)
 *    - Manages navigation state in React
 *    - Updates both HTML attribute and localStorage on changes
 *    - Handles responsive behavior for vertical navigation
 *
 * ## Default Behavior
 *
 * - First-time visitors: Vertical navigation mode
 * - Returning visitors: Previously selected navigation mode
 * - localStorage unavailable: Vertical navigation (in-memory state only)
 * - Desktop (≥769px): Vertical nav opens automatically
 * - Mobile (<769px): Vertical nav closed by default
 *
 * ## Error Handling
 *
 * - localStorage read errors: Falls back to vertical navigation
 * - localStorage write errors: Logs warning, continues with in-memory state
 * - Invalid stored values: Validated and replaced with default
 *
 * @example
 * ```tsx
 * <NavigationProvider>
 *   <App />
 * </NavigationProvider>
 * ```
 */
export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
}) => {
  /**
   * Initialize with default value 'vertical' to prevent hydration mismatch
   *
   * Default: 'vertical'
   * Rationale: Vertical navigation provides better content focus and is more
   * suitable for the glassmorphism design aesthetic.
   */
  const [navigationMode, setNavigationMode] = useState<NavigationMode>(
    DEFAULTS.NAVIGATION
  );
  const [isVerticalNavOpen, setIsVerticalNavOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * Initialize navigation mode on client-side mount
   *
   * Reads the data-navigation attribute set by the blocking script and syncs
   * React state with it. Also sets the initial vertical nav open state based
   * on screen size.
   */
  useEffect(() => {
    // Use setTimeout to defer setState and avoid synchronous call warning
    const timer = setTimeout(() => {
      // Read from HTML attribute (set by blocking script)
      const htmlNav = document.documentElement.getAttribute('data-navigation');
      const initialMode =
        htmlNav === 'horizontal' || htmlNav === 'vertical'
          ? htmlNav
          : DEFAULTS.NAVIGATION;

      setNavigationMode(initialMode);

      // Set vertical nav open state based on screen size
      // Desktop: open by default, Mobile: closed by default
      if (initialMode === 'vertical' && window.innerWidth >= 769) {
        setIsVerticalNavOpen(true);
      }

      // Mark as initialized after state is set
      setTimeout(() => setIsInitialized(true), 0);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  /**
   * Persist navigation mode changes to HTML attribute and localStorage
   *
   * Updates both the data-navigation attribute (for CSS) and localStorage
   * (for persistence) whenever the navigation mode changes. Skips during
   * initial load to avoid overwriting the blocking script's work.
   */
  useEffect(() => {
    // Only persist changes after initialization is complete
    if (isInitialized) {
      // Update HTML attribute for CSS selectors
      document.documentElement.setAttribute('data-navigation', navigationMode);

      // Persist to localStorage with error handling
      try {
        localStorage.setItem(STORAGE_KEYS.NAVIGATION, navigationMode);
      } catch {
        console.warn('Failed to save navigation preference');
        // Continue execution - navigation will work in-memory but won't persist
      }
    }
  }, [navigationMode, isInitialized]);

  /**
   * Handle responsive behavior for vertical navigation
   *
   * Automatically manages the vertical navigation open/closed state based on
   * screen size changes:
   * - Desktop (≥769px): Opens vertical nav automatically
   * - Mobile (<769px): Closes vertical nav automatically
   *
   * This ensures optimal UX across different device sizes.
   */
  useEffect(() => {
    if (!isInitialized) return;

    const handleResize = () => {
      const isMobile = window.innerWidth < 769;

      if (navigationMode === 'vertical') {
        if (isMobile) {
          // On mobile, close vertical nav when resizing
          setIsVerticalNavOpen(false);
        } else {
          // On desktop, open vertical nav by default
          setIsVerticalNavOpen(true);
        }
      }
    };

    window.addEventListener('resize', handleResize);

    // Initial check
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [navigationMode, isInitialized]);

  /**
   * Toggle between horizontal and vertical navigation modes
   *
   * Automatically manages vertical nav open state based on screen size
   * when switching to vertical mode.
   */
  const toggleNavigationMode = () => {
    const newMode = navigationMode === 'horizontal' ? 'vertical' : 'horizontal';
    setNavigationMode(newMode);

    if (isInitialized) {
      const isMobile = window.innerWidth < 769;

      if (newMode === 'vertical') {
        // When switching to vertical, open it by default on desktop
        setIsVerticalNavOpen(!isMobile);
      } else {
        // When switching to horizontal, close vertical nav
        setIsVerticalNavOpen(false);
      }
    }
  };

  /**
   * Toggle the vertical navigation sidebar open/closed state
   */
  const toggleVerticalNav = () => {
    setIsVerticalNavOpen((prev) => !prev);
  };

  /**
   * Set the vertical navigation sidebar open state
   *
   * @param open - Whether the vertical nav should be open
   */
  const setVerticalNavOpen = (open: boolean) => {
    setIsVerticalNavOpen(open);
  };

  /**
   * Set a specific navigation mode with automatic vertical nav state management
   *
   * @param newMode - The navigation mode to set ('horizontal' or 'vertical')
   */
  const setNavigationModeWithLogic = (newMode: NavigationMode) => {
    setNavigationMode(newMode);

    if (isInitialized) {
      const isMobile = window.innerWidth < 769;

      if (newMode === 'vertical') {
        setIsVerticalNavOpen(!isMobile);
      } else {
        setIsVerticalNavOpen(false);
      }
    }
  };

  const value: NavigationContextType = {
    navigationMode,
    isVerticalNavOpen,
    toggleNavigationMode,
    toggleVerticalNav,
    setVerticalNavOpen,
    setNavigationMode: setNavigationModeWithLogic,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

/**
 * Hook to access navigation context
 *
 * @returns Navigation context with current mode and control methods
 * @throws Error if used outside of NavigationProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { navigationMode, toggleNavigationMode } = useNavigation();
 *   return (
 *     <button onClick={toggleNavigationMode}>
 *       Current: {navigationMode}
 *     </button>
 *   );
 * }
 * ```
 */
export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export default NavigationProvider;
