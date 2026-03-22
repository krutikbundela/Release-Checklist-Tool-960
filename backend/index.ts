import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import releaseRoutes from "./routes/release.routes";
import { AppDataSource } from "./config/db";
import { env } from "./config/env";

const app = express();

// Security HTTP Headers
app.use(helmet());

// Proper CORS Policy
app.use(
  cors({
    origin: env.FRONTEND_URL, // Accepts requests ONLY from this URL (default: localhost:5173)
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Rate Limiting Policy
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: "Too many requests from this IP, please try again later." },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.use("/api/releases", releaseRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected via TypeORM");
    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to database", err);
  });
