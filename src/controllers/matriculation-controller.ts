import type { RequestHandler } from "express";
import {
	createMatriculationSchema,
	updateMatriculationSchema,
} from "../schemas/matriculation.schemas";
import { MatriculationService } from "../services/matriculation-service";
import { getPaginationParams } from "../utils/pagination";

const matriculationService = new MatriculationService();

export const listMatriculations: RequestHandler = async (req, res, next) => {
	try {
		const { page_size, page, offset } = getPaginationParams(req.query);

		const idStudent = req.query.idStudent
			? Number(req.query.idStudent)
			: undefined;

		const { items, count } = await matriculationService.listMatriculations(
			{ idStudent },
			{ limit: page_size, offset },
		);
		res.status(200).json({ page_size, page, count, items });
	} catch (error) {
		next(error);
	}
};

export const getMatriculationById: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;
		const matriculation = await matriculationService.getMatriculationById(
			Number(id),
		);
		res.status(200).json(matriculation);
	} catch (error) {
		next(error);
	}
};

export const createMatriculation: RequestHandler = async (req, res, next) => {
	try {
		const validatedData = createMatriculationSchema.parse(req.body);
		const result =
			await matriculationService.createMatriculation(validatedData);
		res.status(201).json(result);
	} catch (error) {
		next(error);
	}
};

export const updateMatriculation: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;
		const validatedData = updateMatriculationSchema.parse(req.body);
		const result = await matriculationService.updateMatriculation(
			Number(id),
			validatedData,
		);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const deleteMatriculation: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await matriculationService.deleteMatriculation(Number(id));
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
