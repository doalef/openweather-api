import { Repository, Like, FindManyOptions } from "typeorm";
import { AppDataSource } from "../config/database";
import { CurrentWeather } from "../entities/currentWeather.entity";

export class CurrentWeatherRepository {
	private repository: Repository<CurrentWeather>;

	constructor() {
		this.repository = AppDataSource.getRepository(CurrentWeather);
	}

	async findAll(): Promise<CurrentWeather[]> {
		const options: FindManyOptions<CurrentWeather> = {
			order: { createdAt: "DESC" },
		};

		const [weatherData] = await this.repository.findAndCount(options);
		return weatherData;
	}

	async findById(id: string): Promise<CurrentWeather | null> {
		return this.repository.findOne({
			where: { id },
		});
	}

	async create(
		weatherData: Partial<CurrentWeather>
	): Promise<CurrentWeather> {
		const user = this.repository.create(weatherData);
		return this.repository.save(user);
	}

	async exists(id: string): Promise<boolean> {
		const count = await this.repository.count({ where: { id } });
		return count > 0;
	}

	async update(
		id: string,
		userData: Partial<CurrentWeather>
	): Promise<CurrentWeather | null> {
		await this.repository.update(id, userData);
		return this.findById(id);
	}

	async delete(id: string): Promise<boolean> {
		const result = await this.repository.delete(id);
		return !!(result.affected && result.affected > 0);
	}
}
