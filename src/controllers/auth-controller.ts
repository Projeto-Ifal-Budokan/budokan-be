import bcrypt from "bcrypt";
import { eq } from "drizzle-orm"; // para a busca de usuários
import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { ZodError } from "zod";
import { db } from "../db";
import { usersTable } from "../db/schema/user_schemas/users";
import { loginSchema, registerSchema } from "../schemas/auth.schemas";

const JWT_SECRET = process.env.JWT_SECRET || "seuSegredoAqui";

export const register: RequestHandler = async (req, res) => {
	try {
		const validatedData = registerSchema.parse(req.body);
		const { firstName, surname, email, password, phone, birthDate } =
			validatedData;

		const existingUser = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, email));

		if (existingUser.length > 0) {
			res.status(409).json({ message: "Email já cadastrado." });
			return;
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = {
			id: Math.floor(Math.random() * 1000000), // Temporary solution for testing
			firstName,
			surname,
			email,
			password: hashedPassword,
			phone: phone,
			birthDate: new Date(birthDate),
			status: "inactive" as const,
		};

		await db.insert(usersTable).values(newUser);

		res.status(201).json({ message: "Usuário cadastrado com sucesso." });
		return;
	} catch (error) {
		if (error instanceof ZodError) {
			res.status(400).json({
				message: "Dados inválidos",
				errors: error.errors,
			});
			return;
		}
		console.error("Erro ao registrar usuário:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
		return;
	}
};

export const login: RequestHandler = async (req, res) => {
	try {
		const validatedData = loginSchema.parse(req.body);
		const { email, password } = validatedData;

		const userResult = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, email));

		if (userResult.length === 0) {
			res.status(401).json({ message: "Credenciais inválidas." });
			return;
		}

		const user = userResult[0];
		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			res.status(401).json({ message: "Credenciais inválidas." });
			return;
		}

		const token = jwt.sign(
			{
				id: user.id,
				email: user.email,
				status: user.status,
			},
			JWT_SECRET,
			{
				expiresIn: "1h",
			},
		);

		res
			.cookie("access_token", token, {
				httpOnly: true, // Impede acesso via JS (mitiga XSS)
				secure: process.env.NODE_ENV === "production", // Apenas HTTPS em prod
				sameSite: "strict", // Evita envio do cookie em requests de outros sites (mitiga CSRF)
				maxAge: 24 * 60 * 60 * 1000, // 1 dia
			})
			.json({ message: "Login bem-sucedido" });

		return;
	} catch (error) {
		if (error instanceof ZodError) {
			res.status(400).json({
				message: "Dados inválidos",
				errors: error.errors,
			});
			return;
		}
		console.error("Erro ao fazer login:", error);
		res.status(500).json({ message: "Erro interno do servidor" });
		return;
	}
};
