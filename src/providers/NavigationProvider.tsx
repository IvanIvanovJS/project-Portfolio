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
  // Initialize with default values to prevent hydration mismatch
  const [navigationMode, setNavigationMode] =
    useState<NavigationMode>('horizontal');
  const [isVerticalNavOpen, setIsVerticalNavOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle client-side hydration and localStorage loading
  useEffect(() => {
    // Use setTimeout to defer setState and avoid synchronous call warning
    const timer = setTimeout(() => {
      setIsHydrated(true);

      // Load saved navigation mode from localStorage
      const savedMode = localStorage.getItem(
        'navigationMode'
      ) as NavigationMode;
      if (savedMode === 'horizontal' || savedMode === 'vertical') {
        setNavigationMode(savedMode);

        // If vertical mode is saved, open the navigation by default on desktop
        if (savedMode === 'vertical' && window.innerWidth >= 769) {
          setIsVerticalNavOpen(true);
        }
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Save navigation mode to localStorage whenever it changes (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('navigationMode', navigationMode);
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

  const value: NavigationContextType = {
    navigationMode,
    isVerticalNavOpen,
    toggleNavigationMode,
    toggleVerticalNav,
    setVerticalNavOpen,
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
