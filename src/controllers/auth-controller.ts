import type { RequestHandler } from "express";
import nodemailer from "nodemailer";
import { ZodError } from "zod";
import { AuthService } from "../services/auth-service";

import {
	forgotPasswordSchema,
	loginSchema,
	registerSchema,
	resetPasswordSchema,
} from "../schemas/auth.schemas";

const JWT_SECRET = process.env.JWT_SECRET || "seuSegredoAqui";

// Transporter para ambiente de desenvolvimento (Ethereal)
const transporter = nodemailer.createTransport({
	host: "smtp.ethereal.email",
	port: 587,
	auth: {
		user: process.env.ETHEREAL_USER,
		pass: process.env.ETHEREAL_PASS,
	},
});

const authService = new AuthService();

export const register: RequestHandler = async (req, res) => {
	try {
		const validatedData = registerSchema.parse(req.body);
		const result = await authService.register(validatedData);
		res.status(201).json(result);
	} catch (error) {
		if (error instanceof ZodError) {
			res.status(400).json({
				message: "Dados inválidos",
				errors: error.errors,
			});
			return;
		}
		if (error instanceof Error && error.message === "Email já cadastrado.") {
			res.status(409).json({ message: error.message });
			return;
		}
		console.error("Erro ao registrar usuário:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const login: RequestHandler = async (req, res) => {
	try {
		const validatedData = loginSchema.parse(req.body);
		const { token } = await authService.login(validatedData);

		res
			.cookie("access_token", token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				maxAge: 24 * 60 * 60 * 1000, // 1 dia
			})
			.json({ message: "Login bem-sucedido" });
	} catch (error) {
		if (error instanceof ZodError) {
			res.status(400).json({
				message: "Dados inválidos",
				errors: error.errors,
			});
			return;
		}
		if (error instanceof Error) {
			if (error.message === "Credenciais inválidas.") {
				res.status(401).json({ message: error.message });
				return;
			}
			if (error.message === "Usuário inativo ou suspenso.") {
				res.status(403).json({ message: error.message });
				return;
			}
		}
		console.error("Erro ao fazer login:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const forgotPassword: RequestHandler = async (req, res) => {
	try {
		const validatedData = forgotPasswordSchema.parse(req.body);
		const result = await authService.forgotPassword(validatedData);
		res.status(200).json(result);
	} catch (error) {
		if (error instanceof ZodError) {
			res.status(400).json({
				message: "Dados inválidos",
				errors: error.errors,
			});
			return;
		}
		console.error("Erro ao recuperar senha:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};

export const resetPassword: RequestHandler = async (req, res) => {
	try {
		const validatedData = resetPasswordSchema.parse(req.body);
		const result = await authService.resetPassword(validatedData);
		res.status(200).json(result);
	} catch (error) {
		if (error instanceof ZodError) {
			res.status(400).json({
				message: "Dados inválidos",
				errors: error.errors,
			});
			return;
		}
		console.error("Erro ao resetar senha:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};
