import { useState, useEffect } from 'react';

export const useScrollSpy = (sectionIds: string[], _offset: number = 0) => {
  const [activeSection, setActiveSection] = useState<string>(
    () => sectionIds[0] || ''
  );

  useEffect(() => {
    // Scroll spy implementation will be added later
    // This will be properly implemented in later tasks with intersection observer
    const handleScroll = () => {
      // Placeholder - actual scroll spy logic will be implemented later
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds, setActiveSection]);

  return activeSection;
};

export default useScrollSpy;
