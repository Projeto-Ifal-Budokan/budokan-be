import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/app-errors";
import multer from "multer";

/**
 * Middleware de tratamento de erros
 */
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

	// Tratamento de erros do Multer
	if (err instanceof multer.MulterError) {
		switch (err.code) {
			case "LIMIT_FILE_SIZE":
				res.status(400).json({
					message: "Arquivo muito grande. Tamanho máximo permitido: 5MB",
				});
				return;
			case "LIMIT_FILE_COUNT":
				res.status(400).json({
					message: "Muitos arquivos enviados. Máximo permitido: 1 arquivo",
				});
				return;
			case "LIMIT_UNEXPECTED_FILE":
				res.status(400).json({
					message: "Campo de arquivo inesperado",
				});
				return;
			default:
				res.status(400).json({
					message: "Erro no upload do arquivo",
				});
				return;
		}
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

	// Erros de chave única (MySQL e outros bancos)
	if (
		err.code === "ER_DUP_ENTRY" || // MySQL
		err.errno === 1062 || // MySQL
		err.code === "23505" || // PostgreSQL
		err.code === "SQLITE_CONSTRAINT_UNIQUE" ||
		err.message?.includes("UNIQUE constraint failed") ||
		err.message?.includes("unique constraint") ||
		err.message?.includes("duplicate key") ||
		err.message?.includes("Unique constraint")
	) {
		// Extrair informações da mensagem de erro para MySQL
		let field = "campo";
		let value = "";

		if (err.sqlMessage) {
			const match = err.sqlMessage.match(
				/Duplicate entry '([^']+)' for key '([^']+)(?:\.([^']+))?'/,
			);
			if (match) {
				value = match[1];
				field = match[3] || match[2];
				// Limpar o nome do campo (remover prefixos/sufixos)
				field = field.replace(/^[^_]+_/, "").replace(/_unique$/, "");
			}
		}

		const message = value
			? `Já existe um registro com o valor '${value}' para ${field}`
			: "Já existe um registro com o mesmo valor para este campo";

		res.status(409).json({ message });
		return;
	}

	// Erros de chave estrangeira (MySQL e outros bancos)
	if (
		err.code === "ER_NO_REFERENCED_ROW" ||
		err.code === "ER_ROW_IS_REFERENCED" ||
		err.errno === 1216 ||
		err.errno === 1451 ||
		err.code === "23503" ||
		err.code === "SQLITE_CONSTRAINT_FOREIGNKEY" ||
		err.message?.includes("FOREIGN KEY constraint failed") ||
		err.message?.includes("foreign key constraint") ||
		err.message?.includes("violates foreign key constraint")
	) {
		res.status(400).json({
			message: "O registro referenciado não existe ou não pode ser modificado",
		});
		return;
	}

	// Erros de not null (MySQL e outros bancos)
	if (
		err.code === "ER_BAD_NULL_ERROR" ||
		err.errno === 1048 ||
		err.code === "23502" ||
		err.message?.includes("NOT NULL constraint failed") ||
		err.message?.includes("violates not-null constraint")
	) {
		res.status(400).json({
			message: "Campo obrigatório não preenchido",
		});
		return;
	}

	// Erro não tratado - erro interno do servidor
	res.status(500).json({
		message: "Erro interno do servidor",
		...(process.env.NODE_ENV === "development"
			? { originalError: err.message }
			: {}),
	});
};
