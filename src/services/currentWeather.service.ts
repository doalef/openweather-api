import { SimplifiedWeatherDto, WeatherUpdateDto } from "../dto/weather.dto";
import { CurrentWeatherRepository } from "../repositories/currentWeather.repository";
import { CurrentWeather } from "../entities/currentWeather.entity";
import { isUUID } from "class-validator";
import { AppError } from "../utils/appError";

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

	async getById(id: string): Promise<{ weatherData: CurrentWeather | null }> {
		if (!isUUID(id)) throw new AppError("Invalid id", 400);
		const result = await this.weatherRepository.findById(id);

		return {
			weatherData: result,
		};
	}

	async updateWeather(
		id: string,
		weatherUpdate: WeatherUpdateDto
	): Promise<{ weatherData: CurrentWeather | null }> {
		if (!isUUID(id)) throw new AppError("Invalid id", 400);
		const exists = this.weatherRepository.exists(id);

		if (!exists) throw new AppError("Weather was not found", 404);

		let result = await this.weatherRepository.update(id, weatherUpdate);

		return { weatherData: result };
	}

	async deleteWeather(
		id: string
	): Promise<boolean> {
		if (!isUUID(id)) throw new AppError("Invalid id", 400);
		const exists = this.weatherRepository.exists(id);

		if (!exists) throw new AppError("Weather was not found", 404);

		let result = await this.weatherRepository.delete(id);

		return result;
	}
}

export const currentWeatherService = new CurrentWeatherService();
