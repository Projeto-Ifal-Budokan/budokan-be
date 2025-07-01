import { z } from "zod";

export const createTrainingScheduleSchema = z.object({
	idDiscipline: z.number().positive("ID da disciplina é obrigatório"),
	weekday: z.enum(
		[
			"monday",
			"tuesday",
			"wednesday",
			"thursday",
			"friday",
			"saturday",
			"sunday",
		],
		{
			errorMap: () => ({ message: "Dia da semana inválido" }),
		},
	),
	startTime: z
		.string()
		.regex(
			/^([01]\d|2[0-3]):([0-5]\d)$/,
			"Formato de hora inválido (HH:MM)",
		),
	endTime: z
		.string()
		.regex(
			/^([01]\d|2[0-3]):([0-5]\d)$/,
			"Formato de hora inválido (HH:MM)",
		),
});

export const updateTrainingScheduleSchema = z.object({
	idDiscipline: z.number().positive().optional(),
	weekday: z
		.enum(
			[
				"monday",
				"tuesday",
				"wednesday",
				"thursday",
				"friday",
				"saturday",
				"sunday",
			],
			{
				errorMap: () => ({ message: "Dia da semana inválido" }),
			},
		)
		.optional(),
	startTime: z
		.string()
		.regex(
			/^([01]\d|2[0-3]):([0-5]\d)$/,
			"Formato de hora inválido (HH:MM)",
		)
		.optional(),
	endTime: z
		.string()
		.regex(
			/^([01]\d|2[0-3]):([0-5]\d)$/,
			"Formato de hora inválido (HH:MM)",
		)
		.optional(),
});

export type CreateTrainingScheduleInput = z.infer<
	typeof createTrainingScheduleSchema
>;
export type UpdateTrainingScheduleInput = z.infer<
	typeof updateTrainingScheduleSchema
>;
