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

  // GET/HEAD are public — only writes require a key
  if (req.method === "GET" || req.method === "HEAD") return next();

  const provided = req.header("X-API-Key");
  if (!provided || !keys.has(provided)) return next(unauthorized());
  next();
}