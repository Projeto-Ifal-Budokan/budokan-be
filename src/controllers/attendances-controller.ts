import type { RequestHandler } from "express";
import { ConflictError } from "../errors/app-errors";
import {
	createAttendanceSchema,
	justificationAttendanceSchema,
	updateAttendanceSchema,
} from "../schemas/attendance.schemas";
import { AttendanceService } from "../services/attendance-service";

const attendanceService = new AttendanceService();

export const listAttendances: RequestHandler = async (req, res, next) => {
	try {
		const attendances = await attendanceService.listAttendances();
		res.status(200).json(attendances);
	} catch (error) {
		next(error);
	}
};

export const listAttendancesByMatriculation: RequestHandler = async (
	req,
	res,
	next,
) => {
	try {
		const { id } = req.params;
		const attendances = await attendanceService.getAttendanceByMatriculation(
			Number(id),
		);
		res.status(200).json(attendances);
	} catch (error) {
		next(error);
	}
};

export const createAttendance: RequestHandler = async (req, res, next) => {
	try {
		const validatedData = createAttendanceSchema.parse(req.body);
		const result = await attendanceService.createAttendance(validatedData);
		res.status(201).json(result);
	} catch (error) {
		if (error instanceof ConflictError) {
			res.status(409).json({
				message: error.message,
				error: "conflict",
			});
			return;
		}
		next(error);
	}
};

export const updateAttendance: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;
		const validatedData = updateAttendanceSchema.parse(req.body);
		const result = await attendanceService.updateAttendance(
			Number(id),
			validatedData,
		);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const justifyAttendance: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;
		const validatedData = justificationAttendanceSchema.parse(req.body);

		const result = await attendanceService.justifyAttendance(
			Number(id),
			validatedData,
		);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const deleteAttendance: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await attendanceService.deleteAttendance(Number(id));
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
