import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  PORT: z
    .string()
    .default("5000")
    .transform((val: string) => parseInt(val, 10)),
  TYPEORM_SYNC: z
    .string()
    .default("false")
    .optional()
    .transform((val?: string) => val === "true"),
  FRONTEND_URL: z
    .string()
    .default("http://localhost:5173"),
});

export const env = envSchema.parse(process.env);
