import { Request, Response, NextFunction } from "express";
import { validateDto } from "../middlewares/validation.middleware";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { AddWeatherDataDto, WeatherUpdateDto } from "../dto/weather.dto";
import { weatherService } from "../services/openweather.service";
import { currentWeatherService } from "../services/currentWeather.service";
import { AppError } from "../utils/appError";

export class WeatherController {
	public validateAddWeather = validateDto(AddWeatherDataDto);
	public validateUpdateWeather = validateDto(WeatherUpdateDto);

	addWeather = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const { city, country } = req.body;

			const coordinates = await weatherService.getGeolocation(
				city,
				country
			);
			const currentWeatherDto = await weatherService.getCurrentWeather(
				coordinates.lat,
				coordinates.lon
			);
			const result = await currentWeatherService.create(
				currentWeatherDto
			);

			res.status(200).json({
				success: true,
				data: result,
				message: "Weather data added successfuly",
			});
		} catch (error) {
			next(error);
		}
	};

	getAllWeather = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const result = await currentWeatherService.getAll();
			console.log(result);
			res.status(200).json({
				success: true,
				data: result,
				message: "",
			});
		} catch (error) {
			next(error);
		}
	};

	getWeather = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const { id } = req.params;
			const result = await currentWeatherService.getById(id);

			if (!result.weatherData)
				throw new AppError("Weather data was not found", 404);

			res.status(200).json({
				success: true,
				data: result,
				message: "",
			});
		} catch (error) {
			next(error);
		}
	};

	updateWeather = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const { id } = req.params;
			const result = await currentWeatherService.updateWeather(
				id,
				req.body as WeatherUpdateDto
			);

			if (!result.weatherData)
				throw new AppError("Weather data was not found", 404);

			res.status(200).json({
				success: true,
				data: result,
				message: "",
			});
		} catch (error) {
			next(error);
		}
	};

	deleteWeather = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const { id } = req.params;
			const result = await currentWeatherService.deleteWeather(id);

			res.status(200).json({
				success: true,
				message: "weather data deleted",
			});
		} catch (error) {
			next(error);
		}
	};
}

export const weatherController = new WeatherController();
