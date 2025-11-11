/**
 * Weather Service for Open-Meteo API integration
 * Handles fetching current weather, forecasts, and city geocoding
 */

import type {
  CurrentWeather,
  DailyForecast,
  City,
  Coordinates,
  OpenMeteoCurrentResponse,
  OpenMeteoForecastResponse,
  OpenMeteoGeocodingResponse,
  WeatherIcon,
} from '../types';

/**
 * Weather code to condition and icon mapping
 * Based on WMO Weather interpretation codes
 */
const WEATHER_CODES: Record<
  number,
  { condition: string; icon: WeatherIcon; night?: WeatherIcon }
> = {
  0: { condition: 'Clear', icon: 'sun', night: 'moon' },
  1: { condition: 'Mainly Clear', icon: 'sun', night: 'moon' },
  2: { condition: 'Partly Cloudy', icon: 'cloud-sun', night: 'cloud-moon' },
  3: { condition: 'Overcast', icon: 'cloud' },
  45: { condition: 'Foggy', icon: 'fog' },
  48: { condition: 'Foggy', icon: 'fog' },
  51: { condition: 'Light Drizzle', icon: 'cloud-drizzle' },
  53: { condition: 'Drizzle', icon: 'cloud-drizzle' },
  55: { condition: 'Heavy Drizzle', icon: 'cloud-drizzle' },
  61: { condition: 'Light Rain', icon: 'cloud-rain' },
  63: { condition: 'Rain', icon: 'cloud-rain' },
  65: { condition: 'Heavy Rain', icon: 'cloud-rain' },
  71: { condition: 'Light Snow', icon: 'cloud-snow' },
  73: { condition: 'Snow', icon: 'cloud-snow' },
  75: { condition: 'Heavy Snow', icon: 'cloud-snow' },
  77: { condition: 'Snow Grains', icon: 'cloud-snow' },
  80: { condition: 'Light Showers', icon: 'cloud-rain' },
  81: { condition: 'Showers', icon: 'cloud-rain' },
  82: { condition: 'Heavy Showers', icon: 'cloud-rain' },
  85: { condition: 'Light Snow Showers', icon: 'cloud-snow' },
  86: { condition: 'Snow Showers', icon: 'cloud-snow' },
  95: { condition: 'Thunderstorm', icon: 'cloud-lightning' },
  96: { condition: 'Thunderstorm with Hail', icon: 'cloud-lightning' },
  99: { condition: 'Thunderstorm with Hail', icon: 'cloud-lightning' },
};

/**
 * Get weather condition and icon from weather code
 */
function getWeatherInfo(
  weatherCode: number,
  isNight: boolean = false
): { condition: string; icon: WeatherIcon } {
  const weatherInfo = WEATHER_CODES[weatherCode] || {
    condition: 'Unknown',
    icon: 'cloud' as WeatherIcon,
  };

  return {
    condition: weatherInfo.condition,
    icon: isNight && weatherInfo.night ? weatherInfo.night : weatherInfo.icon,
  };
}

/**
 * Determine if it's currently nighttime based on hour
 */
function isNightTime(): boolean {
  const hour = new Date().getHours();
  return hour < 6 || hour >= 20;
}

/**
 * Get current weather for given coordinates
 */
export async function getCurrentWeather(
  lat: number,
  lon: number
): Promise<CurrentWeather> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode,windspeed_10m,relativehumidity_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data: OpenMeteoCurrentResponse = await response.json();

    const isNight = isNightTime();
    const weatherInfo = getWeatherInfo(data.current.weathercode, isNight);

    return {
      temperature: Math.round(data.current.temperature_2m),
      condition: weatherInfo.condition,
      icon: weatherInfo.icon,
      high: Math.round(data.daily.temperature_2m_max[0]),
      low: Math.round(data.daily.temperature_2m_min[0]),
      humidity: data.current.relativehumidity_2m,
      windSpeed: Math.round(data.current.windspeed_10m),
    };
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw new Error(
      'Unable to load weather data. Please check your connection.'
    );
  }
}

/**
 * Get forecast for given coordinates
 */
export async function getForecast(
  lat: number,
  lon: number,
  days: number = 7
): Promise<DailyForecast[]> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=${days}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.status}`);
    }

    const data: OpenMeteoForecastResponse = await response.json();

    return data.daily.time.map((dateStr, index) => {
      const date = new Date(dateStr);
      const weatherInfo = getWeatherInfo(data.daily.weathercode[index]);

      return {
        date,
        dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
        high: Math.round(data.daily.temperature_2m_max[index]),
        low: Math.round(data.daily.temperature_2m_min[index]),
        condition: weatherInfo.condition,
        icon: weatherInfo.icon,
        precipitationChance:
          data.daily.precipitation_probability_max[index] || 0,
      };
    });
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw new Error(
      'Unable to load forecast data. Please check your connection.'
    );
  }
}

/**
 * Search for cities by name
 */
export async function searchCities(query: string): Promise<City[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query
  )}&count=10&language=en&format=json`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data: OpenMeteoGeocodingResponse = await response.json();

    if (!data.results || data.results.length === 0) {
      return [];
    }

    return data.results.map((result) => ({
      name: result.name,
      country: result.country,
      lat: result.latitude,
      lon: result.longitude,
    }));
  } catch (error) {
    console.error('Error searching cities:', error);
    throw new Error('Unable to search cities. Please try again.');
  }
}

