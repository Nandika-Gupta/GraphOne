/**
 * AppError + central error handler.
 * Every thrown AppError serializes into the { data, meta, error } envelope.
 */
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { fail } from "../shared/types";

export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const notFound = (resource: string) =>
  new AppError(404, "NOT_FOUND", `${resource} not found`);

export const badRequest = (message: string, details?: unknown) =>
  new AppError(400, "BAD_REQUEST", message, details);

export const unauthorized = (message = "Invalid or missing API key") =>
  new AppError(401, "UNAUTHORIZED", message);

/** Express error-handling middleware — must be registered last. */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(400).json(
      fail({ code: "VALIDATION_ERROR", message: "Request validation failed", details: err.flatten() }),
    );
    return;
  }
  if (err instanceof AppError) {
    res.status(err.status).json(fail({ code: err.code, message: err.message, details: err.details }));
    return;
  }
  // eslint-disable-next-line no-console
  console.error("Unhandled error:", err);
  res.status(500).json(fail({ code: "INTERNAL_ERROR", message: "Something went wrong" }));
}
