import { z } from "zod";

export const registerSchema = z.object({
	firstName: z.string().min(1, "Nome é obrigatório"),
	surname: z.string().min(1, "Sobrenome é obrigatório"),
	phone: z.string(),
	birthDate: z.string(), // Will be converted to Date in the controller
	email: z.string().email("Email inválido"),
	password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export const loginSchema = z.object({
	email: z.string().email("Email inválido"),
	password: z.string().min(1, "Senha é obrigatória"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
	email: z.string().email(),
});

export const resetPasswordSchema = z.object({
	token: z.string(),
	password: z.string().min(6),
});
