import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        success: false,
        message: "❌ Too many requests from this IP, please try again later.",
    }
});

app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ! Apply rate limiting to all API routes
app.use("/api/", apiLimiter);

//! Routes
app.use("/api/auth", authRoutes);

//! Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "✅ Secure Authentication System API is running Successfully.",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "❌ Route not found",
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "❌ Internal Server Error",
    });
});

export default app;