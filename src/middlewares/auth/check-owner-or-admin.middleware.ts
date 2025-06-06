import { eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import { db } from "../../db";
import { userRolesTable } from "../../db/schema/user-schemas/user-roles";
import { ForbiddenError, UnauthorizedError } from "../../errors/app-errors";
import type { User } from "../../types/auth.types";

/**
 * Middleware que verifica se o usuário é o proprietário do recurso (ID igual ao ID do usuário logado)
 * ou se possui o privilégio de administrador especificado.
 *
 * @param adminPrivilege O privilégio de administrador necessário para acessar o recurso de outro usuário
 * @returns Middleware Express
 */
export const isOwnerOrHasPrivilege = (adminPrivilege = "admin") => {
	return async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const user = req.user as User | undefined;
		const userId = user?.id;
		const requestedId = Number(req.params.id);

		// Verifica se o usuário está autenticado
		if (!userId) {
			next(new UnauthorizedError("Não autenticado"));
			return;
		}

		// Se o ID solicitado é o mesmo do usuário logado, permite o acesso
		if (userId === requestedId) {
			next();
			return;
		}

		try {
			// Caso contrário, verifica se o usuário tem o privilégio de administrador
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

			// Extrai todos os privilégios do usuário
			const userPrivileges = userRoles.flatMap((userRole) =>
				userRole.role.rolePrivileges.map((rp) => rp.privilege.name),
			);

			// Verifica se o usuário tem o privilégio de administrador necessário
			const hasAdminPrivilege = userPrivileges.includes(adminPrivilege);

			if (!hasAdminPrivilege) {
				next(
					new ForbiddenError(
						"Você não tem permissão para modificar ou acessar recursos de outros usuários",
					),
				);
				return;
			}

			next();
		} catch (error) {
			next(error);
		}
	};
};
