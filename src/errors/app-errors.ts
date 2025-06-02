export class AppError extends Error {
	statusCode: number;

	constructor(message: string, statusCode = 500) {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = statusCode;
		Error.captureStackTrace(this, this.constructor);
	}
}

// Erros 400 - Bad Request
export class ValidationError extends AppError {
	constructor(message = "Dados inválidos") {
		super(message, 400);
	}
}

// Erros 401 - Unauthorized
export class UnauthorizedError extends AppError {
	constructor(message = "Não autorizado") {
		super(message, 401);
	}
}

// Erros 403 - Forbidden
export class ForbiddenError extends AppError {
	constructor(message = "Acesso proibido") {
		super(message, 403);
	}
}

// Erros 404 - Not Found
export class NotFoundError extends AppError {
	constructor(message = "Recurso não encontrado") {
		super(message, 404);
	}
}

// Erros 409 - Conflict
export class ConflictError extends AppError {
	constructor(message = "Conflito de recursos") {
		super(message, 409);
	}
}

// Erros 422 - Unprocessable Entity
export class UnprocessableEntityError extends AppError {
	constructor(message = "Entidade não processável") {
		super(message, 422);
	}
}

// Erros 500 - Internal Server Error
export class InternalServerError extends AppError {
	constructor(message = "Erro interno do servidor") {
		super(message, 500);
	}
}
