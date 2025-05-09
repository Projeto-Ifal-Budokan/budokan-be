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
