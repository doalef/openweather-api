import { redisService } from "../services/redis.service";

export function Cacheable(
	keyGenerator: (...args: any[]) => string,
	ttl?: number
) {
	return function (
		target: any,
		propertyName: string,
		descriptor: PropertyDescriptor
	) {
		const method = descriptor.value;

		descriptor.value = async function (...args: any[]) {
			const cacheKey = keyGenerator(...args);

			try {
				// Try to get from cache first
				const cached = await redisService.get(cacheKey);
				if (cached !== null) {
					console.log(`Cache hit for key: ${cacheKey}`);
					return cached;
				}

				// Cache miss, execute original method
				console.log(`Cache miss for key: ${cacheKey}`);
				const result = await method.apply(this, args);

				// Cache the result
				if (result !== undefined && result !== null) {
					await redisService.set(cacheKey, result, ttl);
				}

				return result;
			} catch (error) {
				// If caching fails, still execute the original method
				console.error("Cache error, executing original method:", error);
				return method.apply(this, args);
			}
		};

		return descriptor;
	};
}

export function CacheEvict(
	keyGenerator: (...args: any[]) => string | string[]
) {
	return function (
		target: any,
		propertyName: string,
		descriptor: PropertyDescriptor
	) {
		const method = descriptor.value;

		descriptor.value = async function (...args: any[]) {
			const result = await method.apply(this, args);

			try {
				const keys = keyGenerator(...args);
				const keysToDelete = Array.isArray(keys) ? keys : [keys];

				for (const key of keysToDelete) {
					await redisService.delete(key);
					console.log(`Cache evicted for key: ${key}`);
				}
			} catch (error) {
				console.error("Cache eviction error:", error);
			}

			return result;
		};

		return descriptor;
	};
}
