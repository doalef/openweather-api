import { Repository, Like, FindManyOptions } from "typeorm";
import { AppDataSource } from "../config/database";
import { User } from "../entities/user.entity";
import { JwtHelperClass } from "../helpers/jwt";

export class UserRepository {
	private repository: Repository<User>;
	private jwtHelper: JwtHelperClass;

	constructor() {
		this.repository = AppDataSource.getRepository(User);
		this.jwtHelper = new JwtHelperClass();
	}

	async findAll(): Promise<{ users: User[]; total: number }> {
		const options: FindManyOptions<User> = {
			order: { created_at: "DESC" },
		};

		const [users, total] = await this.repository.findAndCount(options);
		return { users, total };
	}

	async findById(id: string): Promise<User | null> {
		return this.repository.findOne({
			where: { id },
		});
	}

	async findByEmail(email: string): Promise<User | null> {
		return this.repository.findOne({ where: { email } });
	}

	async create(userData: Partial<User>): Promise<User> {
		const user = this.repository.create(userData);
		return this.repository.save(user);
	}

	async exists(id: string): Promise<boolean> {
		const count = await this.repository.count({ where: { id } });
		return count > 0;
	}

	async update(id: string, userData: Partial<User>): Promise<User | null> {
		await this.repository.update(id, userData);
		return this.findById(id);
	}
}
