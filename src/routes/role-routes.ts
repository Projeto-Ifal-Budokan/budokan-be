import { Router } from "express";
import {
	createRole,
	deleteRole,
	getRoleById,
	listRoles,
	updateRole,
} from "../controllers/role-controller";
import { hasPrivilege } from "../middlewares/auth/check-privilege.middleware";

const router = Router();

/**
 * @openapi
 * /roles:
 *   get:
 *     tags:
 *       - Papéis
 *     summary: Lista todos os papéis
 *     description: Retorna uma lista de todos os papéis cadastrados no sistema
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de papéis retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "role_id"
 *                       name:
 *                         type: string
 *                         example: "admin"
 *                       description:
 *                         type: string
 *                         example: "Administrador do sistema"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-03-20T10:00:00Z"
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
 */
router.get("/", hasPrivilege("list_roles"), listRoles);

/**
 * @openapi
 * /roles/{id}:
 *   get:
 *     tags:
 *       - Papéis
 *     summary: Busca um papel por ID
 *     description: Retorna os detalhes de um papel específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do papel
 *     responses:
 *       200:
 *         description: Papel encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "role_id"
 *                 name:
 *                   type: string
 *                   example: "admin"
 *                 description:
 *                   type: string
 *                   example: "Administrador do sistema"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-03-20T10:00:00Z"
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
router.get("/:id", hasPrivilege("view_role"), getRoleById);

/**
 * @openapi
 * /roles:
 *   post:
 *     tags:
 *       - Papéis
 *     summary: Cria um novo papel
 *     description: Cria um novo papel no sistema com os privilégios especificados
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: "admin"
 *               description:
 *                 type: string
 *                 example: "Administrador do sistema"
 *               privileges:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["create_user", "delete_user"]
 *     responses:
 *       201:
 *         description: Papel criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Papel criado com sucesso"
 *                 role:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "role_id"
 *                     name:
 *                       type: string
 *                       example: "admin"
 *                     description:
 *                       type: string
 *                       example: "Administrador do sistema"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-03-20T10:00:00Z"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Nome e descrição são obrigatórios"
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
 */
router.post("/", hasPrivilege("create_role"), createRole);

/**
 * @openapi
 * /roles/{id}:
 *   put:
 *     tags:
 *       - Papéis
 *     summary: Atualiza um papel
 *     description: Atualiza os dados de um papel existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do papel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "admin"
 *               description:
 *                 type: string
 *                 example: "Administrador do sistema"
 *               privileges:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["create_user", "delete_user"]
 *     responses:
 *       200:
 *         description: Papel atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Papel atualizado com sucesso"
 *                 role:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "role_id"
 *                     name:
 *                       type: string
 *                       example: "admin"
 *                     description:
 *                       type: string
 *                       example: "Administrador do sistema"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-03-20T10:00:00Z"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Dados inválidos para atualização"
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
router.put("/:id", hasPrivilege("update_role"), updateRole);

/**
 * @openapi
 * /roles/{id}:
 *   delete:
 *     tags:
 *       - Papéis
 *     summary: Remove um papel
 *     description: Remove um papel existente do sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do papel
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
router.delete("/:id", hasPrivilege("delete_role"), deleteRole);

export default router;
