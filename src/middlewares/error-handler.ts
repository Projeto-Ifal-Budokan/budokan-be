import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/app-errors";

// Usando a interface ErrorRequestHandler do Express para garantir compatibilidade
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
	console.error(`${req.method} ${req.path} - Error:`, err);

	// Tratamento de erros do Zod (validação de esquema)
	if (err instanceof ZodError) {
		res.status(400).json({
			message: "Dados inválidos",
			errors: err.errors,
		});
		return;
	}

	// Tratamento de erros personalizados da aplicação
	if (err instanceof AppError) {
		res.status(err.statusCode).json({
			message: err.message,
		});
		return;
	}

	// Tratamento de erros JWT
	if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
		res.status(401).json({
			message: "Token inválido ou expirado",
		});
		return;
	}

	// Erro não tratado - erro interno do servidor
	res.status(500).json({
		message: "Erro interno do servidor",
	});
};
