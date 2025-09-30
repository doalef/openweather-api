import { Router } from "express";
import { weatherController } from "../controllers/weather.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", weatherController.getAllWeather);
router.post("/", weatherController.validateAddWeather, weatherController.addWeather);
export { router as weatherRoutes };
