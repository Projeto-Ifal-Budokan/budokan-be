import { z } from "zod";

// Helper function for time validation
const validateTimeFormat = (time: string) => {
	const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
	return timeRegex.test(time);
};

// Helper function for date validation
const validateDateFormat = (date: string) => {
	const timestamp = Date.parse(date);
	return !Number.isNaN(timestamp);
};

export const createSessionSchema = z
	.object({
		idInstructor: z.number().int().positive("ID do instrutor é obrigatório"),
		idDiscipline: z.number().int().positive("ID da disciplina é obrigatório"),
		date: z.string().refine(validateDateFormat, {
			message: "Data inválida. Utilize o formato YYYY-MM-DD",
		}),
		startingTime: z.string().refine(validateTimeFormat, {
			message: "Hora de início inválida. Utilize o formato HH:MM",
		}),
		endingTime: z.string().refine(validateTimeFormat, {
			message: "Hora de término inválida. Utilize o formato HH:MM",
		}),
		isLastSessionOfDay: z.boolean().default(false),
	})
	.refine(
		(data) => {
			// Converte os horários para minutos totais para comparação
			const [startHours, startMinutes] = data.startingTime
				.split(":")
				.map(Number);
			const [endHours, endMinutes] = data.endingTime.split(":").map(Number);

			const startTotal = startHours * 60 + startMinutes;
			const endTotal = endHours * 60 + endMinutes;

			return endTotal > startTotal;
		},
		{
			message: "O horário de término deve ser após o horário de início",
			path: ["endingTime"],
		},
	);

export const updateSessionSchema = z
	.object({
		idInstructor: z.number().int().positive().optional(),
		idDiscipline: z.number().int().positive().optional(),
		date: z
			.string()
			.refine(validateDateFormat, {
				message: "Data inválida. Utilize o formato YYYY-MM-DD",
			})
			.optional(),
		startingTime: z
			.string()
			.refine(validateTimeFormat, {
				message: "Hora de início inválida. Utilize o formato HH:MM",
			})
			.optional(),
		endingTime: z
			.string()
			.refine(validateTimeFormat, {
				message: "Hora de término inválida. Utilize o formato HH:MM",
			})
			.optional(),
		isLastSessionOfDay: z.boolean().optional(),
	})
	.refine(
		(data) => {
			// Se não informados ambos os horários, não precisa validar
			if (!data.startingTime || !data.endingTime) return true;

			// Converte os horários para minutos totais para comparação
			const [startHours, startMinutes] = data.startingTime
				.split(":")
				.map(Number);
			const [endHours, endMinutes] = data.endingTime.split(":").map(Number);

			const startTotal = startHours * 60 + startMinutes;
			const endTotal = endHours * 60 + endMinutes;

			return endTotal > startTotal;
		},
		{
			message: "O horário de término deve ser após o horário de início",
			path: ["endingTime"],
		},
	);

export const listSessionSchema = z
	.object({
		initialDate: z
			.string()
			.refine(validateDateFormat, {
				message: "Data inicial inválida. Utilize o formato YYYY-MM-DD",
			})
			.optional(),
		finalDate: z
			.string()
			.refine(validateDateFormat, {
				message: "Data final inválida. Utilize o formato YYYY-MM-DD",
			})
			.optional(),
		idInstructor: z.coerce.number().int().positive().optional(),
		idDiscipline: z.coerce.number().int().positive().optional(),
	})
	.refine(
		(data) => {
			// Se ambas as datas estiverem presentes, valida que a data final é depois da inicial
			if (data.initialDate && data.finalDate) {
				const initialDate = new Date(data.initialDate);
				const finalDate = new Date(data.finalDate);
				return finalDate >= initialDate;
			}
			return true;
		},
		{
			message: "A data final deve ser igual ou posterior à data inicial",
			path: ["finalDate"],
		},
	);

export const viewMatriculationSessionsSchema = z
	.object({
		idDiscipline: z.coerce
			.number()
			.int()
			.positive("ID da disciplina é obrigatório")
			.optional(),
		initialDate: z
			.string()
			.refine(validateDateFormat, {
				message: "Data inicial inválida. Utilize o formato YYYY-MM-DD",
			})
			.optional(),
		finalDate: z
			.string()
			.refine(validateDateFormat, {
				message: "Data final inválida. Utilize o formato YYYY-MM-DD",
			})
			.optional(),
	})
	.refine(
		(data) => {
			// Se ambas as datas estiverem presentes, valida que a data final é depois da inicial
			if (data.initialDate && data.finalDate) {
				const initialDate = new Date(data.initialDate);
				const finalDate = new Date(data.finalDate);
				return finalDate >= initialDate;
			}
			return true;
		},
		{
			message: "A data final deve ser igual ou posterior à data inicial",
			path: ["finalDate"],
		},
	);

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
export type ListSessionInput = z.infer<typeof listSessionSchema>;
export type ViewMatriculationSessionsInput = z.infer<
	typeof viewMatriculationSessionsSchema
>;
