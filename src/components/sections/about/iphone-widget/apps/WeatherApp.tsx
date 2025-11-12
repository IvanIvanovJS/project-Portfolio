'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Search, X } from 'lucide-react';
import {
  getCurrentWeather,
  getForecast,
  searchCities,
} from '../services/weatherService';
import { getWeatherIcon } from '../utils/weatherIcons';
import { CurrentWeather, DailyForecast, City } from '../types';
import styles from './WeatherApp.module.css';

/**
 * WeatherApp Component
 *
 * Full-screen weather application displaying current conditions and 7-day forecast.
 *
 * Features:
 * - Current weather with large temperature display
 * - 7-day forecast with daily cards
 * - City selector for changing location
 * - Scrollable forecast list
 * - Loading and error states
 * - Syncs selected city with WeatherWidget via localStorage
 *
 * @param props - WeatherApp props
 */
export interface WeatherAppProps {
  onClose: () => void;
  initialCity?: string;
}

export const WeatherApp: React.FC<WeatherAppProps> = ({
  onClose: _onClose,
  initialCity = 'Sofia',
}) => {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(
    null
  );
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [coordinates, setCoordinates] = useState({
    lat: 42.6977,
    lon: 23.3219,
  }); // Default Sofia
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<City[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved city and forecast from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCity = localStorage.getItem('selectedCity');
        if (savedCity) {
          const city: City = JSON.parse(savedCity);
          setSelectedCity(city.name);
          setCoordinates({ lat: city.lat, lon: city.lon });
        }

        // Load saved forecast if available and recent (within 2 hours)
        const savedForecast = localStorage.getItem('weatherForecast');
        if (savedForecast) {
          const forecastData = JSON.parse(savedForecast);
          const isRecent =
            Date.now() - forecastData.timestamp < 2 * 60 * 60 * 1000;

          if (isRecent && forecastData.forecast && forecastData.city) {
            // Check if the saved forecast matches the current city
            const cityMatches = savedCity
              ? JSON.parse(savedCity).name === forecastData.city
              : forecastData.city === initialCity;

            if (cityMatches) {
              // Reconstruct Date objects
              const forecast = forecastData.forecast.map(
                (day: DailyForecast) => ({
                  ...day,
                  date: new Date(day.date),
                })
              );
              setForecast(forecast);
              setIsLoading(false);
              setIsInitialized(true);
              return;
            }
          }
        }
      } catch (err) {
        console.error('Failed to load data from localStorage:', err);
      }
    }
    setIsInitialized(true);
  }, [initialCity]);

  // Fetch weather data on mount and when coordinates change
  useEffect(() => {
    // Don't fetch until initialization is complete
    if (!isInitialized) return;

    // Check if we already have recent cached data for these coordinates
    if (typeof window !== 'undefined') {
      try {
        const savedForecast = localStorage.getItem('weatherForecast');
        if (savedForecast) {
          const forecastData = JSON.parse(savedForecast);
          const isRecent =
            Date.now() - forecastData.timestamp < 2 * 60 * 60 * 1000;

          // Check if cached data matches current coordinates
          const coordsMatch =
            forecastData.coordinates &&
            Math.abs(forecastData.coordinates.lat - coordinates.lat) < 0.01 &&
            Math.abs(forecastData.coordinates.lon - coordinates.lon) < 0.01;

          // If we have recent cached data for these coordinates, skip fetch
          if (isRecent && coordsMatch && forecast.length > 0) {
            return;
          }
        }
      } catch (err) {
        console.error('Error checking cache:', err);
      }
    }

    const fetchWeatherData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch current weather and forecast
        const [current, forecastData] = await Promise.all([
          getCurrentWeather(coordinates.lat, coordinates.lon),
          getForecast(coordinates.lat, coordinates.lon, 7),
        ]);

        setCurrentWeather(current);
        setForecast(forecastData);

        // Save forecast to localStorage for persistence
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(
              'weatherForecast',
              JSON.stringify({
                city: selectedCity,
                coordinates,
                forecast: forecastData,
                timestamp: Date.now(),
              })
            );
          } catch (err) {
            console.error('Failed to save forecast to localStorage:', err);
          }
        }
      } catch (err) {
        console.error('Failed to fetch weather data:', err);
        setError('Unable to load weather data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeatherData();
  }, [coordinates, selectedCity, isInitialized, forecast.length]);

  const handleCitySelectorOpen = () => {
    setShowCitySelector(true);
    setSearchQuery('');
    setSearchResults([]);
    setSearchError(null);
  };

  const handleCitySelectorClose = () => {
    setShowCitySelector(false);
    setSearchQuery('');
    setSearchResults([]);
    setSearchError(null);
  };

  const handleCitySelect = (city: City) => {
    // Update selected city and coordinates
    setSelectedCity(city.name);
    setCoordinates({ lat: city.lat, lon: city.lon });

    // Store selected city in localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'selectedCity',
          JSON.stringify({
            name: city.name,
            country: city.country,
            lat: city.lat,
            lon: city.lon,
          })
        );
        // Dispatch custom event to notify WeatherWidget
        window.dispatchEvent(new Event('cityChanged'));
      } catch (err) {
        console.error('Failed to save city to localStorage:', err);
      }
    }

    // Close the city selector
    handleCitySelectorClose();
  };

  // Debounced city search
  useEffect(() => {
    if (!showCitySelector) return;

    // Don't search if query is too short
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setSearchError(null);
      setIsSearching(false);
      return;
    }

    // Set searching state
    setIsSearching(true);
    setSearchError(null);

    // Debounce search by 300ms
    const timeoutId = setTimeout(async () => {
      try {
        const cities = await searchCities(searchQuery);
        setSearchResults(cities);
        setIsSearching(false);

        if (cities.length === 0) {
          setSearchError(null); // Will show "No cities found" state
        }
      } catch (err) {
        console.error('City search error:', err);
        setSearchError('Unable to search cities. Please try again.');
        setSearchResults([]);
        setIsSearching(false);
      }
    }, 300);

    // Cleanup timeout on query change
    return () => clearTimeout(timeoutId);
  }, [searchQuery, showCitySelector]);

  return (
    <div
      className={styles.weatherApp}
      role="dialog"
      aria-modal="true"
      aria-label={`Weather forecast application for ${selectedCity}`}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.cityName}>
          <MapPin size={16} strokeWidth={2} />
          <span>{selectedCity}</span>
        </div>
        <button
          className={styles.cityButton}
          onClick={handleCitySelectorOpen}
          aria-label="Change city"
        >
          <Search size={20} strokeWidth={2} />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className={styles.scrollContainer}>
        {isLoading ? (
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner} />
            <p>Loading weather data...</p>
          </div>
        ) : error ? (
          <div className={styles.errorState}>
            <p>{error}</p>
            <button
              className={styles.retryButton}
              onClick={() => setSelectedCity(selectedCity)}
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Current Weather Section */}
            {currentWeather && (
              <div className={styles.currentWeather}>
                <div className={styles.weatherIcon}>
                  {getWeatherIcon(currentWeather.icon, 80)}
                </div>
                <div className={styles.temperature}>
                  {Math.round(currentWeather.temperature)}°
                </div>
                <div className={styles.condition}>
                  {currentWeather.condition}
                </div>
                <div className={styles.highLow}>
                  H:{Math.round(currentWeather.high)}° L:
                  {Math.round(currentWeather.low)}°
                </div>
                <div className={styles.additionalDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Humidity</span>
                    <span className={styles.detailValue}>
                      {currentWeather.humidity}%
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Wind</span>
                    <span className={styles.detailValue}>
                      {Math.round(currentWeather.windSpeed)} km/h
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Forecast Section */}
            {forecast.length > 0 && (
              <div className={styles.forecastSection}>
                <h2 className={styles.forecastTitle}>7-Day Forecast</h2>
                <div className={styles.forecastList}>
                  {forecast.map((day, index) => {
                    const precipText =
                      day.precipitationChance > 0
                        ? `, ${day.precipitationChance}% chance of precipitation`
                        : '';
                    return (
                      <div
                        key={day.date.toISOString()}
                        className={styles.forecastCard}
                        style={{
                          animationDelay: `${index * 0.05}s`,
                        }}
                        role="article"
                        aria-label={`${day.dayName}, ${day.condition}, high ${Math.round(day.high)} degrees, low ${Math.round(day.low)} degrees${precipText}`}
                      >
                        <div className={styles.forecastLeft}>
                          <div
                            className={styles.forecastDay}
                            aria-hidden="true"
                          >
                            {day.dayName}
                          </div>
                          <div
                            className={styles.forecastIcon}
                            aria-hidden="true"
                          >
                            {getWeatherIcon(day.icon, 28)}
                          </div>
                        </div>
                        <div className={styles.forecastRight}>
                          <div
                            className={styles.forecastTemps}
                            aria-hidden="true"
                          >
                            <span className={styles.forecastHigh}>
                              {Math.round(day.high)}°
                            </span>
                            <span className={styles.forecastLow}>
                              {Math.round(day.low)}°
                            </span>
                          </div>
                          {day.precipitationChance > 0 && (
                            <div
                              className={styles.precipitation}
                              aria-hidden="true"
                            >
                              {day.precipitationChance}%
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* City Selector Modal */}
      {showCitySelector && (
        <div className={styles.citySelectorOverlay}>
          <div className={styles.citySelectorModal}>
            <div className={styles.citySelectorHeader}>
              <h3 className={styles.citySelectorTitle}>Select City</h3>
              <button
                className={styles.closeButton}
                onClick={handleCitySelectorClose}
                aria-label="Close city selector"
              >
                <X size={24} strokeWidth={2} />
              </button>
            </div>

            <div className={styles.searchContainer}>
              <div className={styles.searchInputWrapper}>
                <Search
                  size={18}
                  strokeWidth={2}
                  className={styles.searchIcon}
                />
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search for a city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                {searchQuery && (
                  <button
                    className={styles.clearButton}
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    <X size={16} strokeWidth={2} />
                  </button>
                )}
              </div>
            </div>

            <div className={styles.searchResults}>
              {isSearching ? (
                <div className={styles.searchingState}>
                  <div className={styles.searchSpinner} />
                  <p>Searching...</p>
                </div>
              ) : searchError ? (
                <div className={styles.searchErrorState}>
                  <p>{searchError}</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className={styles.cityList}>
                  {searchResults.map((city, index) => (
                    <button
                      key={`${city.name}-${city.country}-${index}`}
                      className={styles.cityItem}
                      onClick={() => handleCitySelect(city)}
                    >
                      <div className={styles.cityItemContent}>
                        <span className={styles.cityItemName}>{city.name}</span>
                        <span className={styles.cityItemCountry}>
                          {city.country}
                        </span>
                      </div>
                      <MapPin size={16} strokeWidth={2} opacity={0.5} />
                    </button>
                  ))}
                </div>
              ) : searchQuery.length >= 2 ? (
                <div className={styles.emptyState}>
                  <p>No cities found</p>
                  <span>Try a different search term</span>
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <p>Search for a city</p>
                  <span>Enter at least 2 characters</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
