import { and, count, desc, eq } from "drizzle-orm";
import { db } from "../db";
import { practitionerContactsTable } from "../db/schema/practitioner-schemas/practitioner-contacts";
import { practitionersTable } from "../db/schema/practitioner-schemas/practitioners";
import { ConflictError, NotFoundError } from "../errors/app-errors";
import type {
	CreatePractitionerContactInput,
	UpdatePractitionerContactInput,
} from "../schemas/practitioner-contact.schemas";

export class PractitionerContactService {
	// Listar todos os contatos
	async listAll() {
		const contacts = await db
			.select({
				id: practitionerContactsTable.id,
				idPractitioner: practitionerContactsTable.idPractitioner,
				phone: practitionerContactsTable.phone,
				relationship: practitionerContactsTable.relationship,
				createdAt: practitionerContactsTable.createdAt,
				updatedAt: practitionerContactsTable.updatedAt,
			})
			.from(practitionerContactsTable)
			.orderBy(practitionerContactsTable.idPractitioner);

		return contacts;
	}

	// Verificar se um praticante tem contatos suficientes
	async hasRequiredContacts(practitionerId: number): Promise<boolean> {
		const [result] = await db
			.select({ count: count() })
			.from(practitionerContactsTable)
			.where(eq(practitionerContactsTable.idPractitioner, practitionerId));

		return result.count >= 3;
	}

	// Obter todos os contatos de um praticante
	async getAllByPractitionerId(practitionerId: number) {
		// Verificar se o praticante existe
		const practitionerExists = await db
			.select()
			.from(practitionersTable)
			.where(eq(practitionersTable.idUser, practitionerId));

		if (practitionerExists.length === 0) {
			throw new NotFoundError("Praticante não encontrado");
		}

		const contacts = await db
			.select()
			.from(practitionerContactsTable)
			.where(eq(practitionerContactsTable.idPractitioner, practitionerId));

		return contacts;
	}

	// Obter um contato específico
	async getById(id: number) {
		const contacts = await db
			.select()
			.from(practitionerContactsTable)
			.where(eq(practitionerContactsTable.id, id));

		if (contacts.length === 0) {
			throw new NotFoundError("Contato não encontrado");
		}

		return contacts[0];
	}

	// Criar um novo contato
	async create(data: CreatePractitionerContactInput) {
		// Verificar se o praticante existe
		const practitionerExists = await db
			.select()
			.from(practitionersTable)
			.where(eq(practitionersTable.idUser, data.idPractitioner));

		if (practitionerExists.length === 0) {
			throw new NotFoundError("Praticante não encontrado");
		}

		// Inserir o novo contato
		await db.insert(practitionerContactsTable).values(data);

		// Buscar o contato mais recente para o praticante
		const [newContact] = await db
			.select()
			.from(practitionerContactsTable)
			.where(eq(practitionerContactsTable.idPractitioner, data.idPractitioner))
			.orderBy(desc(practitionerContactsTable.createdAt))
			.limit(1);

		return newContact;
	}

	// Atualizar um contato existente
	async update(id: number, data: UpdatePractitionerContactInput) {
		// Verificar se o contato existe
		const contact = await this.getById(id);

		// Atualizar o contato
		await db
			.update(practitionerContactsTable)
			.set({
				...data,
				updatedAt: new Date(),
			})
			.where(eq(practitionerContactsTable.id, id));

		// Buscar o contato atualizado
		return this.getById(id);
	}

	// Excluir um contato
	async delete(id: number, practitionerId: number) {
		// Verificar se o contato existe e pertence ao praticante
		const contact = await db
			.select()
			.from(practitionerContactsTable)
			.where(
				and(
					eq(practitionerContactsTable.id, id),
					eq(practitionerContactsTable.idPractitioner, practitionerId),
				),
			);

		if (contact.length === 0) {
			throw new NotFoundError(
				"Contato não encontrado ou não pertence ao praticante",
			);
		}

		// Contar contatos existentes para este praticante
		const existingContacts = await db
			.select()
			.from(practitionerContactsTable)
			.where(eq(practitionerContactsTable.idPractitioner, practitionerId));

		// Verificar se o praticante ficará com menos de 3 contatos após a exclusão
		if (existingContacts.length <= 3) {
			throw new ConflictError(
				"Não é possível excluir o contato. Praticantes devem ter pelo menos 3 contatos de emergência",
			);
		}

		await db
			.delete(practitionerContactsTable)
			.where(eq(practitionerContactsTable.id, id));

		return { message: "Contato excluído com sucesso" };
	}
}
