import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { privilegesTable } from "../db/schema/user-schemas/privileges";
import { rolePrivilegesTable } from "../db/schema/user-schemas/role-privileges";
import { rolesTable } from "../db/schema/user-schemas/roles";
import { ConflictError, NotFoundError } from "../errors/app-errors";
import type {
	AssignRolePrivilegeInput,
	RemoveRolePrivilegeInput,
} from "../schemas/role-privilege-schema";

export class RolePrivilegeService {
	async assignPrivilege({ idRole, idPrivilege }: AssignRolePrivilegeInput) {
		// Check if role exists
		const role = await db
			.select()
			.from(rolesTable)
			.where(eq(rolesTable.id, idRole));

		if (role.length === 0) {
			throw new NotFoundError("Papel não encontrado");
		}

		// Check if privilege exists
		const privilege = await db
			.select()
			.from(privilegesTable)
			.where(eq(privilegesTable.id, idPrivilege));

		if (privilege.length === 0) {
			throw new NotFoundError("Privilégio não encontrado");
		}

		// Check if role already has this privilege
		const existingRolePrivilege = await db
			.select()
			.from(rolePrivilegesTable)
			.where(
				and(
					eq(rolePrivilegesTable.idRole, idRole),
					eq(rolePrivilegesTable.idPrivilege, idPrivilege),
				),
			);

		if (existingRolePrivilege.length > 0) {
			throw new ConflictError("Papel já possui este privilégio");
		}

		// Assign privilege to role
		await db.insert(rolePrivilegesTable).values({
			idRole,
			idPrivilege,
		});

		return { message: "Privilégio atribuído com sucesso" };
	}

	async removePrivilege({ idRole, idPrivilege }: RemoveRolePrivilegeInput) {
		// Check if role-privilege relationship exists
		const existingRolePrivilege = await db
			.select()
			.from(rolePrivilegesTable)
			.where(
				and(
					eq(rolePrivilegesTable.idRole, idRole),
					eq(rolePrivilegesTable.idPrivilege, idPrivilege),
				),
			);

		if (existingRolePrivilege.length === 0) {
			throw new NotFoundError("Papel não possui este privilégio");
		}

		// Remove privilege from role
		await db
			.delete(rolePrivilegesTable)
			.where(
				and(
					eq(rolePrivilegesTable.idRole, idRole),
					eq(rolePrivilegesTable.idPrivilege, idPrivilege),
				),
			);

		return { message: "Privilégio removido com sucesso" };
	}

	async listRolePrivileges(roleId: number) {
		// Check if role exists
		const role = await db
			.select()
			.from(rolesTable)
			.where(eq(rolesTable.id, roleId));

		if (role.length === 0) {
			throw new NotFoundError("Papel não encontrado");
		}

		// Get role privileges with privilege details
		const rolePrivileges = await db
			.select({
				id: privilegesTable.id,
				name: privilegesTable.name,
				description: privilegesTable.description,
			})
			.from(rolePrivilegesTable)
			.innerJoin(
				privilegesTable,
				eq(rolePrivilegesTable.idPrivilege, privilegesTable.id),
			)
			.where(eq(rolePrivilegesTable.idRole, roleId));

		return rolePrivileges;
	}
}
