import { Router } from "express";
import {
	assignPrivilege,
	listRolePrivileges,
	removePrivilege,
} from "../controllers/role-privilege-controller";
import { hasPrivilege } from "../middlewares/auth/check-privilege.middleware";

const router = Router();

/**
 * @openapi
 * /role-privileges/assign:
 *   post:
 *     tags:
 *       - Privilégios de Papel
 *     summary: Atribui um privilégio a um papel
 *     description: Atribui um privilégio específico a um papel do sistema
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignRolePrivilegeInput'
 *     responses:
 *       200:
 *         description: Privilégio atribuído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Privilégio atribuído com sucesso"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Papel e privilégio são obrigatórios"
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
 *         description: Papel ou privilégio não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Papel ou privilégio não encontrado"
 *       409:
 *         description: Privilégio já atribuído
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Papel já possui este privilégio"
 */
router.post("/assign", hasPrivilege("update_role_privileges"), assignPrivilege);

/**
 * @openapi
 * /role-privileges/remove:
 *   post:
 *     tags:
 *       - Privilégios de Papel
 *     summary: Remove um privilégio de um papel
 *     description: Remove um privilégio específico de um papel do sistema
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RemoveRolePrivilegeInput'
 *     responses:
 *       200:
 *         description: Privilégio removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Privilégio removido com sucesso"
 *                 removedPrivilege:
 *                   type: object
 *                   properties:
 *                     idRole:
 *                       type: integer
 *                       format: int64
 *                     idPrivilege:
 *                       type: integer
 *                       format: int64
 *                     removedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Papel e privilégio são obrigatórios"
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
 *         description: Papel ou privilégio não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Papel ou privilégio não encontrado"
 */
router.post("/remove", hasPrivilege("update_role_privileges"), removePrivilege);

/**
 * @openapi
 * /role-privileges/{id}:
 *   get:
 *     tags:
 *       - Privilégios de Papel
 *     summary: Lista os privilégios de um papel
 *     description: Retorna todos os privilégios atribuídos a um papel específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         description: ID do papel
 *     responses:
 *       200:
 *         description: Lista de privilégios retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 privileges:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         format: int64
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       assignedAt:
 *                         type: string
 *                         format: date-time
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
 *         description: Papel não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Papel não encontrado"
 */
router.get("/:id", hasPrivilege("view_role_privileges"), listRolePrivileges);

export default router;
