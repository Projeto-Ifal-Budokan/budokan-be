import { and, count, eq, like } from "drizzle-orm";
import { db } from "../db";
import { privilegesTable } from "../db/schema/user-schemas/privileges";
import { userRolesTable } from "../db/schema/user-schemas/user-roles";
import { ConflictError, NotFoundError } from "../errors/app-errors";
import type {
	CreatePrivilegeInput,
	UpdatePrivilegeInput,
} from "../schemas/privilege.schemas";

export interface PrivilegeFilters {
	idPrivilege?: number;
	description?: string;
	idUser?: number;
}

export class PrivilegeService {
	async listPrivileges(
		filters?: PrivilegeFilters,
		pagination?: { limit: number; offset: number },
	) {
		if (filters?.idUser) {
			return this.listUserPrivileges(
				filters.idUser,
				pagination,
				filters.description,
			);
		}
		const { limit, offset } = pagination || { limit: 10, offset: 0 };
		// Special case: if idPrivilege is provided, return only that privilege
		if (filters?.idPrivilege) {
			const privilege = await db
				.select({
					id: privilegesTable.id,
					name: privilegesTable.name,
					description: privilegesTable.description,
					createdAt: privilegesTable.createdAt,
					updatedAt: privilegesTable.updatedAt,
				})
				.from(privilegesTable)
				.where(eq(privilegesTable.id, filters.idPrivilege));

			if (privilege.length === 0) {
				throw new NotFoundError("Privilégio não encontrado");
			}

			return { items: privilege, count: 1 };
		}

		// Handle all privileges with possible description filter
		const whereConditions = [];

		if (filters?.description) {
			whereConditions.push(
				like(privilegesTable.description, `%${filters.description}%`),
			);
		}
		const query = db
			.select()
			.from(privilegesTable)
			.where(and(...whereConditions));

		const [privileges, [{ count: total }]] = await Promise.all([
			db
				.select({
					id: privilegesTable.id,
					name: privilegesTable.name,
					description: privilegesTable.description,
					createdAt: privilegesTable.createdAt,
					updatedAt: privilegesTable.updatedAt,
				})
				.from(privilegesTable)
				.where(and(...whereConditions))
				.limit(limit)
				.offset(offset),
			db
				.select({ count: count() })
				.from(privilegesTable)
				.where(and(...whereConditions)),
		]);

		return { items: privileges, count: Number(total) };
	}

	async listUserPrivileges(
		userId: number,
		pagination?: { limit: number; offset: number },
		description?: string,
	) {
		const { limit, offset } = pagination || { limit: 10, offset: 0 };
		// Get user's privileges through their roles
		const userRoles = await db.query.userRolesTable.findMany({
			where: eq(userRolesTable.idUser, userId),
			with: {
				role: {
					with: {
						rolePrivileges: {
							with: {
								privilege: true,
							},
						},
					},
				},
			},
		});

		// Extract all unique privileges from user's roles
		const uniquePrivileges = new Map();
		for (const userRole of userRoles) {
			for (const rolePrivilege of userRole.role.rolePrivileges) {
				const privilege = rolePrivilege.privilege;
				uniquePrivileges.set(privilege.id, {
					id: privilege.id,
					name: privilege.name,
					description: privilege.description,
					createdAt: privilege.createdAt,
					updatedAt: privilege.updatedAt,
				});
			}
		}

		// Convert to array and apply description filter if needed
		let privileges = Array.from(uniquePrivileges.values());
		const total = privileges.length;

		if (description) {
			privileges = privileges.filter((privilege) =>
				privilege.description.toLowerCase().includes(description.toLowerCase()),
			);
		}

		const paginatedPrivileges = privileges.slice(offset, offset + limit);

		return { items: paginatedPrivileges, count: total };
	}

	async createPrivilege(data: CreatePrivilegeInput) {
		const existingPrivilege = await db
			.select()
			.from(privilegesTable)
			.where(eq(privilegesTable.name, data.name));

		if (existingPrivilege.length > 0) {
			throw new ConflictError("Já existe um privilégio com este nome");
		}

		await db.insert(privilegesTable).values(data);
		return { message: "Privilégio criado com sucesso" };
	}

	async updatePrivilege(id: number, data: UpdatePrivilegeInput) {
		const existingPrivilege = await db
			.select()
			.from(privilegesTable)
			.where(eq(privilegesTable.id, id));

		if (existingPrivilege.length === 0) {
			throw new NotFoundError("Privilégio não encontrado");
		}

		if (data.name) {
			const privilegeWithSameName = await db
				.select()
				.from(privilegesTable)
				.where(eq(privilegesTable.name, data.name));

			if (
				privilegeWithSameName.length > 0 &&
				privilegeWithSameName[0].id !== id
			) {
				throw new ConflictError("Já existe um privilégio com este nome");
			}
		}

		await db
			.update(privilegesTable)
			.set(data)
			.where(eq(privilegesTable.id, id));

		return { message: "Privilégio atualizado com sucesso" };
	}

	async deletePrivilege(id: number) {
		const existingPrivilege = await db
			.select()
			.from(privilegesTable)
			.where(eq(privilegesTable.id, id));

		if (existingPrivilege.length === 0) {
			throw new NotFoundError("Privilégio não encontrado");
		}

		await db.delete(privilegesTable).where(eq(privilegesTable.id, id));
		return { message: "Privilégio excluído com sucesso" };
	}
}
