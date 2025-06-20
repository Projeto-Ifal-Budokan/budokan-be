import type { RequestHandler } from "express";
import { ValidationError } from "../errors/app-errors";
import { assignUserRoleSchema } from "../schemas/user-role-schema";
import { UserRoleService } from "../services/user-role-service";
import type { User } from "../types/auth.types";
import { getPaginationParams } from "../utils/pagination";

const userRoleService = new UserRoleService();

export const assignRole: RequestHandler = async (req, res, next) => {
	try {
		const validatedData = assignUserRoleSchema.parse(req.body);
		const currentUser = req.user as User | undefined;
		const result = await userRoleService.assignRole(validatedData, currentUser);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const removeRole: RequestHandler = async (req, res, next) => {
	try {
		const validatedData = assignUserRoleSchema.parse(req.body);
		const currentUser = req.user as User | undefined;
		const result = await userRoleService.removeRole(validatedData, currentUser);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const listUserRoles: RequestHandler = async (req, res, next) => {
	try {
		const userId = Number(req.params.id);
		if (Number.isNaN(userId)) {
			throw new ValidationError("ID do usuário inválido");
		}

		const { page_size, page, offset } = getPaginationParams(req.query);
		const { items, count } = await userRoleService.listUserRoles(userId, {
			limit: page_size,
			offset,
		});
		res.status(200).json({ page_size, page, count, items });
	} catch (error) {
		next(error);
	}
};
