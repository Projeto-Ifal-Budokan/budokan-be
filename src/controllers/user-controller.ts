import { eq } from "drizzle-orm";
import type { RequestHandler } from "express";
import { ZodError } from "zod";
import { db } from "../db";
import { usersTable } from "../db/schema/user_schemas/users";
import { updateUserSchema } from "../schemas/user.schemas";

export const listUsers: RequestHandler = async (req, res) => {
	try {
		const users = await db
			.select({
				id: usersTable.id,
				firstName: usersTable.firstName,
				surname: usersTable.surname,
				email: usersTable.email,
				phone: usersTable.phone,
				birthDate: usersTable.birthDate,
				status: usersTable.status,
			})
			.from(usersTable);

		res.status(200).json(users);
	} catch (error) {
		console.error("Erro ao listar usuários:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const getUserById: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await db
			.select({
				id: usersTable.id,
				firstName: usersTable.firstName,
				surname: usersTable.surname,
				email: usersTable.email,
				phone: usersTable.phone,
				birthDate: usersTable.birthDate,
				status: usersTable.status,
			})
			.from(usersTable)
			.where(eq(usersTable.id, Number(id)));

		if (user.length === 0) {
			res.status(404).json({ message: "Usuário não encontrado" });
			return;
		}

		res.status(200).json(user[0]);
	} catch (error) {
		console.error("Erro ao buscar usuário:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const updateUser: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const validatedData = updateUserSchema.parse(req.body);

		const existingUser = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.id, Number(id)));

		if (existingUser.length === 0) {
			res.status(404).json({ message: "Usuário não encontrado" });
			return;
		}

		await db
			.update(usersTable)
			.set({
				...validatedData,
				birthDate: new Date(validatedData.birthDate),
			})
			.where(eq(usersTable.id, Number(id)));

		res.status(200).json({ message: "Usuário atualizado com sucesso" });
	} catch (error) {
		if (error instanceof ZodError) {
			res.status(400).json({
				message: "Dados inválidos",
				errors: error.errors,
			});
			return;
		}
		console.error("Erro ao atualizar usuário:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const deleteUser: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const existingUser = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.id, Number(id)));

		if (existingUser.length === 0) {
			res.status(404).json({ message: "Usuário não encontrado" });
			return;
		}

		await db.delete(usersTable).where(eq(usersTable.id, Number(id)));

		res.status(200).json({ message: "Usuário excluído com sucesso" });
	} catch (error) {
		console.error("Erro ao excluir usuário:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};
