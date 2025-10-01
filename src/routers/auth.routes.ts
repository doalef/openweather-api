import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post(
	"/register",
	authController.validateRegister,
	authController.register
);

router.post("/login", authController.validateLogin, authController.login);

router.post("/refresh-token", authController.refreshToken);

router.post(
	"/change-password",
	authenticate,
	authController.validateChangePassword,
	authController.changePassword
);

router.get("/me", authenticate, authController.getCurrentUser);

export { router as authRoutes };
