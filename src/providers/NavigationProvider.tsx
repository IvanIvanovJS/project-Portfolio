'use client';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

export type NavigationMode = 'horizontal' | 'vertical';

interface NavigationContextType {
  navigationMode: NavigationMode;
  isVerticalNavOpen: boolean;
  toggleNavigationMode: () => void;
  toggleVerticalNav: () => void;
  setVerticalNavOpen: (open: boolean) => void;
  setNavigationMode: (mode: NavigationMode) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
}) => {
  // Initialize with default value 'vertical' to prevent hydration mismatch
  const [navigationMode, setNavigationMode] =
    useState<NavigationMode>('vertical');
  const [isVerticalNavOpen, setIsVerticalNavOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle client-side hydration and sync with HTML attribute
  useEffect(() => {
    // Use setTimeout to defer setState and avoid synchronous call warning
    const timer = setTimeout(() => {
      // Read from HTML attribute (set by blocking script)
      const htmlNav = document.documentElement.getAttribute('data-navigation');
      const initialMode =
        htmlNav === 'horizontal' || htmlNav === 'vertical'
          ? htmlNav
          : 'vertical';

      setNavigationMode(initialMode);

      // Set vertical nav open state based on screen size
      if (initialMode === 'vertical' && window.innerWidth >= 769) {
        setIsVerticalNavOpen(true);
      }

      setIsHydrated(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Save navigation mode to localStorage and update HTML attribute whenever it changes
  useEffect(() => {
    if (isHydrated) {
      // Update HTML attribute
      document.documentElement.setAttribute('data-navigation', navigationMode);

      // Persist to localStorage with error handling
      try {
        localStorage.setItem('portfolio-navigation', navigationMode);
      } catch {
        console.warn('Failed to save navigation preference');
      }
    }
  }, [navigationMode, isHydrated]);

  // Handle window resize to manage vertical navigation state
  useEffect(() => {
    if (!isHydrated) return;

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
  }, [navigationMode, isHydrated]);

  const toggleNavigationMode = () => {
    const newMode = navigationMode === 'horizontal' ? 'vertical' : 'horizontal';
    setNavigationMode(newMode);

    if (isHydrated) {
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

  const toggleVerticalNav = () => {
    setIsVerticalNavOpen((prev) => !prev);
  };

  const setVerticalNavOpen = (open: boolean) => {
    setIsVerticalNavOpen(open);
  };

  const setNavigationModeWithLogic = (newMode: NavigationMode) => {
    setNavigationMode(newMode);

    if (isHydrated) {
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

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export default NavigationProvider;
