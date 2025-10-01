import express from "express";
import dotenv from "dotenv";
import "reflect-metadata";
import AppDataSource from "./config/database";
import { authRoutes } from "./routers/auth.routes";
import { errorHandler } from "./middlewares/error.middleware";
import { weatherRoutes } from "./routers/weather.route";
import { setupSwagger } from "./swagger";

dotenv.config({
	path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/weather", weatherRoutes);

setupSwagger(app);

// Error handling
app.use(errorHandler);

// 404 Handler
app.use("*", (req, res) => {
	res.status(404).json({
		success: false,
		message: `Route ${req.originalUrl} not found`,
	});
});

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
