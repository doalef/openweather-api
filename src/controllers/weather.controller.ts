import { Request, Response, NextFunction } from "express";
import { validateDto } from "../middlewares/validation.middleware";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { AddWeatherDataDto } from "../dto/weather.dto";
import { weatherService } from "../services/openweather.service";
import { currentWeatherService } from "../services/currentWeather.service";

export class WeatherController {
	public validateAddWeather = validateDto(AddWeatherDataDto);

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
			console.log(result)
			res.status(200).json({
				success: true,
				data: result,
				message: "",
			});
		} catch (error) {
			next(error);
		}
	};
}

export const weatherController = new WeatherController();
