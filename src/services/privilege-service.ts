import { and, eq, like } from "drizzle-orm";
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
}

export class PrivilegeService {
	async listPrivileges(filters?: PrivilegeFilters) {
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

			return privilege;
		}

		// Handle all privileges with possible description filter
		const whereConditions = [];

		if (filters?.description) {
			whereConditions.push(
				like(privilegesTable.description, `%${filters.description}%`),
			);
		}

		const privileges =
			whereConditions.length > 0
				? await db
						.select({
							id: privilegesTable.id,
							name: privilegesTable.name,
							description: privilegesTable.description,
							createdAt: privilegesTable.createdAt,
							updatedAt: privilegesTable.updatedAt,
						})
						.from(privilegesTable)
						.where(and(...whereConditions))
				: await db
						.select({
							id: privilegesTable.id,
							name: privilegesTable.name,
							description: privilegesTable.description,
							createdAt: privilegesTable.createdAt,
							updatedAt: privilegesTable.updatedAt,
						})
						.from(privilegesTable);

		return privileges;
	}

	async listUserPrivileges(userId: number, description?: string) {
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

		if (description) {
			privileges = privileges.filter((privilege) =>
				privilege.description.toLowerCase().includes(description.toLowerCase()),
			);
		}

		return privileges;
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
