import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { rolesTable } from "../db/schema/user-schemas/roles";
import { userRolesTable } from "../db/schema/user-schemas/user-roles";
import { usersTable } from "../db/schema/user-schemas/users";
import { ConflictError, NotFoundError } from "../errors/app-errors";
import type {
	AssignUserRoleInput,
	RemoveUserRoleInput,
} from "../schemas/user-role-schema";

export class UserRoleService {
	async assignRole({ idUser, idRole }: AssignUserRoleInput) {
		// Check if user exists
		const user = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.id, idUser));

		if (user.length === 0) {
			throw new NotFoundError("Usuário não encontrado");
		}

		// Check if role exists
		const role = await db
			.select()
			.from(rolesTable)
			.where(eq(rolesTable.id, idRole));

		if (role.length === 0) {
			throw new NotFoundError("Papel não encontrado");
		}

		// Check if user already has this role
		const existingUserRole = await db
			.select()
			.from(userRolesTable)
			.where(
				and(
					eq(userRolesTable.idUser, idUser),
					eq(userRolesTable.idRole, idRole),
				),
			);

		if (existingUserRole.length > 0) {
			throw new ConflictError("Usuário já possui este papel");
		}

		// Assign role to user
		await db.insert(userRolesTable).values({
			idUser,
			idRole,
		});

		return { message: "Papel atribuído com sucesso" };
	}

	async removeRole({ idUser, idRole }: RemoveUserRoleInput) {
		// Check if user-role relationship exists
		const existingUserRole = await db
			.select()
			.from(userRolesTable)
			.where(
				and(
					eq(userRolesTable.idUser, idUser),
					eq(userRolesTable.idRole, idRole),
				),
			);

		if (existingUserRole.length === 0) {
			throw new NotFoundError("Usuário não possui este papel");
		}

		// Remove role from user
		await db
			.delete(userRolesTable)
			.where(
				and(
					eq(userRolesTable.idUser, idUser),
					eq(userRolesTable.idRole, idRole),
				),
			);

		return { message: "Papel removido com sucesso" };
	}

	async listUserRoles(userId: number) {
		// Check if user exists
		const user = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.id, userId));

		if (user.length === 0) {
			throw new NotFoundError("Usuário não encontrado");
		}

		// Get user roles with role details
		const userRoles = await db
			.select({
				id: rolesTable.id,
				name: rolesTable.name,
				description: rolesTable.description,
			})
			.from(userRolesTable)
			.innerJoin(rolesTable, eq(userRolesTable.idRole, rolesTable.id))
			.where(eq(userRolesTable.idUser, userId));

		return userRoles;
	}
}
