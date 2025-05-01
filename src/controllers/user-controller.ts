import type { RequestHandler } from "express";
import { ZodError } from "zod";
import { updateUserSchema } from "../schemas/user.schemas";
import { UserService } from "../services/user-service";

const userService = new UserService();

export const listUsers: RequestHandler = async (req, res) => {
	try {
		const users = await userService.listUsers();
		res.status(200).json(users);
	} catch (error) {
		console.error("Erro ao listar usuários:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const getUserById: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await userService.getUserById(Number(id));
		res.status(200).json(user);
	} catch (error) {
		if (error instanceof Error && error.message === "Usuário não encontrado") {
			res.status(404).json({ message: error.message });
			return;
		}
		console.error("Erro ao buscar usuário:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const updateUser: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const validatedData = updateUserSchema.parse(req.body);
		const result = await userService.updateUser(Number(id), validatedData);
		res.status(200).json(result);
	} catch (error) {
		if (error instanceof ZodError) {
			res.status(400).json({
				message: "Dados inválidos",
				errors: error.errors,
			});
			return;
		}
		if (error instanceof Error && error.message === "Usuário não encontrado") {
			res.status(404).json({ message: error.message });
			return;
		}
		console.error("Erro ao atualizar usuário:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const deleteUser: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await userService.deleteUser(Number(id));
		res.status(200).json(result);
	} catch (error) {
		if (error instanceof Error && error.message === "Usuário não encontrado") {
			res.status(404).json({ message: error.message });
			return;
		}
		console.error("Erro ao excluir usuário:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};
