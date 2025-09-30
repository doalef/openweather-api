export interface WeatherConfig {
  apiKey: string;
  baseURL: string;
  timeout: number;
  defaultUnits: 'metric' | 'imperial' | 'standard';
  defaultLanguage: string;
}

export const weatherConfig: WeatherConfig = {
  apiKey: process.env.OPENWEATHER_API_KEY || 'your-api-key-here',
  baseURL: process.env.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5',
  timeout: parseInt(process.env.WEATHER_API_TIMEOUT || '10000'),
  defaultUnits: 'metric',
  defaultLanguage: 'en'
};