import type { RequestHandler } from "express";
import { createRoleSchema, updateRoleSchema } from "../schemas/role.schemas";
import { RoleService } from "../services/role-service";
import { getPaginationParams } from "../utils/pagination";

const roleService = new RoleService();

export const listRoles: RequestHandler = async (req, res, next) => {
	try {
		const { page_size, page, offset } = getPaginationParams(req.query);
		const { items, count } = await roleService.listRoles({
			limit: page_size,
			offset,
		});
		res.status(200).json({ page_size, page, count, items });
	} catch (error) {
		next(error);
	}
};

export const getRoleById: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;
		const role = await roleService.getRoleById(Number(id));
		res.status(200).json(role);
	} catch (error) {
		next(error);
	}
};

export const createRole: RequestHandler = async (req, res, next) => {
	try {
		const validatedData = createRoleSchema.parse(req.body);
		const result = await roleService.createRole(validatedData);
		res.status(201).json(result);
	} catch (error) {
		next(error);
	}
};

export const updateRole: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;
		const validatedData = updateRoleSchema.parse(req.body);
		const result = await roleService.updateRole(Number(id), validatedData);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const deleteRole: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await roleService.deleteRole(Number(id));
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
