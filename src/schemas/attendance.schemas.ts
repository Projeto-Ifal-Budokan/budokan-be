import { z } from "zod";

export const createAttendanceSchema = z.object({
    idSession: z.number().int().positive("O ID da aula é obrigatório"),
});

export const createAttendanceDailySchema = z.object({
    idDailySession: z.number().int().positive("O ID da aula é obrigatório"),
});

export const updateAttendanceSchema = z.object({
    attendances: z.array(
        z.object({
            idMatriculation: z.number().int().positive("O ID da matrícula é obrigatório"),
            status: z.enum(["present", "absent"], {
                required_error: "O status é obrigatório",
            }),
        })
    ).min(1, "É necessário ao menos uma matrícula"),
});

export const justificationAttendanceSchema = z.object({
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
    ]),
    justificationDescription: z
        .string()
        .max(255, "A descrição da justificativa deve ter no máximo 255 caracteres")
        .optional(),
});

export type CreateAttendanceInput = z.infer<
    typeof createAttendanceSchema
>;
export type CreateAttendanceDailyInput = z.infer<
    typeof createAttendanceDailySchema
>;
export type UpdateAttendanceInput = z.infer<
    typeof updateAttendanceSchema
>;
export type JustificationAttendanceInput = z.infer<
    typeof justificationAttendanceSchema
>;