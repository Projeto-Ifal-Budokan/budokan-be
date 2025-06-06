import type { RequestHandler } from "express";
import {
	createPrivilegeSchema,
	updatePrivilegeSchema,
} from "../schemas/privilege.schemas";
import {
	type PrivilegeFilters,
	PrivilegeService,
} from "../services/privilege-service";

const privilegeService = new PrivilegeService();

export const listPrivileges: RequestHandler = async (req, res, next) => {
	try {
		const filters: PrivilegeFilters = {};

		if (req.query.idPrivilege) {
			filters.idPrivilege = Number(req.query.idPrivilege);
		}

		if (req.query.description) {
			filters.description = String(req.query.description);
		}

		const privileges = await privilegeService.listPrivileges(filters);
		res.status(200).json(privileges);
	} catch (error) {
		next(error);
	}
};

export const listUserPrivileges: RequestHandler = async (req, res, next) => {
	try {
		const userId = req.params.id;
		const description = req.query.description
			? String(req.query.description)
			: undefined;

		const privileges = await privilegeService.listUserPrivileges(
			Number(userId),
			description,
		);
		res.status(200).json(privileges);
	} catch (error) {
		next(error);
	}
};

export const createPrivilege: RequestHandler = async (req, res, next) => {
	try {
		const validatedData = createPrivilegeSchema.parse(req.body);
		const result = await privilegeService.createPrivilege(validatedData);
		res.status(201).json(result);
	} catch (error) {
		next(error);
	}
};

export const updatePrivilege: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;
		const validatedData = updatePrivilegeSchema.parse(req.body);
		const result = await privilegeService.updatePrivilege(
			Number(id),
			validatedData,
		);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const deletePrivilege: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await privilegeService.deletePrivilege(Number(id));
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
