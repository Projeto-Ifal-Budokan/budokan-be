import bcrypt from "bcrypt";
import { eq } from "drizzle-orm"; // para a busca de usuários
import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { ZodError } from "zod";
import { db } from "../db";
import { usersTable } from "../db/schema/user_schemas/users";

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

		if (user.status !== "active") {
			res.status(403).json({ message: "Usuário inativo ou suspenso." });
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

export const forgotPassword: RequestHandler = async (req, res) => {
	try {
		const { email } = forgotPasswordSchema.parse(req.body);

		const users = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, email));
		const user = users[0];

		if (!user) {
			res.status(200).json({
				msg: "Se o e-mail estiver registrado, uma instrução foi enviada.",
			});
			return;
		}

		const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "15m" });

		const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

		const mailOptions = {
			from: '"Budokan" <no-reply@budokan.local>',
			to: email,
			subject: "Budokan - Recuperação de Senha",
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
					<div style="text-align: center; margin-bottom: 30px;">
						<img src="https://i.imgur.com/pdTKKpA.png" alt="Budokan Logo" style="max-width: 150px; height: auto;" />
					</div>
					
					<div style="background-color: #f9f9f9; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
						<h2 style="color: #333; margin-top: 0;">Olá ${user.firstName},</h2>
						
						<p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 25px;">
							Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo e você será redirecionado para um site seguro onde poderá definir uma nova senha.
						</p>

						<div style="text-align: center; margin: 30px 0;">
							<a href="${resetUrl}" 
							   style="display: inline-block; 
									  padding: 12px 24px; 
									  background-color: rgb(230, 116, 22); 
									  color: white; 
									  text-decoration: none; 
									  border-radius: 4px; 
									  font-size: 16px;
									  font-weight: bold;
									  box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
								Redefinir Senha
							</a>
						</div>

						<p style="color: #666; font-size: 14px; margin-top: 25px;">
							Se você não solicitou a redefinição de senha, <a href="#" style="color: rgb(18, 50, 193); text-decoration: none;">clique aqui</a> e vamos esquecer que isso aconteceu.
						</p>
					</div>

					<div style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
						<p>Budokan - Transformando Vidas Através das Artes Marciais</p>
						<p>Esta é uma mensagem automática, por favor não responda este e-mail.</p>
					</div>
				</div>
			`,
		};

		const info = await transporter.sendMail(mailOptions);

		console.log("Email enviado:", nodemailer.getTestMessageUrl(info));

		res.status(200).json({
			msg: "Se o e-mail estiver registrado, uma instrução foi enviada.",
		});
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
		return;
	}
};

export const resetPassword: RequestHandler = async (req, res) => {
	try {
		const { token, password } = resetPasswordSchema.parse(req.body);

		const payload = jwt.verify(token, JWT_SECRET) as { id: number };

		const hashedPassword = await bcrypt.hash(password, 10);

		await db
			.update(usersTable)
			.set({ password: hashedPassword })
			.where(eq(usersTable.id, payload.id));

		res.status(200).json({ msg: "Senha redefinida com sucesso!" });
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
		return;
	}
};
