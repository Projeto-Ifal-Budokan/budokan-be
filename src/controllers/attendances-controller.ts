import type { RequestHandler } from "express";
import { ZodError } from "zod";
import {
    createAttendanceSchema,
    updateAttendanceSchema,
} from "../schemas/attendance.schemas";
import { AttendanceService } from "../services/attendance-service";

const attendanceService = new AttendanceService();

export const listAttendances: RequestHandler = async (req, res) => {
    try {
        const attendances = await attendanceService.listAttendances();
        res.status(200).json(attendances);
    } catch (error) {
        console.error("Erro ao listar Aulas:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
};

export const getAttendanceById: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const attendance = await attendanceService.getAttendanceById(Number(id));
        res.status(200).json(attendance);
    } catch (error) {
        if (error instanceof Error && error.message === "Aula não encontrada") {
            res.status(404).json({ message: error.message });
            return;
        }
        console.error("Erro ao buscar aula:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
};

export const getAttendancesByInstructorDiscipline: RequestHandler = async (
    req,
    res,
) => {
    try {
        const { studentId } = req.params;
        const attendances = await attendanceService.getAttendancesByInstructorDiscipline(
            Number(studentId),
        );
        res.status(200).json(attendances);
    } catch (error) {
        console.error("Erro ao buscar matrículas do estudante:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
};

export const createAttendance: RequestHandler = async (req, res) => {
    try {
        const validatedData = createAttendanceSchema.parse(req.body);
        const result = await attendanceService.createAttendance(validatedData);
        res.status(201).json(result);
    } catch (error) {
        console.log(error);
        if (error instanceof ZodError) {
            res.status(400).json({
                message: "Dados inválidos",
                errors: error.errors,
            });
            return;
        }
        if (error instanceof Error) {
            if (
                error.message === "Disciplina não encontrada" ||
                error.message === "Instrutor não encontrado" ||
                error.message ===
                "O instrutor informado não é responsável pela disciplina"
            ) {
                res.status(404).json({ message: error.message });
                return;
            }
            if (
                error.message === "Conflito de horário: já existe uma aula agendada neste intervalo"
            ) {
                res.status(409).json({ message: error.message });
                return;
            }
        }
        console.error("Erro ao criar aula:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
};

export const updateAttendance: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const validatedData = updateAttendanceSchema.parse(req.body);
        const result = await attendanceService.updateAttendance(
            Number(id),
            validatedData,
        );
        res.status(200).json(result);
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                message: "Dados inválidos",
                errors: error.errors,
            });
            return;
        }
        if (error instanceof Error) {
            if (
                error.message === "Matrícula não encontrada" ||
                error.message ===
                "Graduação não encontrada ou não pertence à disciplina da matrícula"
            ) {
                res.status(404).json({ message: error.message });
                return;
            }
        }
        console.error("Erro ao atualizar matrícula:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
};

export const deleteAttendance: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await attendanceService.deleteAttendance(Number(id));
        res.status(200).json(result);
    } catch (error) {
        if (
            error instanceof Error &&
            error.message === "Matrícula não encontrada"
        ) {
            res.status(404).json({ message: error.message });
            return;
        }
        console.error("Erro ao excluir matrícula:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
};
