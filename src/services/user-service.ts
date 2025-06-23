import { and, count, eq, ne, like } from "drizzle-orm";
import { db } from "../db";
import { usersTable } from "../db/schema/user-schemas/users";
import { ConflictError, NotFoundError } from "../errors/app-errors";
import type { UpdateUserInput, ListUserInput } from "../schemas/user.schemas";

export class UserService {
	async list(
		filters?: ListUserInput,
		pagination?: { limit: number; offset: number },
	) {
		const { limit, offset } = pagination || { limit: 10, offset: 0 };

		const where = [
			filters?.status
			? eq(usersTable.status, filters.status)
			: undefined,
			filters?.firstName
			? like(usersTable.firstName, `%${filters.firstName}%`)
			: undefined,
			filters?.surname
			? like(usersTable.surname, `%${filters.surname}%`)
			: undefined,
			filters?.email
			? like(usersTable.email, `%${filters.email}%`)
			: undefined,
		]

		const [users, [{ count: total }]] = await Promise.all([
			db
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
				.where(and(...where))
				.limit(limit)
				.offset(offset),
			db.select({ count: count() }).from(usersTable).where(and(...where)),
		]);

		return { items: users, count: Number(total) };
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
			throw new NotFoundError("Usuário não encontrado");
		}

		return user[0];
	}

	async updateUser(id: number, data: UpdateUserInput) {
		const existingUser = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.id, id));

		if (existingUser.length === 0) {
			throw new NotFoundError("Usuário não encontrado");
		}

		// Verifica se o email já está em uso por outro usuário
		if (data.email !== undefined) {
			const emailExists = await db
				.select()
				.from(usersTable)
				.where(and(eq(usersTable.email, data.email), ne(usersTable.id, id)));

			if (emailExists.length > 0) {
				throw new ConflictError("Este email já está em uso por outro usuário");
			}
		}

		// Cria um objeto com os dados a serem atualizados
		const updateData: Record<string, unknown> = {};

		// Adiciona apenas os campos que foram informados
		if (data.firstName !== undefined) updateData.firstName = data.firstName;
		if (data.surname !== undefined) updateData.surname = data.surname;
		if (data.email !== undefined) updateData.email = data.email;
		if (data.phone !== undefined) updateData.phone = data.phone;

		// Converte a data de nascimento para Date apenas se ela for informada
		if (data.birthDate !== undefined) {
			updateData.birthDate = new Date(data.birthDate);
		}

		await db.update(usersTable).set(updateData).where(eq(usersTable.id, id));

		return data.status !== undefined
			? {
					message:
						"Usuário atualizado com sucesso, mas o status não pôde ser alterado",
					status: data.status,
				}
			: { message: "Usuário atualizado com sucesso" };
	}

	async deleteUser(id: number) {
		const existingUser = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.id, id));

		if (existingUser.length === 0) {
			throw new NotFoundError("Usuário não encontrado");
		}

		await db.delete(usersTable).where(eq(usersTable.id, id));
		return { message: "Usuário excluído com sucesso" };
	}

	async toggleUserStatus(
		id: number,
		status: "active" | "inactive" | "suspended",
	) {
		const existingUser = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.id, id));

		if (existingUser.length === 0) {
			throw new NotFoundError("Usuário não encontrado");
		}

		await db.update(usersTable).set({ status }).where(eq(usersTable.id, id));

		return {
			message: "Status do usuário alterado com sucesso",
			status,
		};
	}
}
