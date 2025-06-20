import type { RequestHandler } from "express";
import { ValidationError } from "../errors/app-errors";
import { assignRolePrivilegeSchema } from "../schemas/role-privilege-schema";
import { RolePrivilegeService } from "../services/role-privilege-service";
import { getPaginationParams } from "../utils/pagination";

const rolePrivilegeService = new RolePrivilegeService();

export const assignPrivilege: RequestHandler = async (req, res, next) => {
	try {
		const validatedData = assignRolePrivilegeSchema.parse(req.body);
		const result = await rolePrivilegeService.assignPrivilege(validatedData);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const removePrivilege: RequestHandler = async (req, res, next) => {
	try {
		const validatedData = assignRolePrivilegeSchema.parse(req.body);
		const result = await rolePrivilegeService.removePrivilege(validatedData);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const listRolePrivileges: RequestHandler = async (req, res, next) => {
	try {
		const roleId = Number(req.params.id);
		if (Number.isNaN(roleId)) {
			throw new ValidationError("ID do cargo inválido");
		}

		const { page_size, page, offset } = getPaginationParams(req.query);
		const { items, count } = await rolePrivilegeService.listRolePrivileges(
			roleId,
			{ limit: page_size, offset },
		);
		res.status(200).json({ page_size, page, count, items });
	} catch (error) {
		next(error);
	}
};
