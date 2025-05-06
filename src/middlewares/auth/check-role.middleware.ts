import { eq } from "drizzle-orm";
import type { NextFunction, Response } from "express";
import { db } from "../../db";
import { userRolesTable } from "../../db/schema/user-schemas/user-roles";
import type { AuthenticatedRequest } from "../../types/auth.types";

export const hasRole = (requiredRole: string) => {
	return async (
		req: AuthenticatedRequest,
		res: Response,
		next: NextFunction,
	) => {
		const userId = req.user?.id;

		if (!userId) {
			return res.status(401).json({ message: "Não autenticado" });
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
				return res.status(403).json({
					message: "Você não tem permissão para acessar este recurso",
				});
			}

			next();
		} catch (error) {
			console.error("Erro ao verificar roles:", error);
			return res.status(500).json({ message: "Erro interno do servidor" });
		}
	};
};
