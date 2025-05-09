import { z } from "zod";

export const registerSchema = z.object({
	firstName: z.string().min(2, "Nome é obrigatório").max(50),
	surname: z.string().min(2, "Sobrenome é obrigatório").max(50),
	phone: z.string(),
	birthDate: z.string(), // Will be converted to Date in the controller
	email: z.string().email("Email inválido"),
	password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
	isPractitioner: z.boolean(),
	healthObservations: z.string().optional(),
});

export const loginSchema = z.object({
	email: z.string().email("Email inválido"),
	password: z.string().min(1, "Senha é obrigatória"),
});

export const forgotPasswordSchema = z.object({
	email: z.string().email("Email inválido"),
});

export const resetPasswordSchema = z.object({
	token: z.string(),
	password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
