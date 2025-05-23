import type { RequestHandler } from "express";
import { ZodError } from "zod";
import {
	createSessionSchema,
	updateSessionSchema,
} from "../schemas/session.schemas";
import { SessionService } from "../services/session-service";

const sessionService = new SessionService();

export const listSessions: RequestHandler = async (req, res) => {
	try {
		const sessions = await sessionService.listSessions();
		res.status(200).json(sessions);
	} catch (error) {
		console.error("Erro ao listar Aulas:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const getSessionById: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const session = await sessionService.getSessionById(Number(id));
		res.status(200).json(session);
	} catch (error) {
		if (error instanceof Error && error.message === "Aula não encontrada") {
			res.status(404).json({ message: error.message });
			return;
		}
		console.error("Erro ao buscar aula:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const getSessionsByInstructorDiscipline: RequestHandler = async (
	req,
	res,
) => {
	try {
		const { studentId } = req.params;
		const sessions = await sessionService.getSessionsByInstructorDiscipline(
			Number(studentId),
		);
		res.status(200).json(sessions);
	} catch (error) {
		console.error("Erro ao buscar matrículas do estudante:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const createSession: RequestHandler = async (req, res) => {
	try {
		const validatedData = createSessionSchema.parse(req.body);
		const result = await sessionService.createSession(validatedData);
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

export const updateSession: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const validatedData = updateSessionSchema.parse(req.body);
		const result = await sessionService.updateSession(
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

export const deleteSession: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await sessionService.deleteSession(Number(id));
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
