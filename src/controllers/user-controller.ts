import type { RequestHandler } from "express";
import { updateUserSchema } from "../schemas/user.schemas";
import { UserService } from "../services/user-service";

const userService = new UserService();

export const listUsers: RequestHandler = async (req, res, next) => {
	try {
		const users = await userService.listUsers();
		res.status(200).json(users);
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
