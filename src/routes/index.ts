import { Request, Response, Router } from "express";
import passport from "../../passport.ts";

import authRoutes from "./auth-routes.ts";
import privilegeRoutes from "./privilege-routes.ts";
import rolePrivilegeRoutes from "./role-privilege-routes.ts";
import roleRoutes from "./role-routes.ts";
import userRoleRoutes from "./user-role-routes.ts";
import userRoutes from "./user-routes.ts";

const router = Router();

/**
 * @openapi
 * /:
 *   get:
 *     tags:
 *       - Sistema
 *     summary: Informações da API
 *     description: Retorna informações básicas sobre a API
 *     responses:
 *       200:
 *         description: Informações retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bem-vindo à API do Portal Budokan"
 *                 status:
 *                   type: string
 *                   example: "online"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 */
router.get("/", (req, res) => {
	res.json({
		message: "Bem-vindo à API do Portal Budokan",
		status: "online",
		version: "1.0.0",
	});
});

router.use("/auth", authRoutes);
router.use(
	"/users",
	passport.authenticate("jwt", { session: false }),
	userRoutes,
);
router.use(
	"/roles",
	passport.authenticate("jwt", { session: false }),
	roleRoutes,
);
router.use(
	"/privileges",
	passport.authenticate("jwt", { session: false }),
	privilegeRoutes,
);
router.use(
	"/user-roles",
	passport.authenticate("jwt", { session: false }),
	userRoleRoutes,
);
router.use(
	"/role-privileges",
	passport.authenticate("jwt", { session: false }),
	rolePrivilegeRoutes,
);

/**
 * @openapi
 * /protected:
 *   get:
 *     tags:
 *       - Sistema
 *     summary: Rota protegida de exemplo
 *     description: Exemplo de rota que requer autenticação JWT
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Acesso permitido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Você acessou uma rota protegida!"
 *                 user:
 *                   type: object
 *                   description: Informações do usuário autenticado
 *       401:
 *         description: Não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Não autorizado"
 */
router.get(
	"/protected",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		res
			.status(200)
			.json({ message: "Você acessou uma rota protegida!", user: req.user });
	},
);

export default router;
