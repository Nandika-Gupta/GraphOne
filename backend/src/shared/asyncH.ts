import type { NextFunction, Request, Response } from "express";

/** Wrap an async handler so thrown/rejected errors reach the errorHandler. */
export const asyncH =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
