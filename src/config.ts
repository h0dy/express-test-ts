import { envOrErr } from "./utils.js";
import type { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile();

type Config = {
  api: APIConfig;
  db: DBConfig;
  jwt: JWTConfig;
};

type APIConfig = {
  fileServerHits: number;
  port: number;
  platform: string;
  polkaKey: string;
};
type JWTConfig = {
  secret: string;
  refreshDuration: number;
  accessDuration: number;
  issuer: string;
};

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

export const config: Config = {
  api: {
    fileServerHits: 0,
    port: Number(envOrErr("PORT")),
    platform: envOrErr("PLATFORM"),
    polkaKey: envOrErr("POLKA_KEY"),
  },
  db: {
    url: envOrErr("DB_URL"),
    migrationConfig: migrationConfig,
  },
  jwt: {
    secret: envOrErr("JWT_SECRET"),
    accessDuration: 60 * 60, // 1 hour in seconds
    refreshDuration: 60 * 60 * 24 * 60 * 1000, // 60 days in milliseconds
    issuer: "chirpy",
  },
};
