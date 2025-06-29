import { eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import { db } from "../../db";
import { userRolesTable } from "../../db/schema/user-schemas/user-roles";
import { ForbiddenError, UnauthorizedError } from "../../errors/app-errors";
import type { User } from "../../types/auth.types";

export const hasPrivilege = (requiredPrivileges: string | string[]) => {
	const privileges = Array.isArray(requiredPrivileges)
		? requiredPrivileges
		: [requiredPrivileges];

	return async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const user = req.user as User | undefined;
		const userId = user?.id;

		if (!userId) {
			next(new UnauthorizedError("Não autenticado"));
			return;
		}

		try {
			// Primeiro, pegamos todos os roles do usuário
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

			// Verifica se o usuário tem pelo menos um dos privilégios requeridos
			const hasRequiredPrivilege = privileges.some((privilege) =>
				userPrivileges.includes(privilege),
			);

			if (!hasRequiredPrivilege) {
				next(
					new ForbiddenError(
						"Você não tem permissão para acessar este recurso",
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
