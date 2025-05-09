/**
 * @openapi
 * components:
 *   schemas:
 *     CreateRoleInput:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: "admin"
 *         description:
 *           type: string
 *           minLength: 2
 *           maxLength: 255
 *           example: "Administrador do sistema"
 *     UpdateRoleInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: "admin"
 *         description:
 *           type: string
 *           minLength: 2
 *           maxLength: 255
 *           example: "Administrador do sistema"
 */

import { z } from "zod";

export const createRoleSchema = z.object({
	name: z.string().min(2, "Nome é obrigatório").max(100),
	description: z.string().min(2, "Descrição é obrigatória").max(255),
});

export const updateRoleSchema = z.object({
	name: z.string().min(2).max(100).optional(),
	description: z.string().min(2).max(255).optional(),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
