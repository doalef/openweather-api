export class CacheKeys {
	// Weather cache keys
	static cityCoordinates(city: string, country: string): string {
		return `weather:coords:${city.toLowerCase()}:${country.toLowerCase()}`;
	}
	static weatherCurrentByCoords(lat: number, lon: number): string {
		return `weather:current:${lat}:${lon}`;
	}
	static weatherCurrentById(id: string): string {
		return `weather:current:uuid:${id.toLowerCase()}`;
	}

	static weatherCurrent(city: string): string {
		return `weather:current:${city.toLowerCase()}`;
	}

	static weatherForecast(
		city: string,
		units?: string,
		lang?: string
	): string {
		return `weather:forecast:${city.toLowerCase()}:${units || "metric"}:${
			lang || "en"
		}`;
	}

	static weatherForecastByCoords(
		lat: number,
		lon: number,
		units?: string,
		lang?: string
	): string {
		return `weather:forecast:coords:${lat}:${lon}:${units || "metric"}:${
			lang || "en"
		}`;
	}

	// API rate limiting
	static apiRateLimit(apiName: string, identifier: string): string {
		return `rate_limit:${apiName}:${identifier}`;
	}
}
