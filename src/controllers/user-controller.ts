import path from "node:path";
import { eq } from "drizzle-orm";
import type { RequestHandler } from "express";
import { db } from "../db";
import { usersTable } from "../db/schema/user-schemas/users";
import {
	listUserSchema,
	toggleUserStatusSchema,
	updateUserSchema,
} from "../schemas/user.schemas";
import { UserService } from "../services/user-service";
import {
	deleteProfileImage,
	getProfileImageUrl,
	optimizeProfileImage,
} from "../utils/file-upload";
import { getPaginationParams } from "../utils/pagination";

const userService = new UserService();

export const listUsers: RequestHandler = async (req, res, next) => {
	try {
		const { page_size, page, offset } = getPaginationParams(req.query);

		// const status = req.query.status as "active" | "inactive" | "suspended";
		const filters = listUserSchema.parse(req.query);

		const { items, count } = await userService.list(filters, {
			limit: page_size,
			offset,
		});
		res.status(200).json({ page_size, page, count, items });
	} catch (error) {
		next(error);
	}
};

export const getUserById: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;
		const user = await userService.getUserById(Number(id));
		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

export const updateUser: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;
		const validatedData = updateUserSchema.parse(req.body);
		const result = await userService.updateUser(Number(id), validatedData);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const deleteUser: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await userService.deleteUser(Number(id));
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const toggleUserStatus: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;
		const validatedData = toggleUserStatusSchema.parse(req.body);
		const result = await userService.toggleUserStatus(
			Number(id),
			validatedData.status,
		);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const uploadProfileImageHandler: RequestHandler = async (
	req,
	res,
	next,
) => {
	try {
		const { id } = req.params;
		const userId = Number(id);
		if (!req.file) {
			res.status(400).json({ error: "Arquivo de imagem não enviado." });
			return;
		}

		// Otimizar imagem
		const optimizedPath = await optimizeProfileImage(req.file.path);
		const filename = path.basename(optimizedPath);
		const imageUrl = getProfileImageUrl(filename);

		// Buscar usuário atual para deletar imagem antiga se existir
		const user = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.id, userId));
		if (user.length === 0) {
			deleteProfileImage(optimizedPath);
			res.status(404).json({ error: "Usuário não encontrado." });
			return;
		}
		const oldImageUrl = user[0].profileImageUrl;
		if (oldImageUrl) {
			const oldFilename = oldImageUrl.split("/").pop();
			if (oldFilename) {
				const oldPath = path.join(
					process.cwd(),
					"uploads",
					"profile-images",
					oldFilename,
				);
				deleteProfileImage(oldPath);
			}
		}

		// Atualizar usuário com nova URL
		await db
			.update(usersTable)
			.set({ profileImageUrl: imageUrl })
			.where(eq(usersTable.id, userId));

		res
			.status(200)
			.json({ message: "Imagem de perfil atualizada com sucesso", imageUrl });
	} catch (error) {
		next(error);
	}
};
