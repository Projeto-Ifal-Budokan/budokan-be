import type { RequestHandler } from "express";
import { ZodError } from "zod";
import {
	createInstructorDisciplineSchema,
	updateInstructorDisciplineSchema,
} from "../schemas/instructor-discipline.schemas";
import { InstructorDisciplineService } from "../services/instructor-discipline-service";

const instructorDisciplineService = new InstructorDisciplineService();

export const listInstructorDisciplines: RequestHandler = async (
	req,
	res,
	next,
) => {
	try {
		const instructorDisciplines =
			await instructorDisciplineService.listInstructorDisciplines();
		res.status(200).json(instructorDisciplines);
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

export const getInstructorDisciplinesByInstructor: RequestHandler = async (
	req,
	res,
	next,
) => {
	try {
		const { instructorId } = req.params;
		const instructorDisciplines =
			await instructorDisciplineService.getInstructorDisciplinesByInstructor(
				Number(instructorId),
			);
		res.status(200).json(instructorDisciplines);
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
