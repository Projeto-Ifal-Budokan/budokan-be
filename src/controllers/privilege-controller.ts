import type { RequestHandler } from "express";
import {
	createPrivilegeSchema,
	updatePrivilegeSchema,
} from "../schemas/privilege.schemas";
import {
	type PrivilegeFilters,
	PrivilegeService,
} from "../services/privilege-service";
import { getPaginationParams } from "../utils/pagination";

const privilegeService = new PrivilegeService();

export const listPrivileges: RequestHandler = async (req, res, next) => {
	try {
		const { page_size, page, offset } = getPaginationParams(req.query);

		const filters: PrivilegeFilters = {};

		if (req.query.idPrivilege) {
			filters.idPrivilege = Number(req.query.idPrivilege);
		}

		if (req.query.description) {
			filters.description = String(req.query.description);
		}

		const userIdFromParams = req.params.id;
		const userIdFromQuery = req.query.idUser;

		const userId = userIdFromParams || userIdFromQuery;

		if (userId) {
			filters.idUser = Number(userId);
		}

		const { items, count } = await privilegeService.listPrivileges(filters, {
			limit: page_size,
			offset,
		});
		res.status(200).json({ page_size, page, count, items });
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
