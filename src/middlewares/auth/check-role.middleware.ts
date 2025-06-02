import { eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import { db } from "../../db";
import { userRolesTable } from "../../db/schema/user-schemas/user-roles";
import { ForbiddenError, UnauthorizedError } from "../../errors/app-errors";
import type { User } from "../../types/auth.types";

export const hasRole = (requiredRole: string) => {
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
			const userRoles = await db.query.userRolesTable.findMany({
				where: eq(userRolesTable.idUser, userId),
				with: {
					role: true,
				},
			});

			const hasRequiredRole = userRoles.some(
				(ur) => ur.role.name === requiredRole,
			);

			if (!hasRequiredRole) {
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
