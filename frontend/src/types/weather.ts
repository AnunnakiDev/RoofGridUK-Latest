export interface WeatherWidgetData {
    icon: string; // Now holds weather-icons classes (e.g., "wi-day-sunny")
    temp: number;
    windSpeed: number;
    location: string;
  }
  
  export interface ForecastDay {
    date: string;
    icon: string;
    tempHigh: number;
    tempLow: number;
    precipChance: number;
    windSpeed: number;
  }
  
  export interface WeatherForecast {
    days: ForecastDay[];
  }