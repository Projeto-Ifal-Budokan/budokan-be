import type { RequestHandler } from "express";
import { ZodError } from "zod";
import { createRoleSchema, updateRoleSchema } from "../schemas/role.schemas";
import { RoleService } from "../services/role-service";

const roleService = new RoleService();

export const listRoles: RequestHandler = async (req, res) => {
	try {
		const roles = await roleService.listRoles();
		res.status(200).json(roles);
	} catch (error) {
		console.error("Erro ao listar papéis:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const getRoleById: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const role = await roleService.getRoleById(Number(id));
		res.status(200).json(role);
	} catch (error) {
		if (error instanceof Error && error.message === "Papel não encontrado") {
			res.status(404).json({ message: error.message });
			return;
		}
		console.error("Erro ao buscar papel:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const createRole: RequestHandler = async (req, res) => {
	try {
		const validatedData = createRoleSchema.parse(req.body);
		const result = await roleService.createRole(validatedData);
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
			error.message === "Já existe um papel com este nome"
		) {
			res.status(409).json({ message: error.message });
			return;
		}
		console.error("Erro ao criar papel:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const updateRole: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const validatedData = updateRoleSchema.parse(req.body);
		const result = await roleService.updateRole(Number(id), validatedData);
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
			if (error.message === "Papel não encontrado") {
				res.status(404).json({ message: error.message });
				return;
			}
			if (error.message === "Já existe um papel com este nome") {
				res.status(409).json({ message: error.message });
				return;
			}
		}
		console.error("Erro ao atualizar papel:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const deleteRole: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await roleService.deleteRole(Number(id));
		res.status(200).json(result);
	} catch (error) {
		if (error instanceof Error && error.message === "Papel não encontrado") {
			res.status(404).json({ message: error.message });
			return;
		}
		console.error("Erro ao excluir papel:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};
