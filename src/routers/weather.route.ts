import { Router } from "express";
import { weatherController } from "../controllers/weather.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post(
	"/",
	authenticate,
	weatherController.validateAddWeather,
	weatherController.addWeather
);

router.get("/:id", weatherController.getWeather);

router.get("/latest/:city", weatherController.getLatestByCity);

router.get("/", weatherController.getAllWeather);

router.put(
	"/:id",
	authenticate,
	weatherController.validateUpdateWeather,
	weatherController.updateWeather
);

router.delete("/:id", authenticate, weatherController.deleteWeather);

export { router as weatherRoutes };
