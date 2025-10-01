import { CurrentWeather } from "../../src/entities/currentWeather.entity";

export const createMockCurrentWeather = (
	overrides: Partial<CurrentWeather> = {}
): CurrentWeather => ({
	id: "8807e2c9-ecf5-4154-baaa-d8e690049c32",
	cityName: "London",
	country: "GB",
	lat: 51.5072,
	lon: -0.1276,
	main: "Clouds",
	description: "broken clouds",
	temperature: 10,
	feelsLike: 10,
	minTemperature: 9,
	maxTemperature: 12,
	pressure: 1027,
	humidity: 89,
	windSpeed: 1.03,
	windDirection: 0,
	clouds: 84,
	fetchedAt: new Date("2025-10-01T03:47:58.781Z"),
	createdAt: new Date("2025-10-01T03:47:58.784Z"),
	updatedAt: new Date("2025-10-01T03:47:58.784Z"),
	...overrides,
});

export const createMockWeatherArray = (count: number = 2): CurrentWeather[] => {
	return Array.from({ length: count }, (_, index) =>
		createMockCurrentWeather({
			id: (index + 1).toString(),
			cityName: `City ${index + 1}`,
			temperature: 20 + index,
		})
	);
};
