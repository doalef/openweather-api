import { Router } from "express";
import { weatherController } from "../controllers/weather.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/:id", weatherController.getWeather);
router.get("/", weatherController.getAllWeather);
router.post(
	"/",
	authenticate,
	weatherController.validateAddWeather,
	weatherController.addWeather
);
router.put(
	"/:id",
	authenticate,
	weatherController.validateUpdateWeather,
	weatherController.updateWeather
);
router.delete("/:id", authenticate, weatherController.deleteWeather);

export { router as weatherRoutes };
