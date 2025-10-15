import express, { Request, Response } from "express";
import { handlerReadiness } from "./api/handlers/readiness.js";
import {
  errorMiddleware,
  middlewareLogResponses,
  middlewareMetricsInc,
} from "./api/middlewares.js";
import { handlerMetric } from "./api/handlers/metricInc.js";
import { handlerResetMetric } from "./api/handlers/reset.js";
import {
  handlerCreateChirp,
  handlerGetAllChirps,
  handlerGetChirp,
  handlerDeleteChirp,
} from "./api/handlers/chirps.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
import {
  handlerCreateUser,
  handlerLoginUser,
  handlerUpdateUser,
} from "./api/handlers/users.js";
import {
  handlerRefreshToken,
  handlerRevokeToken,
} from "./api/handlers/refreshToken.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig); // auto migrate
const app = express();

app.use(express.json()); // middleware to automatically parse json body

app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", (req, res, next) => {
  Promise.resolve(handlerReadiness(req, res)).catch(next);
});
app.get("/admin/metrics", (req, res, next) => {
  Promise.resolve(handlerMetric(req, res)).catch(next);
});
app.post("/admin/reset", (req, res, next) => {
  Promise.resolve(handlerResetMetric(req, res)).catch(next);
});

app.post("/api/users", (req, res, next) => {
  Promise.resolve(handlerCreateUser(req, res)).catch(next);
});

app.post("/api/chirps", (req, res, next) => {
  Promise.resolve(handlerCreateChirp(req, res)).catch(next);
});
app.get("/api/chirps", (req, res, next) => {
  Promise.resolve(handlerGetAllChirps(req, res)).catch(next);
});
app.get("/api/chirps/:chirpID", (req, res, next) => {
  Promise.resolve(handlerGetChirp(req, res)).catch(next);
});
app.post("/api/login", (req, res, next) => {
  Promise.resolve(handlerLoginUser(req, res)).catch(next);
});
app.post("/api/refresh", (req, res, next) => {
  Promise.resolve(handlerRefreshToken(req, res)).catch(next);
});
app.post("/api/revoke", (req, res, next) => {
  Promise.resolve(handlerRevokeToken(req, res)).catch(next);
});
app.put("/api/users", (req, res, next) => {
  Promise.resolve(handlerUpdateUser(req, res)).catch(next);
});
app.delete("/api/chirps/:chirpID", (req, res, next) => {
  Promise.resolve(handlerDeleteChirp(req, res)).catch(next);
});

app.get("/", (_: Request, res: Response) => {
  res.send("Hello");
});

app.use(errorMiddleware);

app.listen(config.api.port, () => {
  console.log(`Serving at ${config.api.port}`);
});
