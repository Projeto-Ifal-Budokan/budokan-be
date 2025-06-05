import type { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../errors/app-errors";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
	next(new NotFoundError(`Rota não encontrada: ${req.method} ${req.path}`));
};
