import React, { createContext, useContext, useState, useEffect } from 'react';

interface WeatherContextType {
  refreshWeather: boolean;
  clearWeatherCache: () => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refreshWeather, setRefreshWeather] = useState(false);

  const clearWeatherCache = () => {
    localStorage.removeItem('weatherCache');
    setRefreshWeather((prev) => !prev); // Toggle to trigger refresh in WeatherWidget
  };

  return (
    <WeatherContext.Provider value={{ refreshWeather, clearWeatherCache }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};