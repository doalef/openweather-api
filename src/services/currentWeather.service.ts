import { SimplifiedWeatherDto } from "../dto/weather.dto";
import { CurrentWeatherRepository } from "../repositories/currentWeather.repository";
import { CurrentWeather } from "../entities/currentWeather.entity";

export class CurrentWeatherService {
	private weatherRepository: CurrentWeatherRepository;

	constructor() {
		this.weatherRepository = new CurrentWeatherRepository();
	}

	async create(
		weatherDto: SimplifiedWeatherDto
	): Promise<{ weatherData: CurrentWeather }> {
		const weatherData = await this.weatherRepository.create(weatherDto);

		return {
			weatherData,
		};
	}

	async getAll(): Promise<{ weatherData: CurrentWeather[] }> {
		const result = await this.weatherRepository.findAll();

		return {
			weatherData: result,
		};
	}
}

export const currentWeatherService = new CurrentWeatherService();
