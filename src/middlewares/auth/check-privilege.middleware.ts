import { eq } from "drizzle-orm";
import type { NextFunction, Response } from "express";
import { db } from "../../db";
import { rolesPrivilegesTable } from "../../db/schema/user-schemas/roles-privileges";
import { userRolesTable } from "../../db/schema/user-schemas/user-roles";
import type { AuthenticatedRequest } from "../../types/auth.types";

export const hasPrivilege = (requiredPrivilege: string) => {
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
				return res.status(403).json({
					message: "Você não tem permissão para acessar este recurso",
				});
			}

			next();
		} catch (error) {
			console.error("Erro ao verificar privilégios:", error);
			return res.status(500).json({ message: "Erro interno do servidor" });
		}
	};
};
