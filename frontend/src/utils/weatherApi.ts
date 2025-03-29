import axios, { AxiosError } from 'axios';
import { WeatherWidgetData, WeatherForecast } from '../types/weather';

export async function fetchWeatherData(lat: number, lon: number): Promise<{ widget: WeatherWidgetData; forecast: WeatherForecast }> {
  const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
  if (!apiKey) throw new Error('OpenWeather API key missing');

  try {
    // Fetch current weather
    const currentResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    const currentData = currentResponse.data;

    // Fetch 5-day forecast
    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    const forecastData = forecastResponse.data;

    const widget: WeatherWidgetData = {
      icon: currentData.weather[0].icon, // Use OpenWeatherMap icon code (e.g., "01d")
      temp: Math.round(currentData.main.temp),
      windSpeed: Math.round(currentData.wind.speed * 2.237), // m/s to mph
      location: currentData.name || 'London',
    };

    // Process 5-day forecast (take one entry per day, e.g., at 12:00)
    const dailyForecasts: WeatherForecast['days'] = [];
    const seenDates = new Set<string>();
    for (const entry of forecastData.list) {
      const date = entry.dt_txt.split(' ')[0]; // e.g., "2025-03-29"
      if (!seenDates.has(date) && entry.dt_txt.includes('12:00:00')) {
        seenDates.add(date);
        dailyForecasts.push({
          date,
          icon: entry.weather[0].icon, // Use OpenWeatherMap icon code
          tempHigh: Math.round(entry.main.temp_max),
          tempLow: Math.round(entry.main.temp_min),
          precipChance: entry.pop * 100,
          windSpeed: Math.round(entry.wind.speed * 2.237),
        });
      }
      if (seenDates.size === 5) break; // Stop after 5 days
    }

    const forecast: WeatherForecast = { days: dailyForecasts };
    return { widget, forecast };
  } catch (err) {
    if (err instanceof AxiosError) {
      console.error('OpenWeather API error:', err.response?.data || err.message);
    } else if (err instanceof Error) {
      console.error('OpenWeather API error:', err.message);
    } else {
      console.error('OpenWeather API error:', String(err));
    }
    throw err;
  }
}