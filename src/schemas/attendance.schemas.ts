import { z } from "zod";

export const createAttendanceSchema = z.object({
    idSession: z.number().int().positive("O ID da aula é obrigatório"),
});

export const updateAttendanceSchema = z.object({
    status: z.enum(["present", "absent"]).optional(),
    justification: z.enum([
        "medical",
        "personal",
        "professional",
        "weather",
        "transport",
        "family",
        "academic",
        "technical",
        "emergency",
        "other",
    ]).optional(),
    justificationDescription: z
        .string()
        .max(255, "A descrição da justificativa deve ter no máximo 255 caracteres")
        .optional(),
});

export type CreateAttendanceInput = z.infer<
    typeof createAttendanceSchema
>;
export type UpdateAttendanceInput = z.infer<
    typeof updateAttendanceSchema
>;
