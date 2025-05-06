import { z } from "zod";

export const assignUserRoleSchema = z.object({
	idUser: z.number().positive(),
	idRole: z.number().positive(),
});

export const removeUserRoleSchema = assignUserRoleSchema;

export type AssignUserRoleInput = z.infer<typeof assignUserRoleSchema>;
export type RemoveUserRoleInput = z.infer<typeof removeUserRoleSchema>;
