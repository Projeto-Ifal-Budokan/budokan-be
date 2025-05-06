import type { RequestHandler } from "express";
import { assignUserRoleSchema } from "../schemas/user-role-schema";
import { UserRoleService } from "../services/user-role-service";

const userRoleService = new UserRoleService();

export const assignRole: RequestHandler = async (req, res) => {
	try {
		const validatedData = assignUserRoleSchema.parse(req.body);
		const result = await userRoleService.assignRole(validatedData);
		res.status(200).json(result);
	} catch (error) {
		if (error instanceof Error) {
			if (
				error.message === "Usuário não encontrado" ||
				error.message === "Papel não encontrado"
			) {
				res.status(404).json({ message: error.message });
				return;
			}
			if (error.message === "Usuário já possui este papel") {
				res.status(409).json({ message: error.message });
				return;
			}
		}
		console.error("Erro ao atribuir papel ao usuário:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const removeRole: RequestHandler = async (req, res) => {
	try {
		const validatedData = assignUserRoleSchema.parse(req.body);
		const result = await userRoleService.removeRole(validatedData);
		res.status(200).json(result);
	} catch (error) {
		if (error instanceof Error) {
			if (error.message === "Usuário não possui este papel") {
				res.status(404).json({ message: error.message });
				return;
			}
		}
		console.error("Erro ao remover papel do usuário:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const listUserRoles: RequestHandler = async (req, res) => {
	try {
		const userId = Number(req.params.id);
		if (Number.isNaN(userId)) {
			res.status(400).json({ message: "ID do usuário inválido" });
			return;
		}

		const roles = await userRoleService.listUserRoles(userId);
		res.status(200).json(roles);
	} catch (error) {
		if (error instanceof Error && error.message === "Usuário não encontrado") {
			res.status(404).json({ message: error.message });
			return;
		}
		console.error("Erro ao listar papéis do usuário:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};
