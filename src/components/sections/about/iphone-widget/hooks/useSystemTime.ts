import { useState, useEffect } from 'react';

/**
 * Custom hook for managing system time updates
 * Updates the current time every minute for the iPhone system bar
 *
 * @returns Current Date object that updates every minute
 */
export const useSystemTime = (): Date => {
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());

  useEffect(() => {
    // Calculate milliseconds until next minute
    const now = new Date();
    const msUntilNextMinute =
      (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

    // Set initial timeout to sync with minute boundary
    const initialTimeout = setTimeout(() => {
      setCurrentTime(new Date());

      // Then update every minute
      const interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 60000); // 60 seconds

      // Cleanup interval on unmount
      return () => clearInterval(interval);
    }, msUntilNextMinute);

    // Cleanup timeout on unmount
    return () => clearTimeout(initialTimeout);
  }, []);

  return currentTime;
};
