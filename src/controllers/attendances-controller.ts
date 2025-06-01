import type { RequestHandler } from "express";
import { ZodError } from "zod";
import { AttendanceService } from "../services/attendance-service";
import {
    createAttendanceSchema,
    justificationAttendanceSchema,
    updateAttendanceSchema,
} from "../schemas/attendance.schemas";

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
export const listAttendancesByMatriculation: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const attendances = await attendanceService.getAttendanceByMatriculation(Number(id));
        res.status(200).json(attendances);
    } catch (error) {
        if (error instanceof Error && error.message === "Nenhum registro de frequência encontrado") {
            res.status(404).json({ message: error.message });
            return;
        }
        console.error("Erro ao listar Aulas:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
}

export const listDailyAttendances: RequestHandler = async (req, res) => {
    try {
        const attendances = await attendanceService.listDailyAttendances();
        res.status(200).json(attendances);
    } catch (error) {
        console.error("Erro ao listar Aulas:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
};


export const createAttendance: RequestHandler = async (req, res) => {
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
        if (error instanceof ZodError) {
            res.status(400).json({
                message: "Dados inválidos",
                errors: error.errors,
            });
            return;
        }
        if (error instanceof Error) {
            if (
                error.message === "Nenhum aluno matriculado encontrado" ||
                error.message === "Aula não encontrada"
            ) {
                res.status(404).json({ message: error.message });
                return;
            }
        }
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

export const justifyAttendance: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const validatedData = justificationAttendanceSchema.parse(req.body);

        const result = await attendanceService.justifyAttendance(
            Number(id),
            validatedData,
        );
        res.status(200).json(result);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Registro não encontrado") {
                res.status(404).json({ message: error.message });
                return;
            }
            if (error.message === "O registro não está ausente, não é possível justificar") {
                res.status(409).json({ message: error.message });
                return;
            }
            console.error("Erro ao justificar falta:", error);
            res.status(500).json({ message: "Erro interno do servidor" });
        }
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
            error.message === "Registro não encontrado"
        ) {
            res.status(404).json({ message: error.message });
            return;
        }
        console.error("Erro ao excluir registro:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
};

export const deleteDailyAttendance: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await attendanceService.deleteDailyAttendance(Number(id));
        res.status(200).json(result);
    } catch (error) {
        if (
            error instanceof Error &&
            error.message === "Registro não encontrado"
        ) {
            res.status(404).json({ message: error.message });
            return;
        }
        console.error("Erro ao excluir registro:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
};