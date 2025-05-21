import type { RequestHandler } from "express";
import { ZodError } from "zod";
import {
	createMatriculationSchema,
	updateMatriculationSchema,
} from "../schemas/matriculation.schemas";
import { MatriculationService } from "../services/matriculation-service";

const matriculationService = new MatriculationService();

export const listMatriculations: RequestHandler = async (req, res) => {
	try {
		const matriculations = await matriculationService.listMatriculations();
		res.status(200).json(matriculations);
	} catch (error) {
		console.error("Erro ao listar matrículas:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const getMatriculationById: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const matriculation = await matriculationService.getMatriculationById(
			Number(id),
		);
		res.status(200).json(matriculation);
	} catch (error) {
		if (
			error instanceof Error &&
			error.message === "Matrícula não encontrada"
		) {
			res.status(404).json({ message: error.message });
			return;
		}
		console.error("Erro ao buscar matrícula:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const getMatriculationsByStudent: RequestHandler = async (req, res) => {
	try {
		const { studentId } = req.params;
		const matriculations =
			await matriculationService.getMatriculationsByStudent(Number(studentId));
		res.status(200).json(matriculations);
	} catch (error) {
		console.error("Erro ao buscar matrículas do estudante:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const createMatriculation: RequestHandler = async (req, res) => {
	try {
		const validatedData = createMatriculationSchema.parse(req.body);
		const result =
			await matriculationService.createMatriculation(validatedData);
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
				error.message === "Usuário não encontrado como praticante" ||
				error.message === "Disciplina não encontrada" ||
				error.message === "Falha ao criar registro de estudante" ||
				error.message ===
					"Graduação não encontrada ou não pertence à disciplina selecionada"
			) {
				res.status(404).json({ message: error.message });
				return;
			}
			if (
				error.message ===
				"Este estudante já possui uma matrícula ativa nesta disciplina"
			) {
				res.status(409).json({ message: error.message });
				return;
			}
		}
		console.error("Erro ao criar matrícula:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const updateMatriculation: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const validatedData = updateMatriculationSchema.parse(req.body);
		const result = await matriculationService.updateMatriculation(
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
				error.message === "Graduação não encontrada"
			) {
				res.status(404).json({ message: error.message });
				return;
			}
		}
		console.error("Erro ao atualizar matrícula:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const deleteMatriculation: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await matriculationService.deleteMatriculation(Number(id));
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
