import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { weatherConfig, WeatherConfig } from "../config/weather";
import {
	WeatherResponseDto,
	ForecastResponseDto,
	SimplifiedWeatherDto,
	SimplifiedForecastDto,
	WeatherQueryParams,
	GeoResponseDto,
} from "../dto/weather.dto";
import { AppError } from "../utils/appError";
import { Cacheable } from "../decorators/cache.decorator";
import { CacheKeys } from "../utils/cacheKeys";

export class WeatherService {
	private client: AxiosInstance;
	private config: WeatherConfig;

	constructor() {
		this.config = weatherConfig;

		if (!this.config.apiKey) {
			throw new Error(
				"OpenWeatherMap API key is required. Please set OPENWEATHER_API_KEY environment variable."
			);
		}

		this.client = axios.create({
			baseURL: this.config.baseURL,
			timeout: this.config.timeout,
			params: {
				appid: this.config.apiKey,
				units: this.config.defaultUnits,
				lang: this.config.defaultLanguage,
			},
		});

		this.setupInterceptors();
	}

	private setupInterceptors(): void {
		// Request interceptor
		this.client.interceptors.request.use(
			(config) => {
				console.log(
					`Making ${config.method?.toUpperCase()} request to ${
						config.url
					}`
				);
				return config;
			},
			(error: AxiosError) => {
				return Promise.reject(error);
			}
		);

		// Response interceptor
		this.client.interceptors.response.use(
			(response: AxiosResponse) => {
				return response;
			},
			(error: AxiosError) => {
				return this.handleWeatherError(error);
			}
		);
	}

	private handleWeatherError(error: AxiosError): Promise<never> {
		if (error.response) {
			const status = error.response.status;
			const data = error.response.data as any;

			switch (status) {
				case 400:
					throw new AppError("Invalid request parameters", 400, data);
				case 401:
					throw new AppError("Invalid API key", 401);
				case 404:
					throw new AppError("City not found", 404);
				case 429:
					throw new AppError("API rate limit exceeded", 429);
				case 500:
				case 502:
				case 503:
				case 504:
					throw new AppError(
						"Weather service is temporarily unavailable",
						503
					);
				default:
					throw new AppError(
						`Weather API error: ${
							data?.message || "Unknown error"
						}`,
						status
					);
			}
		} else if (error.request) {
			throw new AppError("Unable to connect to weather service", 503);
		} else {
			throw new AppError("Weather service configuration error", 500);
		}
	}
	@Cacheable((city: string, country: string) => {
		return CacheKeys.cityCoordinates(city, country);
	}, 6000)
	async getGeolocation(
		city: string,
		country: string
	): Promise<{ lat: number; lon: number }> {
		try {
			let endpoint = "/geo/1.0/direct";
			const requestParams: any = {
				q: `${city},${country}`,
			};

			const response: AxiosResponse<GeoResponseDto> =
				await this.client.get(endpoint, { params: requestParams });

			if (!response.data.length)
				throw new AppError("Location does not exist", 400);

			return { lat: response.data[0].lat, lon: response.data[0].lon };
		} catch (error) {
			if (error instanceof AppError) {
				throw error;
			}
			throw new AppError("Failed to fetch weather data", 500);
		}
	}

	@Cacheable((lat: number, lon: number) => {
		return CacheKeys.weatherCurrentByCoords(lat, lon);
	}, 600)
	async getCurrentWeather(
		lat: number,
		lon: number
	): Promise<SimplifiedWeatherDto> {
		try {
			let endpoint = "/data/2.5/weather";
			const requestParams: any = {
				lat: lat,
				lon: lon,
			};

			const response: AxiosResponse<WeatherResponseDto> =
				await this.client.get(endpoint, { params: requestParams });

			return this.transformWeatherResponse(response.data);
		} catch (error) {
			if (error instanceof AppError) {
				throw error;
			}
			throw new AppError("Failed to fetch weather data", 500);
		}
	}

	private transformWeatherResponse(
		data: WeatherResponseDto
	): SimplifiedWeatherDto {
		return {
			cityName: data.name,
			country: data.sys.country,
			lat: data.coord.lat,
			lon: data.coord.lon,

			main: data.weather[0].main,
			description: data.weather[0].description,

			temperature: Math.round(data.main.temp),
			feelsLike: Math.round(data.main.feels_like),
			minTemperature: Math.round(data.main.temp_min),
			maxTemperature: Math.round(data.main.temp_max),

			clouds: data.clouds.all,

			pressure: data.main.pressure,
			humidity: data.main.humidity,

			windSpeed: data.wind.speed,
			windDirection: data.wind.deg,

			fetchedAt: new Date(),
		};
	}

	private transformForecastResponse(
		data: ForecastResponseDto
	): SimplifiedForecastDto {
		return {
			location: {
				city: data.city.name,
				country: data.city.country,
				coord: {
					lat: data.city.coord.lat,
					lon: data.city.coord.lon,
				},
			},
			forecasts: data.list.map((item) => {
				const date = new Date(item.dt * 1000);
				return {
					timestamp: date.toISOString(),
					date: date.toLocaleDateString(),
					time: date.toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					}),
					weather: {
						main: item.weather[0].main,
						description: item.weather[0].description,
						icon: item.weather[0].icon,
					},
					temperature: {
						current: Math.round(item.main.temp),
						feels_like: Math.round(item.main.feels_like),
						min: Math.round(item.main.temp_min),
						max: Math.round(item.main.temp_max),
					},
					pressure: item.main.pressure,
					humidity: item.main.humidity,
					wind: {
						speed: item.wind.speed,
						direction: item.wind.deg,
					},
					clouds: item.clouds.all,
					precipitation: item.pop * 100, // Convert to percentage
					visibility: item.visibility / 1000, // Convert to km
				};
			}),
		};
	}

	// Utility methods
	getWeatherIconUrl(
		iconCode: string,
		size: "1x" | "2x" | "4x" = "2x"
	): string {
		const sizeMap = {
			"1x": "",
			"2x": "@2x",
			"4x": "@4x",
		};

		return `https://openweathermap.org/img/wn/${iconCode}${sizeMap[size]}.png`;
	}

	kelvinToCelsius(kelvin: number): number {
		return kelvin - 273.15;
	}

	kelvinToFahrenheit(kelvin: number): number {
		return ((kelvin - 273.15) * 9) / 5 + 32;
	}

	metersPerSecondToKmh(mps: number): number {
		return mps * 3.6;
	}

	metersPerSecondToMph(mps: number): number {
		return mps * 2.237;
	}
}

export const weatherService = new WeatherService();
