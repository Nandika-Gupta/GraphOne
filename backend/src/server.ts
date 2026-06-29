/**
 * GraphOne API server.
 * Express + Prisma + Supabase Postgres. Mounts middleware, routes, Swagger.
 */
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cron from "node-cron";
import swaggerUi from "swagger-ui-express";

import apiRoutes from "./routes";
import { apiKeyAuth } from "./middleware/apiKeyAuth";
import { rateLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";
import { recalculateTrending } from "./jobs/recalculateTrending";
import { openapiSpec } from "./docs/openapi";
import { ok } from "./shared/types";

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN ?? "*" }));
app.use(express.json({ limit: "1mb" }));

// Health + docs are public; everything else needs an API key + rate limit.
app.get("/health", (_req, res) => res.json(ok({ status: "ok", uptime: process.uptime() })));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.use(rateLimiter);
app.use(apiKeyAuth);
app.use("/api/v1", apiRoutes);

// 404 + central error handler (last).
app.use((_req, res) => res.status(404).json({ data: null, meta: {}, error: { code: "NOT_FOUND", message: "Route not found" } }));
app.use(errorHandler);

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`GraphOne API → http://localhost:${port}  (docs: /docs)`);

  // Hourly trending recompute + cache invalidation.
  cron.schedule("0 * * * *", () => {
    recalculateTrending().catch((e) => console.error("[cron] failed:", e));
  });
});

export default app;
