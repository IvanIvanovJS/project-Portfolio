import { useState, useEffect } from 'react';

/**
 * Custom hook for managing system time updates
 * Updates the current time every minute for the iPhone system bar
 *
 * @returns Current Date object that updates every minute
 */
export const useSystemTime = (): Date => {
  // Initialize with a fixed time to avoid hydration mismatch
  const [currentTime, setCurrentTime] = useState<Date>(
    () => new Date('2024-01-01T12:00:00')
  );

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let initialTimeout: NodeJS.Timeout | null = null;

    // Set to actual current time on client mount (after hydration)
    // Use setTimeout to avoid cascading renders warning
    const immediateUpdate = setTimeout(() => {
      const now = new Date();
      setCurrentTime(now);

      // Calculate milliseconds until next minute
      const msUntilNextMinute =
        (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

      // Set initial timeout to sync with minute boundary
      initialTimeout = setTimeout(() => {
        setCurrentTime(new Date());

        // Then update every minute
        interval = setInterval(() => {
          setCurrentTime(new Date());
        }, 60000); // 60 seconds
      }, msUntilNextMinute);
    }, 0);

    // Cleanup on unmount
    return () => {
      clearTimeout(immediateUpdate);
      if (initialTimeout) clearTimeout(initialTimeout);
      if (interval) clearInterval(interval);
    };
  }, []);

  return currentTime;
};
