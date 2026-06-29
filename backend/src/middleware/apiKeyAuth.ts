/**
 * API-key authentication. Clients send `X-API-Key: <key>`.
 * Keys are read from the API_KEYS env (comma-separated).
 */
import type { NextFunction, Request, Response } from "express";
import { unauthorized } from "./errorHandler";

const keys = new Set(
  (process.env.API_KEYS ?? "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean),
);

export function apiKeyAuth(req: Request, _res: Response, next: NextFunction): void {
  // Allow docs + health without a key.
  if (req.path === "/health" || req.path.startsWith("/docs")) return next();

  const provided = req.header("X-API-Key");
  if (!provided || !keys.has(provided)) return next(unauthorized());
  next();
}
