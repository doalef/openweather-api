import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { validateDto } from "../middlewares/validation.middleware";
import {
	LoginDto,
	RegisterDto,
	ChangePasswordDto,
	ForgotPasswordDto,
	ResetPasswordDto,
} from "../dto/auth.dto";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class AuthController {
	public validateLogin = validateDto(LoginDto);
	public validateRegister = validateDto(RegisterDto);
	public validateChangePassword = validateDto(ChangePasswordDto);
	public validateForgotPassword = validateDto(ForgotPasswordDto);
	public validateResetPassword = validateDto(ResetPasswordDto);

	register = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const result = await authService.register(req.body);

			res.status(201).json({
				success: true,
				data: result,
				message: "User registered successfully",
			});
		} catch (error) {
			next(error);
		}
	};

	login = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const result = await authService.login(req.body);

			res.status(200).json({
				success: true,
				data: result,
				message: "Login successful",
			});
		} catch (error) {
			next(error);
		}
	};

	refreshToken = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const { refreshToken } = req.body;

			if (!refreshToken) {
				throw new Error("Refresh token is required");
			}

			const result = await authService.refreshToken(refreshToken);

			res.status(200).json({
				success: true,
				data: result,
				message: "Token refreshed successfully",
			});
		} catch (error) {
			next(error);
		}
	};

	changePassword = async (
		req: AuthenticatedRequest,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			if (!req.user) {
				throw new Error("User not authenticated");
			}

			const result = await authService.changePassword(
				req.user.userId,
				req.body
			);

			res.status(200).json({
				success: true,
				data: result,
				message: "Password changed successfully",
			});
		} catch (error) {
			next(error);
		}
	};

	getCurrentUser = async (
		req: AuthenticatedRequest,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			if (!req.user) {
				throw new Error("User not authenticated");
			}

			const user = await authService.getCurrentUser(req.user.userId);

			res.status(200).json({
				success: true,
				data: user,
				message: "Current user fetched successfully",
			});
		} catch (error) {
			next(error);
		}
	};
}

export const authController = new AuthController();
