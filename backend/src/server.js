import app from "./app.js";
import dotenv from "dotenv";
import DbConnection from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await DbConnection();

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`✅ Server is running on port http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};

startServer();

// This file is the entry point of the backend application.