import type { RequestHandler } from "express";
import { AttendanceService } from "../services/attendance-service";
import {
    createAttendanceSchema,
    justificationAttendanceSchema,
    updateAttendanceSchema,
} from "../schemas/attendance.schemas";

const attendanceService = new AttendanceService();

export const listAttendances: RequestHandler = async (req, res, next) => {
    try {
        const attendances = await attendanceService.listAttendances();
        res.status(200).json(attendances);
    } catch (error) {
        next(error);
    }
};
export const listAttendancesByMatriculation: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const attendances = await attendanceService.getAttendanceByMatriculation(Number(id));
        res.status(200).json(attendances);
    } catch (error) {
        next(error);
    }
}

export const listDailyAttendances: RequestHandler = async (req, res, next) => {
    try {
        const attendances = await attendanceService.listDailyAttendances();
        res.status(200).json(attendances);
    } catch (error) {
        next(error);
    }
};


export const createAttendance: RequestHandler = async (req, res, next) => {
    try {
        const validatedData = createAttendanceSchema.parse(req.body);
        const result = await attendanceService.createAttendance(validatedData);
        const resultDaily = await attendanceService.createAttendanceDaily({ idDailySession: result.idDailySession });
        let status = 201;
        let jsonResponse = {
            message: "Frequência lançada com sucesso",
        }
        if (
            result.message === "Frequência já lançada para esta aula" &&
            resultDaily.message === "Frequência diária já lançada para esta aula"
        ) {
            status = 409;
            jsonResponse = {
                message: "Não houve necessidade de lançar a frequência, nenhuma alteração foi feita",
            };
        }
        res.status(status).json(jsonResponse);
    } catch (error) {
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

export const deleteDailyAttendance: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await attendanceService.deleteDailyAttendance(Number(id));
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};