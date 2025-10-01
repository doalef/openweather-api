import { UserRepository } from "../repositories/user.repository";
import { JwtHelperClass, TokenPayload } from "../helpers/jwt";
import { passwordHelper } from "../helpers/password";
import {
	LoginDto,
	RegisterDto,
	AuthResponseDto,
	ChangePasswordDto,
} from "../dto/auth.dto";
import { AppError } from "../utils/appError";

export class AuthService {
	private userRepository: UserRepository;
	private jwtService: JwtHelperClass;
	private passwordService = passwordHelper;

	constructor() {
		this.userRepository = new UserRepository();
		this.jwtService = new JwtHelperClass();
	}

	async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
		// Check if user already exists
		const existingUser = await this.userRepository.findByEmail(
			registerDto.email
		);

		if (existingUser) {
			throw new AppError("Email already exists", 400);
		}

		// Check password strength
		const isStrongPassword = await this.passwordService.isPasswordStrong(
			registerDto.password
		);
		if (!isStrongPassword) {
			throw new AppError(
				"Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
				400
			);
		}

		// Create user
		const user = await this.userRepository.create(registerDto);

		// Generate tokens
		const tokenPayload: TokenPayload = {
			userId: user.id,
			email: user.email,
		};

		const accessToken = this.jwtService.generateAccessToken(tokenPayload);
		const refreshToken = this.jwtService.generateRefreshToken(tokenPayload);

		// Save refresh token to user
		await this.userRepository.update(user.id, {
			refreshToken: refreshToken.token,
		});

		return {
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
			token: accessToken.token,
			refreshToken: refreshToken.token,
			expiresIn: accessToken.expiresIn,
		};
	}

	async login(loginDto: LoginDto): Promise<AuthResponseDto> {
		// Find user by email
		const user = await this.userRepository.findByEmail(loginDto.email);

		if (!user) {
			throw new AppError("Invalid email or password", 401);
		}

		if (!user.isActive) {
			throw new AppError("Account is deactivated", 401);
		}

		// Validate password
		const isValidPassword = await user.validatePassword(loginDto.password);
		if (!isValidPassword) {
			throw new AppError("Invalid email or password", 401);
		}

		// Generate tokens
		const tokenPayload: TokenPayload = {
			userId: user.id,
			email: user.email,
		};

		const accessToken = this.jwtService.generateAccessToken(tokenPayload);
		const refreshToken = this.jwtService.generateRefreshToken(tokenPayload);

		await this.userRepository.update(user.id, {
			refreshToken: refreshToken.token,
		});

		return {
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
			token: accessToken.token,
			refreshToken: refreshToken.token,
			expiresIn: accessToken.expiresIn,
		};
	}

	async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
		if (!refreshToken) {
			throw new AppError("Refresh token is required", 400);
		}

		// Verify refresh token
		let payload: TokenPayload;
		try {
			payload = this.jwtService.verifyRefreshToken(refreshToken);
		} catch (error) {
			throw new AppError("Invalid or expired refresh token", 401);
		}

		// Find user and validate refresh token
		const user = await this.userRepository.findById(payload.userId);
		if (!user || user.refreshToken !== refreshToken || !user.isActive) {
			throw new AppError("Invalid refresh token", 401);
		}

		// Generate new tokens
		const tokenPayload: TokenPayload = {
			userId: user.id,
			email: user.email,
		};

		const accessToken = this.jwtService.generateAccessToken(tokenPayload);
		const newRefreshToken =
			this.jwtService.generateRefreshToken(tokenPayload);

		// Update refresh token in database
		await this.userRepository.update(user.id, {
			refreshToken: newRefreshToken.token,
		});

		return {
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
			token: accessToken.token,
			refreshToken: newRefreshToken.token,
			expiresIn: accessToken.expiresIn,
		};
	}

	async changePassword(
		userId: string,
		changePasswordDto: ChangePasswordDto
	): Promise<{ message: string }> {
		const user = await this.userRepository.findById(userId);
		if (!user) {
			throw new AppError("User not found", 404);
		}

		// Validate current password
		const isValidCurrentPassword = await user.validatePassword(
			changePasswordDto.currentPassword
		);
		if (!isValidCurrentPassword) {
			throw new AppError("Current password is incorrect", 400);
		}

		// Check if new password is strong
		const isStrongPassword = await this.passwordService.isPasswordStrong(
			changePasswordDto.newPassword
		);
		if (!isStrongPassword) {
			throw new AppError(
				"New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
				400
			);
		}

		// Update password
		await this.userRepository.update(userId, {
			password: changePasswordDto.newPassword,
		});

		return { message: "Password changed successfully" };
	}

	async getCurrentUser(userId: string): Promise<{
		id: string;
		name: string;
		email: string;
		isActive: boolean;
		created_at: Date;
	}> {
		const user = await this.userRepository.findById(userId);
		if (!user) {
			throw new AppError("User not found", 404);
		}

		return {
			id: user.id,
			name: user.name,
			email: user.email,
			isActive: user.isActive,
			created_at: user.created_at,
		};
	}
}

export const authService = new AuthService();
