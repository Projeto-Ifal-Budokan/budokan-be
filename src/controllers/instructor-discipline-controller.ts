import type { RequestHandler } from "express";
import {
	createInstructorDisciplineSchema,
	updateInstructorDisciplineSchema,
} from "../schemas/instructor-discipline.schemas";
import { InstructorDisciplineService } from "../services/instructor-discipline-service";
import { getPaginationParams } from "../utils/pagination";

const instructorDisciplineService = new InstructorDisciplineService();

export const listInstructorDisciplines: RequestHandler = async (
	req,
	res,
	next,
) => {
	try {
		const { page_size, page, offset } = getPaginationParams(req.query);

		const idInstructor = req.query.idInstructor
			? Number(req.query.idInstructor)
			: undefined;

		const { items, count } = await instructorDisciplineService.list(
			{ idInstructor },
			{ limit: page_size, offset },
		);
		res.status(200).json({ page_size, page, count, items });
	} catch (error) {
		next(error);
	}
};

export const getInstructorDisciplineById: RequestHandler = async (
	req,
	res,
	next,
) => {
	try {
		const { id } = req.params;
		const instructorDiscipline =
			await instructorDisciplineService.getInstructorDisciplineById(Number(id));
		res.status(200).json(instructorDiscipline);
	} catch (error) {
		next(error);
	}
};

export const createInstructorDiscipline: RequestHandler = async (
	req,
	res,
	next,
) => {
	try {
		const validatedData = createInstructorDisciplineSchema.parse(req.body);
		const result =
			await instructorDisciplineService.createInstructorDiscipline(
				validatedData,
			);
		res.status(201).json(result);
	} catch (error) {
		next(error);
	}
};

export const updateInstructorDiscipline: RequestHandler = async (
	req,
	res,
	next,
) => {
	try {
		const { id } = req.params;
		const validatedData = updateInstructorDisciplineSchema.parse(req.body);
		const result = await instructorDisciplineService.updateInstructorDiscipline(
			Number(id),
			validatedData,
		);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const deleteInstructorDiscipline: RequestHandler = async (
	req,
	res,
	next,
) => {
	try {
		const { id } = req.params;
		const result = await instructorDisciplineService.deleteInstructorDiscipline(
			Number(id),
		);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
