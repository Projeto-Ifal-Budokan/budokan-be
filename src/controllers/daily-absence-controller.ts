import type { RequestHandler } from "express";
import { z } from "zod";
import {
	createDailyAbsenceSchema,
	updateDailyAbsenceSchema,
} from "../schemas/attendance.schemas";
import { DailyAbsenceService } from "../services/daily-absence-service";

const dailyAbsenceService = new DailyAbsenceService();

export const listDailyAbsences: RequestHandler = async (req, res, next) => {
	try {
		const { idMatriculation } = req.params;
		const absences = await dailyAbsenceService.listDailyAbsences(
			Number(idMatriculation),
		);
		res.status(200).json(absences);
	} catch (error) {
		next(error);
	}
};

export const getDailyAbsence: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;
		const absence = await dailyAbsenceService.getDailyAbsence(Number(id));
		res.status(200).json(absence);
	} catch (error) {
		next(error);
	}
};

export const createDailyAbsence: RequestHandler = async (req, res, next) => {
	try {
		const validatedData = createDailyAbsenceSchema.parse(req.body);
		const result = await dailyAbsenceService.createDailyAbsence(validatedData);
		res.status(201).json(result);
	} catch (error) {
		next(error);
	}
};

export const updateDailyAbsence: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;
		const validatedData = updateDailyAbsenceSchema.parse(req.body);
		const result = await dailyAbsenceService.updateDailyAbsence(
			Number(id),
			validatedData,
		);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const deleteDailyAbsence: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await dailyAbsenceService.deleteDailyAbsence(Number(id));
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const countAbsenceDays: RequestHandler = async (req, res, next) => {
	try {
		const { idMatriculation } = req.params;
		const result = await dailyAbsenceService.countAbsenceDays(
			Number(idMatriculation),
		);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const processAbsencesForDate: RequestHandler = async (
	req,
	res,
	next,
) => {
	try {
		const schema = z.object({
			date: z.string().refine(
				(date) => {
					const timestamp = Date.parse(date);
					return !Number.isNaN(timestamp);
				},
				{
					message: "Data inválida. Utilize o formato YYYY-MM-DD",
				},
			),
		});

		const { date } = schema.parse(req.body);
		const result = await dailyAbsenceService.processAbsencesForDate(date);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const processAbsencesForDateRange: RequestHandler = async (
	req,
	res,
	next,
) => {
	try {
		const schema = z.object({
			startDate: z.string().refine(
				(date) => {
					const timestamp = Date.parse(date);
					return !Number.isNaN(timestamp);
				},
				{
					message: "Data inicial inválida. Utilize o formato YYYY-MM-DD",
				},
			),
			endDate: z.string().refine(
				(date) => {
					const timestamp = Date.parse(date);
					return !Number.isNaN(timestamp);
				},
				{
					message: "Data final inválida. Utilize o formato YYYY-MM-DD",
				},
			),
		});

		const { startDate, endDate } = schema.parse(req.body);
		const result = await dailyAbsenceService.processAbsencesForDateRange(
			startDate,
			endDate,
		);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
