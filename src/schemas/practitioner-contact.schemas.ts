import { z } from "zod";

export const createPractitionerContactSchema = z.object({
	idPractitioner: z.number(),
	phone: z.string().min(1, "Telefone é obrigatório"),
	relationship: z.string().min(1, "Relacionamento é obrigatório").max(100),
});

export const updatePractitionerContactSchema = z.object({
	phone: z.string().min(1, "Telefone é obrigatório").optional(),
	relationship: z
		.string()
		.min(1, "Relacionamento é obrigatório")
		.max(100)
		.optional(),
});

export const practitionerContactParamsSchema = z.object({
	id: z.string().transform((id) => Number.parseInt(id, 10)),
});

// Type exports
export type CreatePractitionerContactInput = z.infer<
	typeof createPractitionerContactSchema
>;
export type UpdatePractitionerContactInput = z.infer<
	typeof updatePractitionerContactSchema
>;
export type PractitionerContactParams = z.infer<
	typeof practitionerContactParamsSchema
>;
