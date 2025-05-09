/**
 * @openapi
 * components:
 *   schemas:
 *     AssignUserRoleInput:
 *       type: object
 *       required:
 *         - idUser
 *         - idRole
 *       properties:
 *         idUser:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *           example: 1
 *         idRole:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *           example: 1
 *     RemoveUserRoleInput:
 *       $ref: '#/components/schemas/AssignUserRoleInput'
 */

import { z } from "zod";

export const assignUserRoleSchema = z.object({
	idUser: z.number().positive(),
	idRole: z.number().positive(),
});

export const removeUserRoleSchema = assignUserRoleSchema;

export type AssignUserRoleInput = z.infer<typeof assignUserRoleSchema>;
export type RemoveUserRoleInput = z.infer<typeof removeUserRoleSchema>;
