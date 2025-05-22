import { z } from "zod";

export const createSessionSchema = z.object({
    idInstructor: z.number().int().positive("ID do instrutor é obrigatório"),
    idDiscipline: z.number().int().positive("ID da disciplina é obrigatório"),
    date: z.string().date("Data inválida"),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, "Hora de início inválida"),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, "Hora de término inválida"),
});

export const updateSessionSchema = z.object({
    idInstructor: z.number().int().positive().optional(),
    idDiscipline: z.number().int().positive().optional(),
    date: z.string().date("Data inválida").optional(),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, "Hora de início inválida").optional(),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, "Hora de término inválida").optional(),
});

export type CreateSessionInput = z.infer<
    typeof createSessionSchema
>;
export type UpdateSessionInput = z.infer<
    typeof updateSessionSchema
>;
