// test/teardown.ts
import AppDataSource from "../src/config/database";

module.exports = async (): Promise<void> => {
	// Close database connection
	if (AppDataSource.isInitialized) {
		await AppDataSource.destroy();
		console.log("Test database connection closed");
	}

	// Add any other global cleanup here
	console.log("Global teardown completed");
};
