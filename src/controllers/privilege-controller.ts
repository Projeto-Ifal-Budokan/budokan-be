import type { RequestHandler } from "express";
import { ZodError } from "zod";
import {
	createPrivilegeSchema,
	updatePrivilegeSchema,
} from "../schemas/privilege.schemas";
import { PrivilegeService } from "../services/privilege-service";

const privilegeService = new PrivilegeService();

export const listPrivileges: RequestHandler = async (req, res) => {
	try {
		const privileges = await privilegeService.listPrivileges();
		res.status(200).json(privileges);
	} catch (error) {
		console.error("Erro ao listar privilégios:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const getPrivilegeById: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const privilege = await privilegeService.getPrivilegeById(Number(id));
		res.status(200).json(privilege);
	} catch (error) {
		if (
			error instanceof Error &&
			error.message === "Privilégio não encontrado"
		) {
			res.status(404).json({ message: error.message });
			return;
		}
		console.error("Erro ao buscar privilégio:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const createPrivilege: RequestHandler = async (req, res) => {
	try {
		const validatedData = createPrivilegeSchema.parse(req.body);
		const result = await privilegeService.createPrivilege(validatedData);
		res.status(201).json(result);
	} catch (error) {
		if (error instanceof ZodError) {
			res.status(400).json({
				message: "Dados inválidos",
				errors: error.errors,
			});
			return;
		}
		if (
			error instanceof Error &&
			error.message === "Já existe um privilégio com este nome"
		) {
			res.status(409).json({ message: error.message });
			return;
		}
		console.error("Erro ao criar privilégio:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const updatePrivilege: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const validatedData = updatePrivilegeSchema.parse(req.body);
		const result = await privilegeService.updatePrivilege(
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
			if (error.message === "Privilégio não encontrado") {
				res.status(404).json({ message: error.message });
				return;
			}
			if (error.message === "Já existe um privilégio com este nome") {
				res.status(409).json({ message: error.message });
				return;
			}
		}
		console.error("Erro ao atualizar privilégio:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const deletePrivilege: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await privilegeService.deletePrivilege(Number(id));
		res.status(200).json(result);
	} catch (error) {
		if (
			error instanceof Error &&
			error.message === "Privilégio não encontrado"
		) {
			res.status(404).json({ message: error.message });
			return;
		}
		console.error("Erro ao excluir privilégio:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};
