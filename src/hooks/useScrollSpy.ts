import { useState, useEffect, useRef } from 'react';

export const useScrollSpy = (sectionIds: string[], offset: number = 100) => {
  const [activeSection, setActiveSection] = useState<string>(
    () => sectionIds[0] || ''
  );
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create intersection observer with improved settings to prevent flickering
    const observerOptions = {
      root: null,
      rootMargin: `-${offset}px 0px -40% 0px`,
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Find the section that's most visible
      let mostVisibleSection = '';
      let maxVisibilityRatio = 0;

      entries.forEach((entry) => {
        if (
          entry.isIntersecting &&
          entry.intersectionRatio > maxVisibilityRatio
        ) {
          maxVisibilityRatio = entry.intersectionRatio;
          mostVisibleSection = entry.target.id;
        }
      });

      // Only update if we have a clear winner (prevents flickering)
      if (
        mostVisibleSection &&
        maxVisibilityRatio > 0.2 &&
        sectionIds.includes(mostVisibleSection)
      ) {
        setActiveSection(mostVisibleSection);
      }
    };

    observerRef.current = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    // Observe all sections
    sectionIds.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    // Fallback scroll listener for edge cases
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset + window.innerHeight / 3;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const sectionId = sectionIds[i];
        const element = document.getElementById(sectionId);

        if (element) {
          const { offsetTop, offsetHeight } = element;
          const sectionBottom = offsetTop + offsetHeight;

          // Check if scroll position is within this section
          if (scrollPosition >= offsetTop && scrollPosition < sectionBottom) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    // Initial check
    handleScroll();

    // Debounce scroll handler to prevent excessive updates
    let scrollTimeout: NodeJS.Timeout;
    const debouncedScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 50);
    };

    window.addEventListener('scroll', debouncedScroll, { passive: true });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', debouncedScroll);
    };
  }, [sectionIds, offset]);

  return activeSection;
};

export default useScrollSpy;
