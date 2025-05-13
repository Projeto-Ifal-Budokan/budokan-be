import type { RequestHandler } from "express";
import { assignRolePrivilegeSchema } from "../schemas/role-privilege-schema";
import { RolePrivilegeService } from "../services/role-privilege-service";

const rolePrivilegeService = new RolePrivilegeService();

export const assignPrivilege: RequestHandler = async (req, res) => {
	try {
		const validatedData = assignRolePrivilegeSchema.parse(req.body);
		const result = await rolePrivilegeService.assignPrivilege(validatedData);
		res.status(200).json(result);
	} catch (error) {
		if (error instanceof Error) {
			if (
				error.message === "Papel não encontrado" ||
				error.message === "Privilégio não encontrado"
			) {
				res.status(404).json({ message: error.message });
				return;
			}
			if (error.message === "Papel já possui este privilégio") {
				res.status(409).json({ message: error.message });
				return;
			}
		}
		console.error("Erro ao atribuir privilégio ao papel:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const removePrivilege: RequestHandler = async (req, res) => {
	try {
		const validatedData = assignRolePrivilegeSchema.parse(req.body);
		const result = await rolePrivilegeService.removePrivilege(validatedData);
		res.status(200).json(result);
	} catch (error) {
		if (error instanceof Error) {
			if (error.message === "Papel não possui este privilégio") {
				res.status(404).json({ message: error.message });
				return;
			}
		}
		console.error("Erro ao remover privilégio do papel:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const listRolePrivileges: RequestHandler = async (req, res) => {
	try {
		const roleId = Number(req.params.id);
		if (Number.isNaN(roleId)) {
			res.status(400).json({ message: "ID do papel inválido" });
			return;
		}

		const privileges = await rolePrivilegeService.listRolePrivileges(roleId);
		res.status(200).json(privileges);
	} catch (error) {
		if (error instanceof Error && error.message === "Papel não encontrado") {
			res.status(404).json({ message: error.message });
			return;
		}
		console.error("Erro ao listar privilégios do papel:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};
