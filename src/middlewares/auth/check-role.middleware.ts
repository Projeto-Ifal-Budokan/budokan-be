import { eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import { db } from "../../db";
import { userRolesTable } from "../../db/schema/user-schemas/user-roles";
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
			res.status(401).json({ message: "Não autenticado" });
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
				res.status(403).json({
					message: "Você não tem permissão para acessar este recurso",
				});
				return;
			}

			next();
		} catch (error) {
			console.error("Erro ao verificar roles:", error);
			res.status(500).json({ message: "Erro interno do servidor" });
			return;
		}
	};
};
