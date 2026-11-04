import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/connectDB.js';
import authRoutes from "./Routes/auth.route.js";
import itemRouter from "./Routes/item.route.js";
import uploadRouter from "./Routes/upload.route.js";

const app = express();

app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL || "*",
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet({
    crossOriginOpenerPolicy: false
}));

// Connect to DB for serverless requests
app.use(async (req, res, next) => {
    try {
        await connectDB();
    } catch (err) {
        console.error("DB connection error in middleware:", err);
    }
    next();
});

const PORT = process.env.PORT || 8080;

app.get("/", (request, response) => {
    response.json({ 
        message: "Hello from server! Server is Running",
        status: "online"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/item", itemRouter);
app.use("/api/upload", uploadRouter);

if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;
