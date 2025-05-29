import type { RequestHandler } from "express";
import { ValidationError } from "../errors/app-errors";
import {
	createPractitionerContactSchema,
	practitionerContactParamsSchema,
	updatePractitionerContactSchema,
} from "../schemas/practitioner-contact.schemas";
import { PractitionerContactService } from "../services/practitioner-contact-service";
import type { User } from "../types/auth.types";

const practitionerContactService = new PractitionerContactService();

export const listAllContacts: RequestHandler = async (req, res, next) => {
	try {
		const contacts = await practitionerContactService.listAll();
		res.json(contacts);
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
		const practitionerId = req.params.practitionerId
			? Number(req.params.practitionerId)
			: user?.id;

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
		const practitionerId = Number(req.params.practitionerId || user?.id);

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
		const user = req.user as User | undefined;
		const practitionerId = user?.id;

		if (!practitionerId) {
			throw new ValidationError("ID do praticante não encontrado");
		}

		const deleteResult = await practitionerContactService.delete(
			contactId,
			practitionerId,
		);
		res.json(deleteResult);
	} catch (error) {
		next(error);
	}
};
