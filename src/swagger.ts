import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import OpenAIJson from "./openai";

export const setupSwagger = (app: Express): void => {
	app.use(
		"/api-docs",
		swaggerUi.serve,
		swaggerUi.setup(OpenAIJson, {
			explorer: true,
			customCss: ".swagger-ui .topbar { display: none }",
			customSiteTitle: "API Documentation",
		})
	);
};
