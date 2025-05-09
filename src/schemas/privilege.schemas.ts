/**
 * @openapi
 * components:
 *   schemas:
 *     CreatePrivilegeInput:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: "create_user"
 *         description:
 *           type: string
 *           minLength: 2
 *           maxLength: 255
 *           example: "Permite criar novos usuários"
 *     UpdatePrivilegeInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: "create_user"
 *         description:
 *           type: string
 *           minLength: 2
 *           maxLength: 255
 *           example: "Permite criar novos usuários"
 */

import { z } from "zod";

export const createPrivilegeSchema = z.object({
	name: z.string().min(2, "Nome é obrigatório").max(100),
	description: z.string().min(2, "Descrição é obrigatória").max(255),
});

export const updatePrivilegeSchema = z.object({
	name: z.string().min(2).max(100).optional(),
	description: z.string().min(2).max(255).optional(),
});

export type CreatePrivilegeInput = z.infer<typeof createPrivilegeSchema>;
export type UpdatePrivilegeInput = z.infer<typeof updatePrivilegeSchema>;
