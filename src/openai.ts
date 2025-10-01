export default {
	openapi: "3.0.0",
	info: {
		title: "Express API with Swagger",
		version: "1.0.0",
		description: "Express application for OpenWeather API",
		contact: { name: "API Support", email: "amirali.binq@gmail.com" },
	},
	servers: [
		{ url: "http://localhost:3000", description: "Development server" },
	],
	components: {
		securitySchemes: {
			bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
		},
		schemas: {
			User: {
				type: "object",
				properties: {
					id: {
						type: "string",
						description: "The auto-generated id of the user",
					},
					name: { type: "string", description: "The user name" },
					email: { type: "string", description: "The user email" },
					isActive: { type: "boolean", description: "User state" },
					createdAt: {
						type: "date",
						description: "User registeration date",
					},
				},
				example: {
					id: "0575db2a-4ac9-4015-a9ab-1624d8da3eb9",
					name: "John Doe",
					email: "doe@gmail.com",
					isActive: true,
					created_at: "2025-09-29T16:22:40.983Z",
				},
			},
			SimplifiedUser: {
				type: "object",
				required: ["name", "email"],
				properties: {
					id: {
						type: "string",
						description: "The auto-generated id of the user",
					},
					name: { type: "string", description: "The user name" },
					email: { type: "string", description: "The user email" },
				},
				example: {
					id: "d5fE_asz",
					name: "John Doe",
					email: "john@example.com",
				},
			},
			PartialCurrentWeather: {
				type: "object",
				properties: {
					main: { type: "string", example: "Clear" },
					description: { type: "string", example: "clear sky" },
					temperature: { type: "number", example: 19 },
					feelsLike: { type: "number", example: 18 },
					minTemperature: { type: "number", example: 18 },
					maxTemperature: { type: "number", example: 20 },
					pressure: { type: "number", example: 1025 },
					humidity: { type: "number", example: 52 },
					windSpeed: { type: "number", example: 1.54 },
					windDirection: { type: "number", example: 210 },
					clouds: { type: "number", example: 10 },
				},
			},
			CurrentWeather: {
				type: "object",
				properties: {
					cityName: { type: "string", example: "London" },
					country: { type: "string", example: "GB" },
					lat: { type: "number", example: 51.5072 },
					lon: { type: "number", example: -0.1276 },
					main: { type: "string", example: "Clear" },
					description: { type: "string", example: "clear sky" },
					temperature: { type: "number", example: 19 },
					feelsLike: { type: "number", example: 18 },
					minTemperature: { type: "number", example: 18 },
					maxTemperature: { type: "number", example: 20 },
					pressure: { type: "number", example: 1025 },
					humidity: { type: "number", example: 52 },
					windSpeed: { type: "number", example: 1.54 },
					windDirection: { type: "number", example: 210 },
					clouds: { type: "number", example: 10 },
					fetchedAt: {
						type: "date",
						example: "2025-09-30T17:14:26.292Z",
					},
					userId: null,
					id: {
						type: "string",
						example: "32621339-7d9d-41d6-95a1-4efa866664c5",
					},
					createdAt: {
						type: "date",
						example: "2025-09-30T13:44:29.962Z",
					},
					updatedAt: {
						type: "date",
						example: "2025-09-30T13:44:29.962Z",
					},
				},
			},
			Error: {
				type: "object",
				properties: {
					message: { type: "string" },
					success: { type: "boolean", example: "false" },
				},
			},
			Error400: {
				type: "object",
				properties: {
					message: { type: "string" },
					success: { type: "boolean", example: "false" },
					details: { type: "array", items: { type: "object" } },
				},
			},
		},
	},
	security: [{ bearerAuth: [] }],
	paths: {
		"/api/auth/register": {
			post: {
				summary: "User Registeration",
				tags: ["Authentication"],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								required: ["name", "email", "password"],
								properties: {
									name: {
										type: "string",
										example: "John Doe",
									},
									email: {
										type: "string",
										example: "john@example.com",
									},
									password: {
										type: "string",
										example: "dfA33@za",
									},
								},
							},
						},
					},
				},
				responses: {
					"200": {
						description: "Success",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										success: {
											type: "boolean",
											example: true,
										},
										data: {
											type: "object",
											$ref: "#/components/schemas/SimplifiedUser",
										},
										token: {
											type: "string",
											example:
												"yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNTc1ZGIyYS00YWM5LTQwMTUtYTlhYi0xNjI0ZDhkYTNlYjkiLCJlbWFpbCI6IkltYW1IYWRpQGdtYWlsLmN1bSIsImlhdCI6MTc1OTI2NjM3MSwiZXhwIjoxNzU5MjY5OTcxfQ.btPJRt7HGMXwaWSj72N_ci1f9OfrA1ysCbaPlq-nBMs",
										},
										refreshToken: {
											type: "string",
											example:
												"yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNTc1ZGIyYS00YWM5LTQwMTUtYTlhYi0xNjI0ZDhkYTNlYjkiLCJlbWFpbCI6IkltYW1IYWRpQGdtYWlsLmN1bSIsImlhdCI6MTc1OTI2NjM3MSwiZXhwIjoxNzU5MjY5OTcxfQ.btPJRt7HGMXwaWSj72N_ci1f9OfrA1ysCbaPlq-nBMs",
										},
										expiresIn: {
											type: "number",
											example: 1759269971,
										},
									},
								},
							},
						},
					},
					"400": {
						description: "Server error",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/Error400",
								},
							},
						},
					},
					"500": {
						description: "Server error",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Error" },
							},
						},
					},
				},
			},
		},
		"/api/auth/login": {
			post: {
				summary: "User Login",
				tags: ["Authentication"],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								required: ["email", "password"],
								properties: {
									email: {
										type: "string",
										example: "john@example.com",
									},
									password: {
										type: "string",
										example: "dfA33@za",
									},
								},
							},
						},
					},
				},
				responses: {
					"200": {
						description: "Success",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										success: {
											type: "boolean",
											example: true,
										},
										data: {
											type: "object",
											$ref: "#/components/schemas/SimplifiedUser",
										},
										token: {
											type: "string",
											example:
												"yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNTc1ZGIyYS00YWM5LTQwMTUtYTlhYi0xNjI0ZDhkYTNlYjkiLCJlbWFpbCI6IkltYW1IYWRpQGdtYWlsLmN1bSIsImlhdCI6MTc1OTI2NjM3MSwiZXhwIjoxNzU5MjY5OTcxfQ.btPJRt7HGMXwaWSj72N_ci1f9OfrA1ysCbaPlq-nBMs",
										},
										refreshToken: {
											type: "string",
											example:
												"yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNTc1ZGIyYS00YWM5LTQwMTUtYTlhYi0xNjI0ZDhkYTNlYjkiLCJlbWFpbCI6IkltYW1IYWRpQGdtYWlsLmN1bSIsImlhdCI6MTc1OTI2NjM3MSwiZXhwIjoxNzU5MjY5OTcxfQ.btPJRt7HGMXwaWSj72N_ci1f9OfrA1ysCbaPlq-nBMs",
										},
										expiresIn: {
											type: "number",
											example: 1759269971,
										},
									},
								},
							},
						},
					},
					"400": {
						description: "Server error",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/Error400",
								},
							},
						},
					},
					"500": {
						description: "Server error",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Error" },
							},
						},
					},
				},
			},
		},
		"/api/auth/refresh-token": {
			post: {
				summary: "Refresh Token",
				tags: ["Authentication"],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								required: ["refreshToken"],
								properties: {
									refreshToken: {
										type: "string",
										example:
											"yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNTc1ZGIyYS00YWM5LTQwMTUtYTlhYi0xNjI0ZDhkYTNlYjkiLCJlbWFpbCI6IkltYW1IYWRpQGdtYWlsLmN1bSIsImlhdCI6MTc1OTI2NjM3MSwiZXhwIjoxNzU5MjY5OTcxfQ.btPJRt7HGMXwaWSj72N_ci1f9OfrA1ysCbaPlq-nBMs",
									},
								},
							},
						},
					},
				},
				responses: {
					"200": {
						description: "Success",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										success: {
											type: "boolean",
											example: true,
										},
										data: {
											type: "object",
											$ref: "#/components/schemas/SimplifiedUser",
										},
										token: {
											type: "string",
											example:
												"yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNTc1ZGIyYS00YWM5LTQwMTUtYTlhYi0xNjI0ZDhkYTNlYjkiLCJlbWFpbCI6IkltYW1IYWRpQGdtYWlsLmN1bSIsImlhdCI6MTc1OTI2NjM3MSwiZXhwIjoxNzU5MjY5OTcxfQ.btPJRt7HGMXwaWSj72N_ci1f9OfrA1ysCbaPlq-nBMs",
										},
										refreshToken: {
											type: "string",
											example:
												"yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNTc1ZGIyYS00YWM5LTQwMTUtYTlhYi0xNjI0ZDhkYTNlYjkiLCJlbWFpbCI6IkltYW1IYWRpQGdtYWlsLmN1bSIsImlhdCI6MTc1OTI2NjM3MSwiZXhwIjoxNzU5MjY5OTcxfQ.btPJRt7HGMXwaWSj72N_ci1f9OfrA1ysCbaPlq-nBMs",
										},
										expiresIn: {
											type: "number",
											example: 1759269971,
										},
									},
								},
							},
						},
					},
					"400": {
						description: "Server error",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/Error400",
								},
							},
						},
					},
					"500": {
						description: "Server error",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Error" },
							},
						},
					},
				},
			},
		},
		"/api/auth/change-password": {
			post: {
				summary: "Change Password",
				tags: ["Authentication"],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								required: ["currentPassword", "newPassword"],
								properties: {
									currentPassword: { type: "string" },
									newPassword: { type: "string" },
								},
							},
						},
					},
				},
				responses: {
					"200": {
						description: "Success",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										success: {
											type: "boolean",
											example: true,
										},
									},
								},
							},
						},
					},
					"400": {
						description: "Server error",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/Error400",
								},
							},
						},
					},
					"500": {
						description: "Server error",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Error" },
							},
						},
					},
				},
			},
		},
		"/api/auth/me": {
			get: {
				summary: "Authenticated User's Info",
				tags: ["Authentication"],
				responses: {
					"200": {
						description: "Success",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										success: {
											type: "boolean",
											example: true,
										},
										data: {
											type: "object",
											$ref: "#/components/schemas/User",
										},
										token: {
											type: "string",
											example:
												"yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNTc1ZGIyYS00YWM5LTQwMTUtYTlhYi0xNjI0ZDhkYTNlYjkiLCJlbWFpbCI6IkltYW1IYWRpQGdtYWlsLmN1bSIsImlhdCI6MTc1OTI2NjM3MSwiZXhwIjoxNzU5MjY5OTcxfQ.btPJRt7HGMXwaWSj72N_ci1f9OfrA1ysCbaPlq-nBMs",
										},
										refreshToken: {
											type: "string",
											example:
												"yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNTc1ZGIyYS00YWM5LTQwMTUtYTlhYi0xNjI0ZDhkYTNlYjkiLCJlbWFpbCI6IkltYW1IYWRpQGdtYWlsLmN1bSIsImlhdCI6MTc1OTI2NjM3MSwiZXhwIjoxNzU5MjY5OTcxfQ.btPJRt7HGMXwaWSj72N_ci1f9OfrA1ysCbaPlq-nBMs",
										},
										expiresIn: {
											type: "number",
											example: 1759269971,
										},
									},
								},
							},
						},
					},
					"400": {
						description: "Server error",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/Error400",
								},
							},
						},
					},
					"401": {
						description: "Authentication error",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Error" },
							},
						},
					},
					"500": {
						description: "Server error",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Error" },
							},
						},
					},
				},
			},
		},
		"/api/weather": {
			post: {
				summary:
					"Create a new weather record from openweather api based on the give city and country",
				tags: ["Weather"],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								required: ["cityName", "country"],
								properties: {
									cityName: {
										type: "string",
										example: "London",
									},
									country: { type: "string", example: "GB" },
								},
							},
						},
					},
				},
				responses: {
					"200": {
						description: "Success",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										success: {
											type: "boolean",
											example: true,
										},
										data: {
											type: "object",
											properties: {
												weatherData: {
													type: "object",
													$ref: "#/components/schemas/CurrentWeather",
												},
											},
										},
									},
								},
							},
						},
					},
					"400": {
						description: "Server error",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/Error400",
								},
							},
						},
					},
					"500": {
						description: "Server error",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Error" },
							},
						},
					},
				},
			},
		},
		"/api/weather/{id}": {
			get: {
				summary: "Get current weather data with id",
				tags: ["Weather"],
				parameters: [
					{
						in: "path",
						name: "id",
						required: true,
						schema: { type: "string" },
						description: "The weather ID",
					},
				],
				responses: {
					"200": {
						description: "Success",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										success: {
											type: "boolean",
											example: true,
										},
										data: {
											type: "object",
											$ref: "#/components/schemas/CurrentWeather",
										},
									},
								},
							},
						},
					},
					"400": {
						description: "Server error",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/Error400",
								},
							},
						},
					},
					"500": {
						description: "Server error",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Error" },
							},
						},
					},
				},
			},
			put: {
				summary: "Update weather record",
				tags: ["Weather"],
				parameters: [
					{
						in: "path",
						name: "id",
						required: true,
						schema: { type: "string" },
						description: "The weather ID",
					},
				],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								$ref: "#/components/schemas/PartialCurrentWeather",
							},
						},
					},
				},
				responses: {
					"200": {
						description: "Success",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										success: {
											type: "boolean",
											example: true,
										},
										data: {
											type: "object",
											properties: {
												weatherData: {
													type: "object",
													$ref: "#/components/schemas/CurrentWeather",
												},
											},
										},
									},
								},
							},
						},
					},
					"400": {
						description: "Server error",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/Error400",
								},
							},
						},
					},
					"500": {
						description: "Server error",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Error" },
							},
						},
					},
				},
			},
			delete: {
				summary: "Delete a weather record",
				tags: ["Weather"],
				parameters: [
					{
						in: "path",
						name: "id",
						required: true,
						schema: { type: "string" },
						description: "The weather ID",
					},
				],
				responses: {
					"200": {
						description: "Success",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										success: {
											type: "boolean",
											example: true,
										},
										message: {
											type: "string",
											example: "weather data deleted",
										},
									},
								},
							},
						},
					},
					"400": {
						description: "Server error",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/Error400",
								},
							},
						},
					},
					"500": {
						description: "Server error",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Error" },
							},
						},
					},
				},
			},
		},
		"/api/weather/latest/{city}": {
			get: {
				summary: "Get latest weather data for a city",
				tags: ["Weather"],
				parameters: [
					{
						in: "path",
						name: "city",
						required: true,
						schema: { type: "string" },
						description: "The city name",
					},
				],
				responses: {
					"200": {
						description: "Success",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										success: {
											type: "boolean",
											example: true,
										},
										data: {
											type: "object",
											$ref: "#/components/schemas/CurrentWeather",
										},
									},
								},
							},
						},
					},
					"400": {
						description: "Server error",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/Error400",
								},
							},
						},
					},
					"500": {
						description: "Server error",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Error" },
							},
						},
					},
				},
			},
		},
		"/api/weather/": {
			get: {
				summary: "Get all weather records",
				tags: ["Weather"],
				responses: {
					"200": {
						description: "Success",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										success: {
											type: "boolean",
											example: true,
										},
										data: {
											type: "object",
											properties: {
												weatherData: {
													type: "array",
													items: {
														$ref: "#/components/schemas/CurrentWeather",
													},
												},
											},
										},
									},
								},
							},
						},
					},
					"400": {
						description: "Server error",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/Error400",
								},
							},
						},
					},
					"500": {
						description: "Server error",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Error" },
							},
						},
					},
				},
			},
		},
	},
	tags: [
		{ name: "Authentication", description: "authentication endpoints" },
		{ name: "Weather", description: "Weather endpoints" },
	],
};
