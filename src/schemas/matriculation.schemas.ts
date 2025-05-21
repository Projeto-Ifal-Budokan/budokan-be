import { z } from "zod";

export const createMatriculationSchema = z.object({
	idStudent: z.number().int().positive("ID do estudante é obrigatório"),
	idDiscipline: z.number().int().positive("ID da disciplina é obrigatório"),
	idRank: z.number().int().positive("ID da graduação").optional(),
	status: z.enum(["active", "inactive", "suspended"]).optional(),
	isPaymentExempt: z.enum(["Y", "N"]).optional(),
	activatedBy: z.number().int().positive().optional(),
});

export const updateMatriculationSchema = z.object({
	idRank: z.number().int().positive().optional(),
	status: z.enum(["active", "inactive", "suspended"]).optional(),
	isPaymentExempt: z.enum(["Y", "N"]).optional(),
	activatedBy: z.number().int().positive().optional(),
	inactivatedBy: z.number().int().positive().optional(),
});

export type CreateMatriculationInput = z.infer<
	typeof createMatriculationSchema
>;
export type UpdateMatriculationInput = z.infer<
	typeof updateMatriculationSchema
>;
