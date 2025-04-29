import type { NextFunction, Request, Response } from "express";
import type { CustomError } from "../utils/custom-error.ts";

export function error(
	err: CustomError,
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const msg = JSON.parse(err.message);
		const status = err.statusCode || 500;
		res.status(status).json({ msg });
	} catch (error) {
		const status = err.statusCode || 500;
		res.status(status).json({ msg: err.message });
	}
}
