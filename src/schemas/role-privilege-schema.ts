/**
 * @openapi
 * components:
 *   schemas:
 *     AssignRolePrivilegeInput:
 *       type: object
 *       required:
 *         - idRole
 *         - idPrivilege
 *       properties:
 *         idRole:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *           example: 1
 *         idPrivilege:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *           example: 1
 *     RemoveRolePrivilegeInput:
 *       $ref: '#/components/schemas/AssignRolePrivilegeInput'
 */

import { z } from "zod";

export const assignRolePrivilegeSchema = z.object({
	idRole: z.number().positive(),
	idPrivilege: z.number().positive(),
});

export const removeRolePrivilegeSchema = assignRolePrivilegeSchema;

export type AssignRolePrivilegeInput = z.infer<
	typeof assignRolePrivilegeSchema
>;
export type RemoveRolePrivilegeInput = z.infer<
	typeof removeRolePrivilegeSchema
>;
