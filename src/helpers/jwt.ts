import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt";

export interface TokenPayload {
	userId: string;
	email: string;
}

export interface TokenResponse {
	token: string;
	expiresIn: number;
}

export class JwtHelperClass {
	private readonly secret: string;
	private readonly expiresIn: string;
	private readonly refreshSecret: string;
	private readonly refreshExpiresIn: string;

	constructor() {
		this.secret = jwtConfig.secret;
		this.expiresIn = jwtConfig.expiresIn;
		this.refreshSecret = jwtConfig.refreshSecret;
		this.refreshExpiresIn = jwtConfig.refreshExpiresIn;
	}

	generateAccessToken(payload: TokenPayload): TokenResponse {
		const token = jwt.sign(payload, this.secret, {
			expiresIn: this.expiresIn,
		});

		const decoded = jwt.decode(token) as { exp: number };
		const expiresIn = decoded.exp;

		return { token, expiresIn };
	}

	generateRefreshToken(payload: TokenPayload): TokenResponse {
		const token = jwt.sign(payload, this.refreshSecret, {
			expiresIn: this.refreshExpiresIn,
		});

		const decoded = jwt.decode(token) as { exp: number };
		const expiresIn = decoded.exp;

		return { token, expiresIn };
	}

	verifyAccessToken(token: string): TokenPayload {
		try {
			return jwt.verify(token, this.secret) as TokenPayload;
		} catch (error) {
			throw new Error("Invalid or expired access token");
		}
	}

	verifyRefreshToken(token: string): TokenPayload {
		try {
			return jwt.verify(token, this.refreshSecret) as TokenPayload;
		} catch (error) {
			throw new Error("Invalid or expired refresh token");
		}
	}

	decodeToken(token: string): TokenPayload | null {
		try {
			return jwt.decode(token) as TokenPayload;
		} catch (error) {
			return null;
		}
	}
}

export const jwtHelper = new JwtHelperClass();
