import { z } from "zod";

export const createInstructorDisciplineSchema = z.object({
	idInstructor: z.number().int().positive("ID do instrutor é obrigatório"),
	idDiscipline: z.number().int().positive("ID da disciplina é obrigatório"),
	idRank: z.number().int().positive("ID da graduação é obrigatório"),
	status: z.enum(["active", "inactive", "suspended"]).optional(),
	activatedBy: z.number().int().positive().optional(),
});

export const updateInstructorDisciplineSchema = z.object({
	idRank: z.number().int().positive().optional(),
	status: z.enum(["active", "inactive", "suspended"]).optional(),
	activatedBy: z.number().int().positive().optional(),
	inactivatedBy: z.number().int().positive().optional(),
});

export type CreateInstructorDisciplineInput = z.infer<
	typeof createInstructorDisciplineSchema
>;
export type UpdateInstructorDisciplineInput = z.infer<
	typeof updateInstructorDisciplineSchema
>;
