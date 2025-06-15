import { z } from "zod";

export const createPixKeySchema = z.object({
    idInstructor: z.number().int().positive("ID do estudante é obrigatório"),
    type: z.enum(["email", "cpf", "phone", "randomKey"]),
    key: z.string().min(2).max(100),
    description: z.string().min(2).max(100).optional()
});

export const updatePixKeySchema = z.object({
    idInstructor: z.number().int().positive("ID do estudante é obrigatório"),
    type: z.enum(["email", "cpf", "phone", "randomKey"]).optional(),
    key: z.string().min(2).max(100).optional(),
    description: z.string().min(2).max(100).optional()
});

export type CreatePixKeyInput = z.infer<
    typeof createPixKeySchema
>;
export type UpdatePixKeyInput = z.infer<
    typeof updatePixKeySchema
>;
