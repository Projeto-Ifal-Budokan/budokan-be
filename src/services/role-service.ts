import { and, count, eq, inArray, like } from "drizzle-orm";
import { db } from "../db";
import { privilegesTable } from "../db/schema/user-schemas/privileges";
import { rolePrivilegesTable } from "../db/schema/user-schemas/role-privileges";
import { rolesTable } from "../db/schema/user-schemas/roles";
import { ConflictError, NotFoundError } from "../errors/app-errors";
import type {
	CreateRoleInput,
	ListRoleInput,
	UpdateRoleInput,
} from "../schemas/role.schemas";

export class RoleService {
	async listRoles(
		filters: ListRoleInput,
		pagination?: { limit: number; offset: number },
	) {
		const { limit, offset } = pagination || { limit: 10, offset: 0 };

		const conditions = [
			filters.name ? like(rolesTable.name, `%${filters.name}%`) : undefined,
			filters.description
				? like(rolesTable.description, `%${filters.description}%`)
				: undefined,
		];

		if (filters.idPrivilege) {
			const rolePrivilegesIds = await db
				.select({ idRole: rolePrivilegesTable.idRole })
				.from(rolePrivilegesTable)
				.where(eq(rolePrivilegesTable.idPrivilege, filters.idPrivilege));

			if (rolePrivilegesIds.length === 0) {
				throw new NotFoundError(
					"Este privilégio não está associado a nenhum cargo",
				);
			}

			conditions.push(
				inArray(
					rolesTable.id,
					rolePrivilegesIds.map(
						(RolePrivilegesTable) => RolePrivilegesTable.idRole,
					),
				),
			);
		}

		if (filters.namePrivilege) {
			const privilegeIds = await db
				.select({ idRole: rolePrivilegesTable.idRole })
				.from(privilegesTable)
				.innerJoin(
					rolePrivilegesTable,
					eq(rolePrivilegesTable.idPrivilege, privilegesTable.id),
				)
				.where(eq(privilegesTable.name, filters.namePrivilege));

			if (privilegeIds.length === 0) {
				throw new NotFoundError("Nenhum privilégio encontrado com este nome");
			}

			conditions.push(
				inArray(
					rolesTable.id,
					privilegeIds.map((privilege) => privilege.idRole),
				),
			);
		}

		const [roles, [{ count: total }]] = await Promise.all([
			db.query.rolesTable.findMany({
				where: conditions.length > 0 ? (role) => and(...conditions) : undefined,
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
			db
				.select({ count: count() })
				.from(rolesTable)
				.where(conditions.length > 0 ? and(...conditions) : undefined),
		]);

		return { items: roles, count: Number(total) };
	}

	async getRoleById(id: number) {
		const role = await db.query.rolesTable.findFirst({
			where: (role) => eq(role.id, id),
			with: {
				rolePrivileges: {
					with: {
						privilege: true,
					},
				},
			},
		});

		if (!role) {
			throw new NotFoundError("Cargo não encontrado");
		}

		return role;
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

		// Delete all role privileges for this role before deleting the role itself
		await db
			.delete(rolePrivilegesTable)
			.where(eq(rolePrivilegesTable.idRole, id));

		await db.delete(rolesTable).where(eq(rolesTable.id, id));
		return { message: "Cargo excluído com sucesso" };
	}
}
