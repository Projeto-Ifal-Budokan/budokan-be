import { z } from "zod";

export const createRoleSchema = z.object({
	name: z.string().min(2, "Nome é obrigatório").max(100),
	description: z.string().min(2, "Descrição é obrigatória").max(255),
});

export const updateRoleSchema = z.object({
	name: z.string().min(2).max(100).optional(),
	description: z.string().min(2).max(255).optional(),
});

export const listRoleSchema = z.object({
	name: z.string().min(2).max(100).optional(),
	description: z.string().min(2).max(255).optional(),
	idPrivilege: z.coerce.number().int().positive().optional(),
	namePrivilege: z.string().min(2).max(100).optional(),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type ListRoleInput = z.infer<typeof listRoleSchema>;