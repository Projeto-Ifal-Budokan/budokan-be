import type { RequestHandler } from "express";
import type { z } from "zod";
import { ConflictError } from "../errors/app-errors";
import {
	createAttendanceSchema,
	legacyUpdateAttendanceSchema,
	updateAttendanceSchema,
} from "../schemas/attendance.schemas";
import type { AttendanceFilters } from "../services/attendance-service";
import { AttendanceService } from "../services/attendance-service";

const attendanceService = new AttendanceService();

export const listAttendances: RequestHandler = async (req, res, next) => {
	try {
		// Extrair filtros dos query params
		const filters: AttendanceFilters = {};

		if (req.query.idSession) {
			filters.idSession = Number(req.query.idSession);
		}

		if (req.query.idDiscipline) {
			filters.idDiscipline = Number(req.query.idDiscipline);
		}

		if (req.query.idMatriculation) {
			filters.idMatriculation = Number(req.query.idMatriculation);
		}

		if (req.query.date) {
			filters.date = String(req.query.date);
		}

		if (
			req.query.status &&
			["present", "absent"].includes(String(req.query.status))
		) {
			filters.status = req.query.status as "present" | "absent";
		}

		const attendances = await attendanceService.listAttendances(filters);
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

		// Tentar validar com ambos os schemas
		let validatedData: z.infer<typeof updateAttendanceSchema>;
		try {
			// Primeiro tenta o novo formato (array direto)
			validatedData = updateAttendanceSchema.parse(req.body);
		} catch (error) {
			// Se falhar, tenta o formato antigo (objeto com array)
			const legacyData = legacyUpdateAttendanceSchema.parse(req.body);
			validatedData = legacyData.attendances;
		}

		const result = await attendanceService.updateAttendance(
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
