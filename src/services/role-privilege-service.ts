import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { privilegesTable } from "../db/schema/user-schemas/privileges";
import { rolesTable } from "../db/schema/user-schemas/roles";
import { rolesPrivilegesTable } from "../db/schema/user-schemas/roles-privileges";
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
			throw new Error("Papel não encontrado");
		}

		// Check if privilege exists
		const privilege = await db
			.select()
			.from(privilegesTable)
			.where(eq(privilegesTable.id, idPrivilege));

		if (privilege.length === 0) {
			throw new Error("Privilégio não encontrado");
		}

		// Check if role already has this privilege
		const existingRolePrivilege = await db
			.select()
			.from(rolesPrivilegesTable)
			.where(
				and(
					eq(rolesPrivilegesTable.idRole, idRole),
					eq(rolesPrivilegesTable.idPrivilege, idPrivilege),
				),
			);

		if (existingRolePrivilege.length > 0) {
			throw new Error("Papel já possui este privilégio");
		}

		// Assign privilege to role
		await db.insert(rolesPrivilegesTable).values({
			idRole,
			idPrivilege,
		});

		return { message: "Privilégio atribuído com sucesso" };
	}

	async removePrivilege({ idRole, idPrivilege }: RemoveRolePrivilegeInput) {
		// Check if role-privilege relationship exists
		const existingRolePrivilege = await db
			.select()
			.from(rolesPrivilegesTable)
			.where(
				and(
					eq(rolesPrivilegesTable.idRole, idRole),
					eq(rolesPrivilegesTable.idPrivilege, idPrivilege),
				),
			);

		if (existingRolePrivilege.length === 0) {
			throw new Error("Papel não possui este privilégio");
		}

		// Remove privilege from role
		await db
			.delete(rolesPrivilegesTable)
			.where(
				and(
					eq(rolesPrivilegesTable.idRole, idRole),
					eq(rolesPrivilegesTable.idPrivilege, idPrivilege),
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
			throw new Error("Papel não encontrado");
		}

		// Get role privileges with privilege details
		const rolePrivileges = await db
			.select({
				id: privilegesTable.id,
				name: privilegesTable.name,
				description: privilegesTable.description,
			})
			.from(rolesPrivilegesTable)
			.innerJoin(
				privilegesTable,
				eq(rolesPrivilegesTable.idPrivilege, privilegesTable.id),
			)
			.where(eq(rolesPrivilegesTable.idRole, roleId));

		return rolePrivileges;
	}
}
