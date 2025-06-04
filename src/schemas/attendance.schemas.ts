import { z } from "zod";

export const createAttendanceSchema = z.object({
	idSession: z.number().int().positive("O ID da aula é obrigatório"),
});

export const updateAttendanceSchema = z.object({
	attendances: z
		.array(
			z.object({
				idMatriculation: z
					.number()
					.int()
					.positive("O ID da matrícula é obrigatório"),
				status: z.enum(["present", "absent"], {
					required_error: "O status é obrigatório",
				}),
			}),
		)
		.min(1, "É necessário ao menos uma matrícula"),
});

export const justificationSchema = z.object({
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

export const createDailyAbsenceSchema = z.object({
	idMatriculation: z.number().int().positive("O ID da matrícula é obrigatório"),
	date: z.string().refine(
		(date) => {
			const timestamp = Date.parse(date);
			return !Number.isNaN(timestamp);
		},
		{
			message: "Data inválida. Utilize o formato YYYY-MM-DD",
		},
	),
	...justificationSchema.shape,
});

export const updateDailyAbsenceSchema = z.object({
	...justificationSchema.shape,
});

export type CreateAttendanceInput = z.infer<typeof createAttendanceSchema>;
export type UpdateAttendanceInput = z.infer<typeof updateAttendanceSchema>;
export type JustificationInput = z.infer<typeof justificationSchema>;
export type CreateDailyAbsenceInput = z.infer<typeof createDailyAbsenceSchema>;
export type UpdateDailyAbsenceInput = z.infer<typeof updateDailyAbsenceSchema>;
