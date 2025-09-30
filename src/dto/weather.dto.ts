import {
	IsString,
	IsNumber,
	IsOptional,
	IsIn,
	Min,
	Max,
} from "class-validator";
import { Type } from "class-transformer";

export class WeatherQueryParams {
	@Type(() => Number)
	@IsNumber()
	@Min(-90)
	@Max(90)
	lat!: number;

	@Type(() => Number)
	@IsNumber()
	@Min(-180)
	@Max(180)
	lon!: number;
}
interface OpenWeatherGeo {
	name: string;
	local_names: {
		[key: string]: string;
	};
	lon: number;
	lat: number;
	country: string;
	state: string;
}
export type GeoResponseDto = OpenWeatherGeo[];

export interface WeatherResponseDto {
	coord: {
		lon: number;
		lat: number;
	};
	weather: Array<{
		id: number;
		main: string;
		description: string;
		icon: string;
	}>;
	base: string;
	main: {
		temp: number;
		feels_like: number;
		temp_min: number;
		temp_max: number;
		pressure: number;
		humidity: number;
		sea_level?: number;
		grnd_level?: number;
	};
	visibility: number;
	wind: {
		speed: number;
		deg: number;
		gust?: number;
	};
	clouds: {
		all: number;
	};
	rain?: {
		"1h"?: number;
		"3h"?: number;
	};
	snow?: {
		"1h"?: number;
		"3h"?: number;
	};
	dt: number;
	sys: {
		type?: number;
		id?: number;
		country: string;
		sunrise: number;
		sunset: number;
	};
	timezone: number;
	id: number;
	name: string;
	cod: number;
}

export interface ForecastResponseDto {
	cod: string;
	message: number;
	cnt: number;
	list: Array<{
		dt: number;
		main: {
			temp: number;
			feels_like: number;
			temp_min: number;
			temp_max: number;
			pressure: number;
			sea_level: number;
			grnd_level: number;
			humidity: number;
			temp_kf: number;
		};
		weather: Array<{
			id: number;
			main: string;
			description: string;
			icon: string;
		}>;
		clouds: {
			all: number;
		};
		wind: {
			speed: number;
			deg: number;
			gust: number;
		};
		visibility: number;
		pop: number;
		rain?: {
			"3h": number;
		};
		snow?: {
			"3h": number;
		};
		sys: {
			pod: string;
		};
		dt_txt: string;
	}>;
	city: {
		id: number;
		name: string;
		coord: {
			lat: number;
			lon: number;
		};
		country: string;
		population: number;
		timezone: number;
		sunrise: number;
		sunset: number;
	};
}

export interface SimplifiedWeatherDto {
	cityName: string;
	country: string;
	lat: number;
	lon: number;

	main: string;
	description: string;

	temperature: number;
	feelsLike: number;
	minTemperature: number;
	maxTemperature: number;

	clouds: number;

	pressure: number;
	humidity: number;

	windSpeed: number;
	windDirection: number;

	fetchedAt: Date;
}

export interface SimplifiedForecastDto {
	location: {
		city: string;
		country: string;
		coord: {
			lat: number;
			lon: number;
		};
	};
	forecasts: Array<{
		timestamp: string;
		date: string;
		time: string;
		weather: {
			main: string;
			description: string;
			icon: string;
		};
		temperature: {
			current: number;
			feels_like: number;
			min: number;
			max: number;
		};
		pressure: number;
		humidity: number;
		wind: {
			speed: number;
			direction: number;
		};
		clouds: number;
		precipitation: number;
		visibility: number;
	}>;
}

export class AddWeatherDataDto {
	@IsString()
	city!: string;

	@IsString()
	country!: string;
}

export class WeatherUpdateDto {
	@IsOptional()
	@IsString()
	main?: string;
	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsNumber()
	temperature?: number;
	@IsOptional()
	@IsNumber()
	feelsLike?: number;
	@IsOptional()
	@IsNumber()
	minTemperature?: number;
	@IsOptional()
	@IsNumber()
	maxTemperature?: number;

	@IsOptional()
	@IsNumber()
	clouds?: number;

	@IsOptional()
	@IsNumber()
	pressure?: number;
	@IsOptional()
	@IsNumber()
	humidity?: number;

	@IsOptional()
	@IsNumber()
	windSpeed?: number;
	@IsOptional()
	@IsNumber()
	windDirection?: number;
}
