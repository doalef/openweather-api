import * as dotenv from "dotenv";
import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";
import { CurrentWeather } from "../entities/currentWeather.entity";

dotenv.config({
	path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME, NODE_ENV } = process.env;
const AppDataSource = new DataSource({
	type: "postgres",
	host: DB_HOST,
	port: Number(DB_PORT),
	username: DB_USER,
	password: DB_PASS,
	database: DB_NAME,
	entities: [User, CurrentWeather],

	migrations: ["../migrations/*.{js,ts}"],
	migrationsRun: false,
	synchronize: true,

	logging: NODE_ENV === "development" ? ["migration", "error"] : false,
});

export default AppDataSource;
