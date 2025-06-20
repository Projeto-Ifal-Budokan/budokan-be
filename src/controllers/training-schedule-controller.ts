import type { RequestHandler } from "express";
import {
	createTrainingScheduleSchema,
	updateTrainingScheduleSchema,
} from "../schemas/training-schedule.schemas";
import { TrainingScheduleService } from "../services/training-schedule-service";
import { getPaginationParams } from "../utils/pagination";

const trainingScheduleService = new TrainingScheduleService();

export const listTrainingSchedules: RequestHandler = async (req, res, next) => {
	try {
		const { page_size, page, offset } = getPaginationParams(req.query);

		const idDiscipline = req.query.idDiscipline
			? Number(req.query.idDiscipline)
			: undefined;

		const { items, count } = await trainingScheduleService.list(
			{ idDiscipline },
			{ limit: page_size, offset },
		);
		res.status(200).json({ page_size, page, count, items });
	} catch (error) {
		next(error);
	}
};

export const getTrainingScheduleById: RequestHandler = async (
	req,
	res,
	next,
) => {
	try {
		const { id } = req.params;
		const trainingSchedule =
			await trainingScheduleService.getTrainingScheduleById(Number(id));
		res.status(200).json(trainingSchedule);
	} catch (error) {
		next(error);
	}
};

export const createTrainingSchedule: RequestHandler = async (
	req,
	res,
	next,
) => {
	try {
		const validatedData = createTrainingScheduleSchema.parse(req.body);
		const result =
			await trainingScheduleService.createTrainingSchedule(validatedData);
		res.status(201).json(result);
	} catch (error) {
		next(error);
	}
};

export const updateTrainingSchedule: RequestHandler = async (
	req,
	res,
	next,
) => {
	try {
		const { id } = req.params;
		const validatedData = updateTrainingScheduleSchema.parse(req.body);
		const result = await trainingScheduleService.updateTrainingSchedule(
			Number(id),
			validatedData,
		);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const deleteTrainingSchedule: RequestHandler = async (
	req,
	res,
	next,
) => {
	try {
		const { id } = req.params;
		const result = await trainingScheduleService.deleteTrainingSchedule(
			Number(id),
		);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
