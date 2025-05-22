import type { RequestHandler } from "express";
import { ZodError } from "zod";
import {
	createInstructorDisciplineSchema,
	updateInstructorDisciplineSchema,
} from "../schemas/instructor-discipline.schemas";
import { InstructorDisciplineService } from "../services/instructor-discipline-service";

const instructorDisciplineService = new InstructorDisciplineService();

export const listInstructorDisciplines: RequestHandler = async (req, res) => {
	try {
		const instructorDisciplines =
			await instructorDisciplineService.listInstructorDisciplines();
		res.status(200).json(instructorDisciplines);
	} catch (error) {
		console.error("Erro ao listar vínculos instrutor-disciplina:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const getInstructorDisciplineById: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const instructorDiscipline =
			await instructorDisciplineService.getInstructorDisciplineById(Number(id));
		res.status(200).json(instructorDiscipline);
	} catch (error) {
		if (
			error instanceof Error &&
			error.message === "Vínculo de instrutor-disciplina não encontrado"
		) {
			res.status(404).json({ message: error.message });
			return;
		}
		console.error("Erro ao buscar vínculo instrutor-disciplina:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const getInstructorDisciplinesByInstructor: RequestHandler = async (
	req,
	res,
) => {
	try {
		const { instructorId } = req.params;
		const instructorDisciplines =
			await instructorDisciplineService.getInstructorDisciplinesByInstructor(
				Number(instructorId),
			);
			if (instructorDisciplines.length === 0) {
				res.status(404).json({ message: "Vínculo de instrutor-disciplina não encontrado" });
				return;
			}
		res.status(200).json(instructorDisciplines);
	} catch (error) {
		console.error("Erro ao buscar vínculos do instrutor:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const createInstructorDiscipline: RequestHandler = async (req, res) => {
	try {
		const validatedData = createInstructorDisciplineSchema.parse(req.body);
		const result =
			await instructorDisciplineService.createInstructorDiscipline(
				validatedData,
			);
		res.status(201).json(result);
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
				error.message === "Usuário não encontrado como praticante" ||
				error.message === "Disciplina não encontrada" ||
				error.message === "Falha ao criar registro de instrutor" ||
				error.message ===
					"Graduação não encontrada ou não pertence à disciplina selecionada"
			) {
				res.status(404).json({ message: error.message });
				return;
			}
			if (
				error.message ===
				"Este instrutor já possui um vínculo com esta disciplina"
			) {
				res.status(409).json({ message: error.message });
				return;
			}
		}
		console.error("Erro ao criar vínculo instrutor-disciplina:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const updateInstructorDiscipline: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const validatedData = updateInstructorDisciplineSchema.parse(req.body);
		const result = await instructorDisciplineService.updateInstructorDiscipline(
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
				error.message === "Vínculo instrutor-disciplina não encontrado" ||
				error.message ===
					"Graduação não encontrada ou não pertence à disciplina do vínculo"
			) {
				res.status(404).json({ message: error.message });
				return;
			}
		}
		console.error("Erro ao atualizar vínculo instrutor-disciplina:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const deleteInstructorDiscipline: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await instructorDisciplineService.deleteInstructorDiscipline(
			Number(id),
		);
		res.status(200).json(result);
	} catch (error) {
		if (
			error instanceof Error &&
			error.message === "Vínculo instrutor-disciplina não encontrado"
		) {
			res.status(404).json({ message: error.message });
			return;
		}
		console.error("Erro ao excluir vínculo instrutor-disciplina:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};
