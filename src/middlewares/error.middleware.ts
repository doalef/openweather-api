import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

export const errorHandler = (
	error: Error | AppError,
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	if (error instanceof AppError) {
		res.status(error.statusCode).json({
			success: false,
			message: error.message,
			details: error.details,
			stack:
				process.env.NODE_ENV === "development"
					? error.stack
					: undefined,
		});
	} else {
		// Log unexpected errors
		console.error("Unexpected error:", error);

		res.status(500).json({
			success: false,
			message: "Internal server error",
			stack:
				process.env.NODE_ENV === "development"
					? error.stack
					: undefined,
		});
	}
};
