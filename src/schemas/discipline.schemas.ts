import { z } from "zod";

export const createDisciplineSchema = z.object({
    name: z.string().min(2, "Nome é obrigatório").max(100),
    description: z.string().min(2, "Descrição é obrigatória").max(255),
});

export const updateDisciplineSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().min(2).max(255).optional(),
    status: z.enum(["active", "inactive"]).optional(),
});

export const listDisciplineSchema = z.object({
    status: z.enum(["active", "inactive", "suspended"]).optional(),
});

export type CreateDisciplineInput = z.infer<typeof createDisciplineSchema>;
export type UpdateDisciplineInput = z.infer<typeof updateDisciplineSchema>;
export type ListDisciplineInput = z.infer<typeof listDisciplineSchema>;