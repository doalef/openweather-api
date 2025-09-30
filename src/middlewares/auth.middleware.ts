import { Request, Response, NextFunction } from "express";
import { jwtHelper as jwtService } from "../helpers/jwt";
import { UserRepository } from "../repositories/user.repository";
import { AppError } from "../utils/appError";

export interface AuthenticatedRequest extends Request {
	user?: {
		userId: string;
		email: string;
	};
}

export const authenticate = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			throw new AppError("Access token is required", 401);
		}

		const token = authHeader.substring(7); // Remove 'Bearer ' prefix

		// Verify token
		const payload = jwtService.verifyAccessToken(token);

		// Check if user still exists and is active
		const userRepository = new UserRepository();
		const user = await userRepository.findById(payload.userId);

		if (!user || !user.isActive) {
			throw new AppError("User not found or deactivated", 401);
		}

		// Add user to request
		req.user = payload;
		next();
	} catch (error) {
		if (error instanceof AppError) {
			next(error);
		} else {
			next(new AppError("Invalid or expired token", 401));
		}
	}
};

export const optionalAuthenticate = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return next();
		}

		const token = authHeader.substring(7);

		const payload = jwtService.verifyAccessToken(token);

		const userRepository = new UserRepository();
		const user = await userRepository.findById(payload.userId);

		if (user && user.isActive) {
			req.user = payload;
		}

		next();
	} catch (error) {
		// For optional auth, we don't throw error, just continue without user
		next();
	}
};
