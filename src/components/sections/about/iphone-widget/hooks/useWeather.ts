import { useState, useEffect, useCallback } from 'react';
import {
  getCurrentWeatherCached,
  SOFIA_COORDINATES,
} from '../services/weatherService';
import type { CurrentWeather, City } from '../types';

/**
 * Weather hook state
 */
interface UseWeatherResult {
  weather: CurrentWeather | null;
  isLoading: boolean;
  error: string | null;
  city: string;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for managing weather data
 *
 * Features:
 * - Fetches current weather data for selected city
 * - Handles loading and error states
 * - Provides refetch functionality
 * - Uses cached data when available
 * - Listens for city changes from WeatherApp
 * - Persists city selection in localStorage
 *
 * Requirements: 1.1, 1.2, 2.3, 2.4, 2.5
 *
 * @returns UseWeatherResult object with weather data and state
 */
export const useWeather = (): UseWeatherResult => {
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string>('Sofia');
  const [coordinates, setCoordinates] = useState(SOFIA_COORDINATES);

  const fetchWeather = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const weatherData = await getCurrentWeatherCached(
        coordinates.lat,
        coordinates.lon
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
  }, [coordinates]);

  // Load saved city from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCity = localStorage.getItem('selectedCity');
        if (savedCity) {
          const cityData: City = JSON.parse(savedCity);
          setCity(cityData.name);
          setCoordinates({ lat: cityData.lat, lon: cityData.lon });
        }
      } catch (err) {
        console.error('Failed to load city from localStorage:', err);
      }
    }
  }, []);

  // Fetch weather when coordinates change
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
  }, [fetchWeather]);

  // Listen for city changes from WeatherApp
  useEffect(() => {
    const handleCityChange = () => {
      if (typeof window !== 'undefined') {
        try {
          const savedCity = localStorage.getItem('selectedCity');
          if (savedCity) {
            const cityData: City = JSON.parse(savedCity);
            setCity(cityData.name);
            setCoordinates({ lat: cityData.lat, lon: cityData.lon });
          }
        } catch (err) {
          console.error('Failed to load city from localStorage:', err);
        }
      }
    };

    window.addEventListener('cityChanged', handleCityChange);
    return () => window.removeEventListener('cityChanged', handleCityChange);
  }, []);

  return {
    weather,
    isLoading,
    error,
    city,
    refetch: fetchWeather,
  };
};
