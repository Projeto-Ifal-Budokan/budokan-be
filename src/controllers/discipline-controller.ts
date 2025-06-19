import type { RequestHandler } from "express";
import {
	createDisciplineSchema,
	updateDisciplineSchema,
} from "../schemas/discipline.schemas";
import { DisciplineService } from "../services/discipline-service";
import { getPaginationParams } from "../utils/pagination";

const disciplineService = new DisciplineService();

export const listDisciplines: RequestHandler = async (req, res, next) => {
	try {
		const { page_size, page, offset } = getPaginationParams(req.query);
		const { items, count } = await disciplineService.listDisciplines({
			limit: page_size,
			offset,
		});
		res.status(200).json({ page_size, page, count, items });
	} catch (error) {
		next(error);
	}
};

export const getDisciplineById: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;
		const discipline = await disciplineService.getDisciplineById(Number(id));
		res.status(200).json(discipline);
	} catch (error) {
		next(error);
	}
};

export const createDiscipline: RequestHandler = async (req, res, next) => {
	try {
		const validatedData = createDisciplineSchema.parse(req.body);
		const result = await disciplineService.createDiscipline(validatedData);
		res.status(201).json(result);
	} catch (error) {
		next(error);
	}
};

export const updateDiscipline: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;
		const validatedData = updateDisciplineSchema.parse(req.body);
		const result = await disciplineService.updateDiscipline(
			Number(id),
			validatedData,
		);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const deleteDiscipline: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await disciplineService.deleteDiscipline(Number(id));
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
