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
