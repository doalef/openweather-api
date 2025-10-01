// test/setup.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import AppDataSource from "../src/config/database";

import * as dotenv from "dotenv";
dotenv.config({
	path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

// Global test setup
beforeAll(async () => {
	// Initialize database connection
	if (!AppDataSource.isInitialized) {
		await AppDataSource.initialize();

		// Create test database if it doesn't exist
		// await createTestDatabase();
	}
});

// Clear database before each test
beforeEach(async () => {
	await clearDatabase();
});

// Global teardown
afterAll(async () => {
	if (AppDataSource.isInitialized) {
		await AppDataSource.destroy();
	}
});

/**
 * Create test database if it doesn't exist
 */
async function createTestDatabase(): Promise<void> {
	const tempDataSource = new DataSource({
		type: "postgres",
		host: process.env.DB_HOST,
		port: parseInt(process.env.DB_PORT || "5432"),
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME, // Connect to default database
	});

	await tempDataSource.initialize();

	const dbName = process.env.DB_NAME + 'test';
	const result = await tempDataSource.query(
		`SELECT 1 FROM pg_database WHERE datname = $1`,
		[dbName]
	);

	if (result.length === 0) {
		await tempDataSource.query(`CREATE DATABASE ${dbName}`);
		console.log(`Test database ${dbName} created`);
	}

	await tempDataSource.destroy();
}

/**
 * Clear all data from database tables
 */
export async function clearDatabase(): Promise<void> {
	if (!AppDataSource.isInitialized) return;

	const entities = AppDataSource.entityMetadatas;

	for (const entity of entities) {
		const repository = AppDataSource.getRepository(entity.name);
		await repository.query(`DELETE FROM ${entity.tableName}`);
	}
}

/**
 * Utility function to close database connection
 */
export async function closeDatabase(): Promise<void> {
	if (AppDataSource.isInitialized) {
		await AppDataSource.destroy();
	}
}
