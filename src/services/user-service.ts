import { eq } from "drizzle-orm";
import { ZodError } from "zod";
import { db } from "../db";
import { usersTable } from "../db/schema/user_schemas/users";
import type { UpdateUserInput } from "../schemas/user.schemas";

export class UserService {
	async listUsers() {
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

		return users;
	}

	async getUserById(id: number) {
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
			.where(eq(usersTable.id, id));

		if (user.length === 0) {
			throw new Error("Usuário não encontrado");
		}

		return user[0];
	}

	async updateUser(id: number, data: UpdateUserInput) {
		const existingUser = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.id, id));

		if (existingUser.length === 0) {
			throw new Error("Usuário não encontrado");
		}

		await db
			.update(usersTable)
			.set({
				...data,
				birthDate: new Date(data.birthDate),
			})
			.where(eq(usersTable.id, id));

		return { message: "Usuário atualizado com sucesso" };
	}

	async deleteUser(id: number) {
		const existingUser = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.id, id));

		if (existingUser.length === 0) {
			throw new Error("Usuário não encontrado");
		}

		await db.delete(usersTable).where(eq(usersTable.id, id));
		return { message: "Usuário excluído com sucesso" };
	}
}
