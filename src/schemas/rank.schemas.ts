import { z } from "zod";

export const createRankSchema = z.object({
	idDiscipline: z.number().positive("Disciplina é obrigatória"),
	name: z.string().min(2, "Nome é obrigatório").max(100),
	description: z.string().min(2, "Descrição é obrigatória").max(100),
});

export const updateRankSchema = z.object({
	idDiscipline: z.number().positive().optional(),
	name: z.string().min(2).max(100).optional(),
	description: z.string().min(2).max(100).optional(),
});

export type CreateRankInput = z.infer<typeof createRankSchema>;
export type UpdateRankInput = z.infer<typeof updateRankSchema>;
