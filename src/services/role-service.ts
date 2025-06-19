import { count, eq } from "drizzle-orm";
import { db } from "../db";
import { rolesTable } from "../db/schema/user-schemas/roles";
import { ConflictError, NotFoundError } from "../errors/app-errors";
import type { CreateRoleInput, UpdateRoleInput } from "../schemas/role.schemas";

export class RoleService {
	async listRoles(pagination?: { limit: number; offset: number }) {
		const { limit, offset } = pagination || { limit: 10, offset: 0 };

		const [roles, [{ count: total }]] = await Promise.all([
			db.query.rolesTable.findMany({
				with: {
					rolePrivileges: {
						with: {
							privilege: true,
						},
					},
				},
				limit,
				offset,
			}),
			db.select({ count: count() }).from(rolesTable),
		]);

		return { items: roles, count: Number(total) };
	}

	async getRoleById(id: number) {
		const role = await db
			.select({
				id: rolesTable.id,
				name: rolesTable.name,
				description: rolesTable.description,
				createdAt: rolesTable.createdAt,
				updatedAt: rolesTable.updatedAt,
			})
			.from(rolesTable)
			.where(eq(rolesTable.id, id));

		if (role.length === 0) {
			throw new NotFoundError("Cargo não encontrado");
		}

		return role[0];
	}

	async createRole(data: CreateRoleInput) {
		const existingRole = await db
			.select()
			.from(rolesTable)
			.where(eq(rolesTable.name, data.name));

		if (existingRole.length > 0) {
			throw new ConflictError("Já existe um cargo com este nome");
		}

		await db.insert(rolesTable).values(data);
		return { message: "Cargo criado com sucesso" };
	}

	async updateRole(id: number, data: UpdateRoleInput) {
		const existingRole = await db
			.select()
			.from(rolesTable)
			.where(eq(rolesTable.id, id));

		if (existingRole.length === 0) {
			throw new NotFoundError("Cargo não encontrado");
		}

		if (data.name) {
			const roleWithSameName = await db
				.select()
				.from(rolesTable)
				.where(eq(rolesTable.name, data.name));

			if (roleWithSameName.length > 0 && roleWithSameName[0].id !== id) {
				throw new ConflictError("Já existe um cargo com este nome");
			}
		}

		await db.update(rolesTable).set(data).where(eq(rolesTable.id, id));

		return { message: "Cargo atualizado com sucesso" };
	}

	async deleteRole(id: number) {
		const existingRole = await db
			.select()
			.from(rolesTable)
			.where(eq(rolesTable.id, id));

		if (existingRole.length === 0) {
			throw new NotFoundError("Cargo não encontrado");
		}

		await db.delete(rolesTable).where(eq(rolesTable.id, id));
		return { message: "Cargo excluído com sucesso" };
	}
}
