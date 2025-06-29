import type { RequestHandler } from "express";
import {
	createSessionSchema,
	listSessionSchema,
	updateSessionSchema,
	viewMatriculationSessionsSchema,
} from "../schemas/session.schemas";
import { SessionService } from "../services/session-service";
import { getPaginationParams } from "../utils/pagination";

const sessionService = new SessionService();

export const listSessions: RequestHandler = async (req, res, next) => {
	try {
		const validatedData = listSessionSchema.parse(req.query);
		const { page_size, page, offset } = getPaginationParams(req.query);
		const { items, count } = await sessionService.listSessions(validatedData, {
			limit: page_size,
			offset,
		});
		res.status(200).json({ page_size, page, count, items });
	} catch (error) {
		next(error);
	}
};

export const viewMatriculationSessions: RequestHandler = async (
	req,
	res,
	next,
) => {
	try {
		const idMatriculation = req.params.id;
		const validatedData = viewMatriculationSessionsSchema.parse(req.query);
		const { page_size, page, offset } = getPaginationParams(req.query);
		const { items, count } = await sessionService.viewMatriculationSessions(
			Number(idMatriculation),
			validatedData,
			{ limit: page_size, offset },
		);
		res.status(200).json({ page_size, page, count, items });
	} catch (error) {
		next(error);
	}
};

export const createSession: RequestHandler = async (req, res, next) => {
	try {
		const validatedData = createSessionSchema.parse(req.body);
		const result = await sessionService.createSession(validatedData);
		res.status(201).json(result);
	} catch (error) {
		next(error);
	}
};

export const updateSession: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;
		const validatedData = updateSessionSchema.parse(req.body);
		const result = await sessionService.updateSession(
			Number(id),
			validatedData,
		);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const deleteSession: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await sessionService.deleteSession(Number(id));
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
