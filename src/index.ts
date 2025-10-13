import express, { Request, Response } from "express";
import { handlerReadiness } from "./api/readiness.js";
import {
  errorMiddleware,
  middlewareLogResponses,
  middlewareMetricsInc,
} from "./api/middlewares.js";
import { handlerMentric } from "./api/metricInc.js";
import { handlerResetMetric } from "./api/reset.js";
import { handlerValidateChirp } from "./api/chirps.js";

const PORT = 8080;
const app = express();

app.use(express.json()); // middleware to automatically parse json body

app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", (req, res, next) => {
  Promise.resolve(handlerReadiness(req, res)).catch(next);
});
app.get("/admin/metrics", (req, res, next) => {
  Promise.resolve(handlerMentric(req, res)).catch(next);
});
app.post("/admin/reset", (req, res, next) => {
  Promise.resolve(handlerResetMetric(req, res)).catch(next);
});
app.post("/api/validate_chirp", (req, res, next) => {
  Promise.resolve(handlerValidateChirp(req, res)).catch(next);
});

app.get("/", (_: Request, res: Response) => {
  res.send("Hello");
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Serving at ${PORT}`);
});
