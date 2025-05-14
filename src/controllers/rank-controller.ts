import type { RequestHandler } from "express";
import { ZodError } from "zod";
import { createRankSchema, updateRankSchema } from "../schemas/rank.schemas";
import { RankService } from "../services/rank-service";

const rankService = new RankService();

export const listRanks: RequestHandler = async (req, res) => {
	try {
		const disciplineId = req.query.disciplineId
			? Number(req.query.disciplineId)
			: undefined;

		const ranks = await rankService.listRanks(disciplineId);
		res.status(200).json(ranks);
	} catch (error) {
		console.error("Erro ao listar ranks:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const getRankById: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const rank = await rankService.getRankById(Number(id));
		res.status(200).json(rank);
	} catch (error) {
		if (error instanceof Error && error.message === "Rank não encontrado") {
			res.status(404).json({ message: error.message });
			return;
		}
		console.error("Erro ao buscar rank:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const createRank: RequestHandler = async (req, res) => {
	try {
		const validatedData = createRankSchema.parse(req.body);
		const result = await rankService.createRank(validatedData);
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
			if (error.message === "Disciplina não encontrada") {
				res.status(404).json({ message: error.message });
				return;
			}
			if (
				error.message === "Já existe um rank com este nome nesta disciplina"
			) {
				res.status(409).json({ message: error.message });
				return;
			}
		}

		console.error("Erro ao criar rank:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const updateRank: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const validatedData = updateRankSchema.parse(req.body);
		const result = await rankService.updateRank(Number(id), validatedData);
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
			if (error.message === "Rank não encontrado") {
				res.status(404).json({ message: error.message });
				return;
			}
			if (error.message === "Disciplina não encontrada") {
				res.status(404).json({ message: error.message });
				return;
			}
			if (
				error.message === "Já existe um rank com este nome nesta disciplina"
			) {
				res.status(409).json({ message: error.message });
				return;
			}
		}

		console.error("Erro ao atualizar rank:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const deleteRank: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await rankService.deleteRank(Number(id));
		res.status(200).json(result);
	} catch (error) {
		if (error instanceof Error && error.message === "Rank não encontrado") {
			res.status(404).json({ message: error.message });
			return;
		}

		console.error("Erro ao excluir rank:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};