/**
 * Geocode a city name to coordinates
 */
export async function geocodeCity(cityName: string): Promise<Coordinates> {
  const cities = await searchCities(cityName);

  if (cities.length === 0) {
    throw new Error(`City "${cityName}" not found`);
  }

  const city = cities[0];
  return {
    lat: city.lat,
    lon: city.lon,
  };
}

/**
 * Default coordinates for Sofia, Bulgaria
 */
export const SOFIA_COORDINATES: Coordinates = {
  lat: 42.6977,
  lon: 23.3219,
};

/**
 * Cache configuration
 */
const CACHE_CONFIG = {
  CURRENT_WEATHER_TTL: 30 * 60 * 1000, // 30 minutes
  FORECAST_TTL: 2 * 60 * 60 * 1000, // 2 hours
  CURRENT_WEATHER_KEY: 'weather_current',
  FORECAST_KEY: 'weather_forecast',
};

/**
 * Cached data structure
 */
interface CachedData<T> {
  data: T;
  timestamp: number;
  coordinates: Coordinates;
}

/**
 * Generate cache key based on coordinates
 */
function getCacheKey(baseKey: string, lat: number, lon: number): string {
  return `${baseKey}_${lat.toFixed(4)}_${lon.toFixed(4)}`;
}

/**
 * Check if cached data is still valid
 */
function isCacheValid<T>(
  cached: CachedData<T> | null,
  ttl: number,
  lat: number,
  lon: number
): boolean {
  if (!cached) return false;

  const now = Date.now();
  const isExpired = now - cached.timestamp > ttl;
  const coordinatesMatch =
    Math.abs(cached.coordinates.lat - lat) < 0.01 &&
    Math.abs(cached.coordinates.lon - lon) < 0.01;

  return !isExpired && coordinatesMatch;
}

/**
 * Get data from localStorage cache
 */
function getFromCache<T>(
  baseKey: string,
  lat: number,
  lon: number,
  ttl: number
): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const cacheKey = getCacheKey(baseKey, lat, lon);
    const cached = localStorage.getItem(cacheKey);

    if (!cached) return null;

    const parsedCache: CachedData<T> = JSON.parse(cached);

    if (isCacheValid(parsedCache, ttl, lat, lon)) {
      return parsedCache.data;
    }

    // Cache expired or coordinates don't match, remove it
    localStorage.removeItem(cacheKey);
    return null;
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
}

/**
 * Save data to localStorage cache
 */
function saveToCache<T>(
  baseKey: string,
  lat: number,
  lon: number,
  data: T
): void {
  if (typeof window === 'undefined') return;

  try {
    const cacheKey = getCacheKey(baseKey, lat, lon);
    const cachedData: CachedData<T> = {
      data,
      timestamp: Date.now(),
      coordinates: { lat, lon },
    };

    localStorage.setItem(cacheKey, JSON.stringify(cachedData));
  } catch (error) {
    console.error('Error saving to cache:', error);
  }
}

/**
 * Invalidate cache for a specific location
 */
export function invalidateCache(lat: number, lon: number): void {
  if (typeof window === 'undefined') return;

  try {
    const currentKey = getCacheKey(CACHE_CONFIG.CURRENT_WEATHER_KEY, lat, lon);
    const forecastKey = getCacheKey(CACHE_CONFIG.FORECAST_KEY, lat, lon);

    localStorage.removeItem(currentKey);
    localStorage.removeItem(forecastKey);
  } catch (error) {
    console.error('Error invalidating cache:', error);
  }
}

/**
 * Get current weather with caching
 */
export async function getCurrentWeatherCached(
  lat: number,
  lon: number
): Promise<CurrentWeather> {
  // Try to get from cache first
  const cached = getFromCache<CurrentWeather>(
    CACHE_CONFIG.CURRENT_WEATHER_KEY,
    lat,
    lon,
    CACHE_CONFIG.CURRENT_WEATHER_TTL
  );

  if (cached) {
    return cached;
  }

  // Fetch fresh data
  const weather = await getCurrentWeather(lat, lon);

  // Save to cache
  saveToCache(CACHE_CONFIG.CURRENT_WEATHER_KEY, lat, lon, weather);

  return weather;
}

/**
 * Get forecast with caching
 */
export async function getForecastCached(
  lat: number,
  lon: number,
  days: number = 7
): Promise<DailyForecast[]> {
  // Try to get from cache first
  const cached = getFromCache<DailyForecast[]>(
    CACHE_CONFIG.FORECAST_KEY,
    lat,
    lon,
    CACHE_CONFIG.FORECAST_TTL
  );

  if (cached) {
    // Reconstruct Date objects from cached data
    return cached.map((forecast) => ({
      ...forecast,
      date: new Date(forecast.date),
    }));
  }

  // Fetch fresh data
  const forecast = await getForecast(lat, lon, days);

  // Save to cache
  saveToCache(CACHE_CONFIG.FORECAST_KEY, lat, lon, forecast);

  return forecast;
}
