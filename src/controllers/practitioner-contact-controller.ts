import type { RequestHandler } from "express";
import { ValidationError } from "../errors/app-errors";
import {
	createPractitionerContactSchema,
	practitionerContactParamsSchema,
	updatePractitionerContactSchema,
} from "../schemas/practitioner-contact.schemas";
import { PractitionerContactService } from "../services/practitioner-contact-service";
import type { User } from "../types/auth.types";
import { getPaginationParams } from "../utils/pagination";

const practitionerContactService = new PractitionerContactService();

export const listContacts: RequestHandler = async (req, res, next) => {
	try {
		const { page_size, page, offset } = getPaginationParams(req.query);

		const idPractitioner = req.query.idPractitioner
			? Number(req.query.idPractitioner)
			: undefined;

		const { items, count } = await practitionerContactService.list(
			{ idPractitioner },
			{ limit: page_size, offset },
		);
		res.status(200).json({ page_size, page, count, items });
	} catch (error) {
		next(error);
	}
};

export const getAllByPractitionerId: RequestHandler = async (
	req,
	res,
	next,
) => {
	try {
		const user = req.user as User | undefined;
		const practitionerId = req.params.id ? Number(req.params.id) : user?.id;

		if (practitionerId) {
			const contacts =
				await practitionerContactService.getAllByPractitionerId(practitionerId);
			res.json(contacts);
		} else {
			throw new ValidationError("ID do praticante não encontrado");
		}
	} catch (error) {
		next(error);
	}
};

export const getById: RequestHandler = async (req, res, next) => {
	try {
		const result = practitionerContactParamsSchema.safeParse(req.params);
		if (!result.success) {
			throw new ValidationError("ID inválido");
		}
		const { id } = result.data;
		const contact = await practitionerContactService.getById(id);
		res.json(contact);
	} catch (error) {
		next(error);
	}
};

export const create: RequestHandler = async (req, res, next) => {
	try {
		const user = req.user as User | undefined;
		const practitionerId = Number(req.params.id || user?.id);

		if (!practitionerId) {
			throw new ValidationError("ID do praticante não encontrado");
		}

		const result = createPractitionerContactSchema.safeParse({
			...req.body,
			idPractitioner: practitionerId,
		});

		if (!result.success) {
			throw new ValidationError(result.error.message);
		}

		const newContact = await practitionerContactService.create(result.data);
		res.status(201).json(newContact);
	} catch (error) {
		next(error);
	}
};

export const update: RequestHandler = async (req, res, next) => {
	try {
		const paramsResult = practitionerContactParamsSchema.safeParse(req.params);
		if (!paramsResult.success) {
			throw new ValidationError("ID inválido");
		}

		const contactId = paramsResult.data.id;
		const bodyResult = updatePractitionerContactSchema.safeParse(req.body);
		if (!bodyResult.success) {
			throw new ValidationError(bodyResult.error.message);
		}

		const updatedContact = await practitionerContactService.update(
			contactId,
			bodyResult.data,
		);
		res.json(updatedContact);
	} catch (error) {
		next(error);
	}
};

export const deleteContact: RequestHandler = async (req, res, next) => {
	try {
		const result = practitionerContactParamsSchema.safeParse(req.params);
		if (!result.success) {
			throw new ValidationError("ID inválido");
		}

		const contactId = result.data.id;

		const deleteResult = await practitionerContactService.delete(contactId);
		res.json(deleteResult);
	} catch (error) {
		next(error);
	}
};
