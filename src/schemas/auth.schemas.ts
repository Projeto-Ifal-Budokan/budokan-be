import { z } from "zod";

const emergencyContactSchema = z.object({
	phone: z.string().min(1, "Telefone é obrigatório"),
	relationship: z.string().min(1, "Relacionamento é obrigatório").max(100),
});

export const registerSchema = z
	.object({
		firstName: z.string().min(2, "Nome é obrigatório").max(50),
		surname: z.string().min(2, "Sobrenome é obrigatório").max(50),
		phone: z.string(),
		birthDate: z.string(), // Will be converted to Date in the controller
		email: z.string().email("Email inválido"),
		password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
		isPractitioner: z.boolean(),
		healthObservations: z.string().optional(),
		emergencyContacts: z.array(emergencyContactSchema).optional(),
	})
	.refine(
		(data) => {
			// Se for praticante, deve ter pelo menos 3 contatos
			if (data.isPractitioner) {
				return data.emergencyContacts && data.emergencyContacts.length >= 3;
			}
			return true; // Não-praticantes não precisam de contatos
		},
		{
			message: "Praticantes devem ter pelo menos 3 contatos de emergência",
			path: ["emergencyContacts"],
		},
	);

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
export type EmergencyContactInput = z.infer<typeof emergencyContactSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
