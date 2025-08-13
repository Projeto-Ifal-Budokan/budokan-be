import type { RequestHandler } from "express";
import { createRankSchema, updateRankSchema } from "../schemas/rank.schemas";
import { RankService } from "../services/rank-service";
import { getPaginationParams } from "../utils/pagination";

const rankService = new RankService();

export const listRanks: RequestHandler = async (req, res, next) => {
	try {
		const { page_size, page, offset } = getPaginationParams(req.query);

		const idDiscipline = req.query.idDiscipline
			? Number(req.query.idDiscipline)
			: undefined;

		const { items, count } = await rankService.listRanks(idDiscipline, {
			limit: page_size,
			offset,
		});
		res.status(200).json({ page_size, page, count, items });
	} catch (error) {
		next(error);
	}
};

export const getRankById: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;
		const rank = await rankService.getRankById(Number(id));
		res.status(200).json(rank);
	} catch (error) {
		next(error);
	}
};

export const createRank: RequestHandler = async (req, res, next) => {
	try {
		const validatedData = createRankSchema.parse(req.body);
		const result = await rankService.createRank(validatedData);
		res.status(201).json(result);
	} catch (error) {
		next(error);
	}
};

export const updateRank: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;
		const validatedData = updateRankSchema.parse(req.body);
		const result = await rankService.updateRank(Number(id), validatedData);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const deleteRank: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await rankService.deleteRank(Number(id));
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
