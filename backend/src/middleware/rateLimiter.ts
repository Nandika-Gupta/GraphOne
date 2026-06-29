/**
 * Rate limiting — 100 requests / minute / IP (configurable via env).
 * Emits the standard envelope on 429.
 */
import rateLimit from "express-rate-limit";
import { fail } from "../shared/types";

export const rateLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000),
  max: Number(process.env.RATE_LIMIT_MAX ?? 100),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res
      .status(429)
      .json(fail({ code: "RATE_LIMITED", message: "Too many requests. Try again shortly." }));
  },
});
