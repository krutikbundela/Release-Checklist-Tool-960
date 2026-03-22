import { DataSource } from "typeorm";
import { Release } from "../entities/Release.entity";
import { env } from "./env";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: env.DATABASE_URL,
  ssl: env.DATABASE_URL.includes("localhost") || env.DATABASE_URL.includes("db:5432") 
    ? false 
    : { rejectUnauthorized: false },
  synchronize: env.TYPEORM_SYNC,
  logging: false,
  entities: [Release],
});
