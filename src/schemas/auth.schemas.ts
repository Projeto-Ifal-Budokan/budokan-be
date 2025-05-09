/**
 * @openapi
 * components:
 *   schemas:
 *     RegisterInput:
 *       type: object
 *       required:
 *         - firstName
 *         - surname
 *         - phone
 *         - birthDate
 *         - email
 *         - password
 *         - isPractitioner
 *       properties:
 *         firstName:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           example: "John"
 *         surname:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           example: "Doe"
 *         phone:
 *           type: string
 *           example: "+55 82 99999-9999"
 *         birthDate:
 *           type: string
 *           format: date
 *           example: "1990-01-01"
 *         email:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           minLength: 6
 *           example: "senha123"
 *         isPractitioner:
 *           type: boolean
 *           example: true
 *         healthObservations:
 *           type: string
 *           example: "Nenhuma observação"
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           example: "senha123"
 *     ForgotPasswordInput:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *     ResetPasswordInput:
 *       type: object
 *       required:
 *         - token
 *         - password
 *       properties:
 *         token:
 *           type: string
 *           example: "reset_token_here"
 *         password:
 *           type: string
 *           minLength: 6
 *           example: "nova_senha123"
 */

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
