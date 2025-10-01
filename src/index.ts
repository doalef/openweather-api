import express from "express";
import dotenv from "dotenv";
import "reflect-metadata";
import AppDataSource from "./config/database";
import { authRoutes } from "./routers/auth.routes";
import { errorHandler } from "./middlewares/error.middleware";
import { weatherRoutes } from "./routers/weather.route";
import { setupSwagger } from "./swagger";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/weather", weatherRoutes);

// Setup Swagger
setupSwagger(app);

// Error handling
app.use(errorHandler);

AppDataSource.initialize()
	.then(() => {
		console.log("Database connected");
		app.listen(port, () => {
			console.log(`Server running on port ${port}`);
		});
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
