import type { RequestHandler } from "express";
import { ValidationError } from "../errors/app-errors";
import { assignUserRoleSchema } from "../schemas/user-role-schema";
import { UserRoleService } from "../services/user-role-service";

const userRoleService = new UserRoleService();

export const assignRole: RequestHandler = async (req, res, next) => {
	try {
		const validatedData = assignUserRoleSchema.parse(req.body);
		const result = await userRoleService.assignRole(validatedData);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const removeRole: RequestHandler = async (req, res, next) => {
	try {
		const validatedData = assignUserRoleSchema.parse(req.body);
		const result = await userRoleService.removeRole(validatedData);
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

		const roles = await userRoleService.listUserRoles(userId);
		res.status(200).json(roles);
	} catch (error) {
		next(error);
	}
};
