import { Router } from "express";
import {
	assignRole,
	listUserRoles,
	removeRole,
} from "../controllers/user-role-controller";
import { hasPrivilege } from "../middlewares/auth/check-privilege.middleware";

const router = Router();

/**
 * @openapi
 * /user-roles/assign:
 *   post:
 *     tags:
 *       - Papéis de Usuário
 *     summary: Atribui um papel a um usuário
 *     description: Atribui um papel específico a um usuário do sistema
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignUserRoleInput'
 *     responses:
 *       200:
 *         description: Papel atribuído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Papel atribuído com sucesso"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário e papel são obrigatórios"
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token não fornecido ou inválido"
 *       403:
 *         description: Sem permissão
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Acesso negado"
 *       404:
 *         description: Usuário ou papel não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário ou papel não encontrado"
 *       409:
 *         description: Papel já atribuído
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário já possui este papel"
 */
router.post("/assign", hasPrivilege("update_user_roles"), assignRole);

/**
 * @openapi
 * /user-roles/remove:
 *   post:
 *     tags:
 *       - Papéis de Usuário
 *     summary: Remove um papel de um usuário
 *     description: Remove um papel específico de um usuário do sistema
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RemoveUserRoleInput'
 *     responses:
 *       200:
 *         description: Papel removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Papel removido com sucesso"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário e papel são obrigatórios"
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token não fornecido ou inválido"
 *       403:
 *         description: Sem permissão
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Acesso negado"
 *       404:
 *         description: Usuário ou papel não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário ou papel não encontrado"
 */
router.post("/remove", hasPrivilege("update_user_roles"), removeRole);

/**
 * @openapi
 * /user-roles/{id}:
 *   get:
 *     tags:
 *       - Papéis de Usuário
 *     summary: Lista os papéis de um usuário
 *     description: Retorna todos os papéis atribuídos a um usuário específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Lista de papéis retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         format: int64
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token não fornecido ou inválido"
 *       403:
 *         description: Sem permissão
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Acesso negado"
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário não encontrado"
 */
router.get("/:id", hasPrivilege("view_user_roles"), listUserRoles);

export default router;
