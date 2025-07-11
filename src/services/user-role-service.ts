import { and, count, eq } from "drizzle-orm";
import { db } from "../db";
import { rolesTable } from "../db/schema/user-schemas/roles";
import { userRolesTable } from "../db/schema/user-schemas/user-roles";
import { usersTable } from "../db/schema/user-schemas/users";
import {
	ConflictError,
	ForbiddenError,
	NotFoundError,
	UnauthorizedError,
} from "../errors/app-errors";
import type {
	AssignUserRoleInput,
	RemoveUserRoleInput,
} from "../schemas/user-role-schema";
import type { User } from "../types/auth.types";

export class UserRoleService {
	async assignRole(
		{ idUser, idRole }: AssignUserRoleInput,
		currentUser?: User,
	) {
		// Check if user is authenticated
		if (!currentUser) {
			throw new UnauthorizedError("Não autenticado");
		}

		// Check if user is owner or has admin privilege
		if (currentUser.id !== idUser) {
			// User is trying to modify another user's roles, check for admin privilege
			const userRoles = await db.query.userRolesTable.findMany({
				where: eq(userRolesTable.idUser, currentUser.id),
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

			// Extract all user privileges
			const userPrivileges = userRoles.flatMap((userRole) =>
				userRole.role.rolePrivileges.map((rp) => rp.privilege.name),
			);

			// Check if user has admin privilege
			const hasAdminPrivilege = userPrivileges.includes("admin");

			if (!hasAdminPrivilege) {
				throw new ForbiddenError(
					"Você não tem permissão para modificar cargos de outros usuários",
				);
			}
		}

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
			throw new NotFoundError("Cargo não encontrado");
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
			throw new ConflictError("Usuário já possui este cargo");
		}

		// Assign role to user
		await db.insert(userRolesTable).values({
			idUser,
			idRole,
		});

		return { message: "Cargo atribuído com sucesso" };
	}

	async removeRole(
		{ idUser, idRole }: RemoveUserRoleInput,
		currentUser?: User,
	) {
		// Check if user is authenticated
		if (!currentUser) {
			throw new UnauthorizedError("Não autenticado");
		}

		// Check if user is owner or has admin privilege
		if (currentUser.id !== idUser) {
			// User is trying to modify another user's roles, check for admin privilege
			const userRoles = await db.query.userRolesTable.findMany({
				where: eq(userRolesTable.idUser, currentUser.id),
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

			// Extract all user privileges
			const userPrivileges = userRoles.flatMap((userRole) =>
				userRole.role.rolePrivileges.map((rp) => rp.privilege.name),
			);

			// Check if user has admin privilege
			const hasAdminPrivilege = userPrivileges.includes("admin");

			if (!hasAdminPrivilege) {
				throw new ForbiddenError(
					"Você não tem permissão para modificar cargos de outros usuários",
				);
			}
		}

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
			throw new NotFoundError("Usuário não possui este cargo");
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

		return { message: "Cargo removido com sucesso" };
	}

	async listUserRoles(
		userId: number,
		pagination?: { limit: number; offset: number },
	) {
		// Check if user exists
		const user = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.id, userId));

		if (user.length === 0) {
			throw new NotFoundError("Usuário não encontrado");
		}

		const { limit, offset } = pagination || { limit: 10, offset: 0 };

		// Get user roles with role details (paginated)
		const [userRoles, [{ count: total }]] = await Promise.all([
			db
				.select({
					id: rolesTable.id,
					name: rolesTable.name,
					description: rolesTable.description,
				})
				.from(userRolesTable)
				.innerJoin(rolesTable, eq(userRolesTable.idRole, rolesTable.id))
				.where(eq(userRolesTable.idUser, userId))
				.limit(limit)
				.offset(offset),
			db
				.select({ count: count() })
				.from(userRolesTable)
				.where(eq(userRolesTable.idUser, userId)),
		]);

		return { items: userRoles, count: Number(total) };
	}
}
