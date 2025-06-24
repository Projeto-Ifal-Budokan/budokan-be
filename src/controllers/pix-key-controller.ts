import type { RequestHandler } from "express";
import {
	createPixKeySchema,
	updatePixKeySchema,
	listPixKeySchema,
} from "../schemas/pix-key.schemas";
import { PixKeyService } from "../services/pix-key-service";
import { getPaginationParams } from "../utils/pagination";

const pixKeyService = new PixKeyService();

export const listPixKeys: RequestHandler = async (req, res, next) => {
	try {
		const filtersData = listPixKeySchema.parse(req.query);
		const { page_size, page, offset } = getPaginationParams(req.query);
		const { items, count } = await pixKeyService.listPixKeys(
			filtersData,
			{ limit: page_size, offset },
		);
		res.status(200).json({ page_size, page, count, items });
	} catch (error) {
		next(error);
	}
};

export const getPixKeyById: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;
		const pixKey = await pixKeyService.getPixKeyById(Number(id));
		res.status(200).json(pixKey);
	} catch (error) {
		next(error);
	}
};

export const createPixKey: RequestHandler = async (req, res, next) => {
	try {
		const validatedData = createPixKeySchema.parse(req.body);
		const result = await pixKeyService.createPixKey(validatedData);
		res.status(201).json(result);
	} catch (error) {
		next(error);
	}
};

export const updatePixKey: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;
		const validatedData = updatePixKeySchema.parse(req.body);
		const result = await pixKeyService.updatePixKey(Number(id), validatedData);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const deletePixKey: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await pixKeyService.deletePixKey(Number(id));
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
