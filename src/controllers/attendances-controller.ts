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
import { getPaginationParams } from "../utils/pagination";

const attendanceService = new AttendanceService();

export const listAttendances: RequestHandler = async (req, res, next) => {
	try {
		const { page_size, page, offset } = getPaginationParams(req.query);
		// Extrair filtros dos query params de forma padronizada
		const filters: AttendanceFilters = {
			// Usar operador ternário para cada filtro, similar ao listDailyAbsences
			idSession: req.query.idSession ? Number(req.query.idSession) : undefined,

			idDiscipline: req.query.idDiscipline
				? Number(req.query.idDiscipline)
				: undefined,

			idMatriculation: req.query.idMatriculation
				? Number(req.query.idMatriculation)
				: undefined,

			date: req.query.date as string | undefined,

			// Verificar se o status é válido antes de atribuir
			status:
				req.query.status &&
				["present", "absent"].includes(String(req.query.status))
					? (req.query.status as "present" | "absent")
					: undefined,

			studentName: req.query.studentName as string | undefined,
		};

		const { items, count } = await attendanceService.listAttendances(filters, {
			limit: page_size,
			offset,
		});
		res.status(200).json({ page_size, page, count, items });
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
		const { idSession } = req.params;
		const result = await attendanceService.deleteAttendance(Number(idSession));
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
