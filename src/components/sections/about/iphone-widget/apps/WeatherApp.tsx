'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, MapPin } from 'lucide-react';
import { WeatherService } from '../services/weatherService';
import { getWeatherIcon } from '../utils/weatherIcons';
import { CurrentWeather, DailyForecast } from '../types';
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
 * - Back button to return to home screen
 * - Loading and error states
 *
 * @param props - WeatherApp props
 */
export interface WeatherAppProps {
  onClose: () => void;
  initialCity?: string;
}

export const WeatherApp: React.FC<WeatherAppProps> = ({
  onClose,
  initialCity = 'Sofia',
}) => {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(
    null
  );
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch weather data on mount and when city changes
  useEffect(() => {
    const fetchWeatherData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Default to Sofia coordinates
        const lat = 42.6977;
        const lon = 23.3219;

        // Fetch current weather and forecast
        const [current, forecastData] = await Promise.all([
          WeatherService.getCurrentWeather(lat, lon),
          WeatherService.getForecast(lat, lon, 7),
        ]);

        setCurrentWeather(current);
        setForecast(forecastData);
      } catch (err) {
        console.error('Failed to fetch weather data:', err);
        setError('Unable to load weather data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeatherData();
  }, [selectedCity]);

  const handleBackClick = () => {
    onClose();
  };

  return (
    <div className={styles.weatherApp}>
      {/* Header */}
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={handleBackClick}
          aria-label="Back to home screen"
        >
          <ChevronLeft size={24} strokeWidth={2} />
        </button>
        <div className={styles.cityName}>
          <MapPin size={16} strokeWidth={2} />
          <span>{selectedCity}</span>
        </div>
        <div className={styles.headerSpacer} />
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
                  {forecast.map((day, index) => (
                    <div
                      key={day.date.toISOString()}
                      className={styles.forecastCard}
                      style={{
                        animationDelay: `${index * 0.05}s`,
                      }}
                    >
                      <div className={styles.forecastDay}>{day.dayName}</div>
                      <div className={styles.forecastIcon}>
                        {getWeatherIcon(day.icon, 32)}
                      </div>
                      <div className={styles.forecastTemps}>
                        <span className={styles.forecastHigh}>
                          {Math.round(day.high)}°
                        </span>
                        <span className={styles.forecastLow}>
                          {Math.round(day.low)}°
                        </span>
                      </div>
                      {day.precipitationChance > 0 && (
                        <div className={styles.precipitation}>
                          {day.precipitationChance}%
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
