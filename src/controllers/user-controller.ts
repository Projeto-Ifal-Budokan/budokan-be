import type { RequestHandler } from "express";
import {
	toggleUserStatusSchema,
	updateUserSchema,
	listUserSchema,
} from "../schemas/user.schemas";
import { UserService } from "../services/user-service";
import { getPaginationParams } from "../utils/pagination";

const userService = new UserService();

export const listUsers: RequestHandler = async (req, res, next) => {
	try {
		const { page_size, page, offset } = getPaginationParams(req.query);

		// const status = req.query.status as "active" | "inactive" | "suspended";
		const filters = listUserSchema.parse(req.query);

		const { items, count } = await userService.list(
			filters,
			{ limit: page_size, offset },
		);
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
