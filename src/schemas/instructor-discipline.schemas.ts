import e from "express";
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

export const listInstructorDisciplineSchema = z.object({
	idInstructor: z.coerce.number().int().positive().optional(),
	idDiscipline: z.coerce.number().int().positive().optional(),
	status: z.enum(["active", "inactive", "suspended"]).optional()
});

export type CreateInstructorDisciplineInput = z.infer<
	typeof createInstructorDisciplineSchema
>;
export type UpdateInstructorDisciplineInput = z.infer<
	typeof updateInstructorDisciplineSchema
>;
export type ListInstructorDisciplineInput = z.infer<
	typeof listInstructorDisciplineSchema
>;

// Tipos para os dados retornados que incluem o nome do instrutor
export type InstructorDisciplineWithInstructorName = {
	id: number;
	idInstructor: number;
	instructorName: string;
	instructorProfileImageUrl: string | null;
	idDiscipline: number;
	disciplineName: string;
	idRank: number | null;
	rankName: string | null;
	status: string;
	activatedBy: number | null;
	inactivatedBy: number | null;
	createdAt: Date;
	updatedAt: Date | null;
};

export type InstructorDisciplineListResponse = {
	items: InstructorDisciplineWithInstructorName[];
	count: number;
};
