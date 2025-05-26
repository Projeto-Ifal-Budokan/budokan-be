import type { RequestHandler } from "express";
import {
	createTrainingScheduleSchema,
	updateTrainingScheduleSchema,
} from "../schemas/training-schedule.schemas";
import { TrainingScheduleService } from "../services/training-schedule-service";

const trainingScheduleService = new TrainingScheduleService();

export const listTrainingSchedules: RequestHandler = async (req, res, next) => {
	try {
		const trainingSchedules =
			await trainingScheduleService.listTrainingSchedules();
		res.status(200).json(trainingSchedules);
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

export const getTrainingSchedulesByDiscipline: RequestHandler = async (
	req,
	res,
	next,
) => {
	try {
		const { disciplineId } = req.params;
		const trainingSchedules =
			await trainingScheduleService.getTrainingSchedulesByDiscipline(
				Number(disciplineId),
			);
		res.status(200).json(trainingSchedules);
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
