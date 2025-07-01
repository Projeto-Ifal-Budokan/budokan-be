import { z } from "zod";

export const createAchievmentSchema = z.object({
    idPractitioner: z.number().int().positive({ message: "Praticante é obrigatório" }),
    title: z.string().min(2, "Título é obrigatório").max(100),
    description: z.string().min(2, "Descrição é obrigatória").max(255),
    achievementDate: z.string().min(10, "Data é obrigatória"), // ISO date string
});

export const updateAchievmentSchema = z.object({
    idPractitioner: z.number().int().positive().optional(),
    title: z.string().min(2).max(100).optional(),
    description: z.string().min(2).max(255).optional(),
    achievementDate: z.string().min(10).optional(),
});

export const listAchievmentSchema = z.object({
    idPractitioner: z.number().int().positive().optional(),
});

export type CreateAchievmentInput = z.infer<typeof createAchievmentSchema>;
export type UpdateAchievmentInput = z.infer<typeof updateAchievmentSchema>;
export type ListAchievmentInput = z.infer<typeof listAchievmentSchema>; 