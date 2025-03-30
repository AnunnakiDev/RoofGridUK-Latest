import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, SxProps, Theme } from '@mui/material';
import { fetchWeatherData } from '../utils/weatherApi';
import WeatherForecastModal from './WeatherForecastModal';
import { WeatherWidgetData, WeatherForecast } from '../types/weather';

interface WeatherWidgetProps {
  sx?: SxProps<Theme>;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ sx }) => {
  const [weather, setWeather] = useState<WeatherWidgetData | null>(null);
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [showForecast, setShowForecast] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    // Check for cached weather data
    const cached = localStorage.getItem('weatherCache');
    if (cached) {
      try {
        const { widget, forecast, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 3600000) { // Cache for 1 hour
          setWeather(widget);
          setForecast(forecast);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.error('Failed to parse weather cache:', err);
      }
    }

    // Get user's location using Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lon: longitude });
        },
        (error) => {
          console.error('Geolocation error:', error.message);
          // Fallback to London coordinates if geolocation fails or is denied
          setUserLocation({ lat: 51.5014, lon: -0.1419 });
        },
        { timeout: 10000 }
      );
    } else {
      console.error('Geolocation not supported by this browser');
      // Fallback to London coordinates if geolocation is not supported
      setUserLocation({ lat: 51.5014, lon: -0.1419 });
    }
  }, []);

  useEffect(() => {
    if (!userLocation) return; // Wait until we have a location

    setIsLoading(true); // Show loading state while fetching new data
    fetchWeatherData(userLocation.lat, userLocation.lon)
      .then(({ widget, forecast }) => {
        setWeather(widget);
        setForecast(forecast);
        localStorage.setItem('weatherCache', JSON.stringify({ widget, forecast, timestamp: Date.now() }));
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Weather fetch failed:', err.message);
        // Fallback data
        setWeather({
          icon: '01d',
          temp: 15,
          windSpeed: 10,
          location: 'London',
        });
        setForecast({
          days: [
            { date: '2025-03-29', icon: '01d', tempHigh: 15, tempLow: 10, precipChance: 10, windSpeed: 10 },
            { date: '2025-03-30', icon: '03d', tempHigh: 16, tempLow: 11, precipChance: 20, windSpeed: 12 },
            { date: '2025-03-31', icon: '10d', tempHigh: 14, tempLow: 9, precipChance: 60, windSpeed: 15 },
            { date: '2025-04-01', icon: '01d', tempHigh: 17, tempLow: 12, precipChance: 5, windSpeed: 8 },
            { date: '2025-04-02', icon: '03d', tempHigh: 16, tempLow: 11, precipChance: 30, windSpeed: 10 },
          ],
        });
        setIsLoading(false);
      });
  }, [userLocation]);

  const handleLocationChange = (lat: number, lon: number) => {
    setUserLocation({ lat, lon });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mr: 1, ...sx }}>
        <Typography variant="body2" color="inherit">
          Loading weather...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mr: 1, zIndex: 1200, ...sx }}>
      <IconButton onClick={() => setShowForecast(!showForecast)} color="inherit" size="small">
        <img
          src={`/weather-icons/${weather?.icon}.png`}
          alt="Weather icon"
          style={{ width: 24, height: 24 }}
        />
        <Typography variant="body2" sx={{ ml: 0.5 }}>
          {weather?.temp}°C | {weather?.location}
        </Typography>
      </IconButton>
      {showForecast && forecast && (
        <WeatherForecastModal
          forecast={forecast}
          onClose={() => setShowForecast(false)}
          onLocationChange={handleLocationChange}
        />
      )}
    </Box>
  );
};

export default WeatherWidget;