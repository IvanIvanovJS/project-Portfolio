import { useState, useEffect } from 'react';
import {
  getCurrentWeatherCached,
  SOFIA_COORDINATES,
} from '../services/weatherService';
import type { CurrentWeather } from '../types';

/**
 * Weather hook state
 */
interface UseWeatherResult {
  weather: CurrentWeather | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for managing weather data
 *
 * Features:
 * - Fetches current weather data for Sofia
 * - Handles loading and error states
 * - Provides refetch functionality
 * - Uses cached data when available
 *
 * Requirements: 1.1, 1.2, 2.3, 2.4, 2.5
 *
 * @returns UseWeatherResult object with weather data and state
 */
export const useWeather = (): UseWeatherResult => {
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const weatherData = await getCurrentWeatherCached(
        SOFIA_COORDINATES.lat,
        SOFIA_COORDINATES.lon
      );

      setWeather(weatherData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unable to load weather';
      setError(errorMessage);
      console.error('Error fetching weather:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();

    // Set up automatic refresh every 30 minutes
    const refreshInterval = setInterval(
      () => {
        fetchWeather();
      },
      30 * 60 * 1000
    ); // 30 minutes

    return () => clearInterval(refreshInterval);
  }, []);

  return {
    weather,
    isLoading,
    error,
    refetch: fetchWeather,
  };
};
