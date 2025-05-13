import { eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import { db } from "../../db";
import { userRolesTable } from "../../db/schema/user-schemas/user-roles";
import type { User } from "../../types/auth.types";

export const hasPrivilege = (requiredPrivilege: string) => {
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

			// Verifica se algum dos roles do usuário tem o privilégio necessário
			const hasRequiredPrivilege = userRoles.some((userRole) =>
				userRole.role.rolePrivileges.some(
					(rp) => rp.privilege.name === requiredPrivilege,
				),
			);

			if (!hasRequiredPrivilege) {
				res.status(403).json({
					message: "Você não tem permissão para acessar este recurso",
				});
				return;
			}

			next();
		} catch (error) {
			console.error("Erro ao verificar privilégios:", error);
			res.status(500).json({ message: "Erro interno do servidor" });
			return;
		}
	};
};
