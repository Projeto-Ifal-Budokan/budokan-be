import type { RequestHandler } from "express";
import { AuthService } from "../services/auth-service";

import { UnauthorizedError } from "../errors/app-errors";
import {
	forgotPasswordSchema,
	loginSchema,
	registerSchema,
	resetPasswordSchema,
} from "../schemas/auth.schemas";
import type { User } from "../types/auth.types";

const authService = new AuthService();

export const register: RequestHandler = async (req, res, next) => {
	try {
		const validatedData = registerSchema.parse(req.body);
		const result = await authService.register(validatedData);
		res.status(201).json(result);
	} catch (error) {
		next(error);
	}
};

export const login: RequestHandler = async (req, res, next) => {
	try {
		const validatedData = loginSchema.parse(req.body);
		const { token } = await authService.login(validatedData);

		// Configuração do cookie baseada no ambiente
		const cookieOptions: any = {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 60 * 60 * 1000, // 1 hora (mesmo tempo do JWT)
		};

		// Adiciona domain apenas em produção
		if (process.env.NODE_ENV === "production") {
			cookieOptions.domain = ".budokanryu.com.br";
		}

		res
			.cookie("access_token", token, cookieOptions)
			.json({ message: "Login bem-sucedido" });
	} catch (error) {
		next(error);
	}
};

export const forgotPassword: RequestHandler = async (req, res, next) => {
	try {
		const validatedData = forgotPasswordSchema.parse(req.body);
		const result = await authService.forgotPassword(validatedData);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const resetPassword: RequestHandler = async (req, res, next) => {
	try {
		const validatedData = resetPasswordSchema.parse(req.body);
		const result = await authService.resetPassword(validatedData);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const me: RequestHandler = async (req, res, next) => {
	try {
		const user = req.user as User | undefined;
		if (!user) {
			throw new UnauthorizedError("Não autenticado");
		}
		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};
