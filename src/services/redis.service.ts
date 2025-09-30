import Redis from "ioredis";
import { redisConfig, RedisConfig } from "../config/redis";
import { AppError } from "../utils/appError";

export class RedisService {
	private client: Redis;
	private config: RedisConfig;

	constructor() {
		this.config = redisConfig;

		this.client = new Redis({
			host: this.config.host,
			port: this.config.port,
			password: this.config.password,
			db: this.config.db,
			keyPrefix: this.config.keyPrefix,
			maxRetriesPerRequest: 3,
			lazyConnect: true,
		});

		this.setupEventListeners();
	}

	private setupEventListeners(): void {
		this.client.on("connect", () => {
			console.log("Redis client connected");
		});

		this.client.on("error", (error) => {
			console.error("Redis client error:", error);
		});

		this.client.on("close", () => {
			console.log("Redis client connection closed");
		});

		this.client.on("reconnecting", () => {
			console.log("Redis client reconnecting...");
		});
	}

	async connect(): Promise<void> {
		try {
			await this.client.connect();
		} catch (error) {
			console.error("Failed to connect to Redis:", error);
			throw new AppError("Redis connection failed", 500);
		}
	}

	async disconnect(): Promise<void> {
		await this.client.quit();
	}

	async set(key: string, value: any, ttl?: number): Promise<void> {
		try {
			const serializedValue = JSON.stringify(value);
			const actualTtl = ttl || this.config.ttl;

			if (actualTtl > 0) {
				await this.client.setex(key, actualTtl, serializedValue);
			} else {
				await this.client.set(key, serializedValue);
			}
		} catch (error) {
			console.error("Redis set error:", error);
			throw new AppError("Failed to cache data", 500);
		}
	}

	async get<T>(key: string): Promise<T | null> {
		try {
			const value = await this.client.get(key);
			if (!value) return null;

			return JSON.parse(value) as T;
		} catch (error) {
			console.error("Redis get error:", error);
			return null;
		}
	}

	async delete(key: string): Promise<boolean> {
		try {
			const result = await this.client.del(key);
			return result > 0;
		} catch (error) {
			console.error("Redis delete error:", error);
			return false;
		}
	}

	async exists(key: string): Promise<boolean> {
		try {
			const result = await this.client.exists(key);
			return result === 1;
		} catch (error) {
			console.error("Redis exists error:", error);
			return false;
		}
	}

	async mget<T>(keys: string[]): Promise<(T | null)[]> {
		try {
			const values = await this.client.mget(...keys);
			return values.map((value) =>
				value ? (JSON.parse(value) as T) : null
			);
		} catch (error) {
			console.error("Redis mget error:", error);
			return keys.map(() => null);
		}
	}

	async mset(keyValuePairs: [string, any][], ttl?: number): Promise<void> {
		try {
			const pipeline = this.client.pipeline();
			const actualTtl = ttl || this.config.ttl;

			keyValuePairs.forEach(([key, value]) => {
				const serializedValue = JSON.stringify(value);
				if (actualTtl > 0) {
					pipeline.setex(key, actualTtl, serializedValue);
				} else {
					pipeline.set(key, serializedValue);
				}
			});

			await pipeline.exec();
		} catch (error) {
			console.error("Redis mset error:", error);
			throw new AppError("Failed to cache multiple items", 500);
		}
	}

	async keys(pattern: string): Promise<string[]> {
		try {
			return await this.client.keys(pattern);
		} catch (error) {
			console.error("Redis keys error:", error);
			return [];
		}
	}

	async deletePattern(pattern: string): Promise<number> {
		try {
			const matchingKeys = await this.keys(pattern);
			if (matchingKeys.length === 0) return 0;

			const result = await this.client.del(...matchingKeys);
			return result;
		} catch (error) {
			console.error("Redis deletePattern error:", error);
			return 0;
		}
	}

	async ttl(key: string): Promise<number> {
		try {
			return await this.client.ttl(key);
		} catch (error) {
			console.error("Redis ttl error:", error);
			return -2; // Key doesn't exist
		}
	}

	async expire(key: string, ttl: number): Promise<boolean> {
		try {
			const result = await this.client.expire(key, ttl);
			return result === 1;
		} catch (error) {
			console.error("Redis expire error:", error);
			return false;
		}
	}

	async flushAll(): Promise<void> {
		try {
			await this.client.flushall();
		} catch (error) {
			console.error("Redis flushAll error:", error);
			throw new AppError("Failed to flush cache", 500);
		}
	}

	// Health check
	async ping(): Promise<boolean> {
		try {
			const result = await this.client.ping();
			return result === "PONG";
		} catch (error) {
			console.error("Redis ping error:", error);
			return false;
		}
	}

	// Get client for advanced operations
	getClient(): Redis {
		return this.client;
	}
}

export const redisService = new RedisService();
