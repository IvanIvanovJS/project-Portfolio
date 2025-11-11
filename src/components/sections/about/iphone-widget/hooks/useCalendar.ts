import { useState, useEffect } from 'react';

/**
 * Calendar data structure
 */
interface CalendarData {
  dayOfWeek: string;
  dayOfMonth: number;
  month: string;
  year: number;
  fullDate: Date;
}

/**
 * Custom hook for managing calendar date state
 *
 * Features:
 * - Provides current date information
 * - Automatically updates at midnight
 * - Formats date components for display
 *
 * @returns CalendarData object with current date information
 */
export const useCalendar = (): CalendarData => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  useEffect(() => {
    // Calculate milliseconds until next midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    // Set timeout to update at midnight
    const midnightTimeout = setTimeout(() => {
      setCurrentDate(new Date());

      // Set up daily interval after first midnight update
      const dailyInterval = setInterval(
        () => {
          setCurrentDate(new Date());
        },
        24 * 60 * 60 * 1000
      ); // 24 hours

      return () => clearInterval(dailyInterval);
    }, msUntilMidnight);

    return () => clearTimeout(midnightTimeout);
  }, []);

  // Format date components
  const dayOfWeek = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
  });
  const dayOfMonth = currentDate.getDate();
  const month = currentDate.toLocaleDateString('en-US', { month: 'long' });
  const year = currentDate.getFullYear();

  return {
    dayOfWeek,
    dayOfMonth,
    month,
    year,
    fullDate: currentDate,
  };
};
