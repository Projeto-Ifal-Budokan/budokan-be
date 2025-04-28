import type { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/custom-error.ts";

export function notFound(req: Request, res: Response, next: NextFunction) {
	return next(new CustomError("Route not found", 404));
}
