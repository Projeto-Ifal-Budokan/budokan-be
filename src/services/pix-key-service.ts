import { and, count, eq } from "drizzle-orm";
import { db } from "../db";
import { instructorsTable } from "../db/schema/practitioner-schemas/instructors";
import { pixKeysTable } from "../db/schema/practitioner-schemas/pix-keys";
import { practitionersTable } from "../db/schema/practitioner-schemas/practitioners";
import { ConflictError, NotFoundError } from "../errors/app-errors";
import type {
	CreatePixKeyInput,
	UpdatePixKeyInput,
} from "../schemas/pix-key.schemas";

export class PixKeyService {
	async listPixKeys(
		filters?: { idInstructor?: number },
		pagination?: { limit: number; offset: number },
	) {
		const { limit, offset } = pagination || { limit: 10, offset: 0 };

		const [pixKeys, [{ count: total }]] = await Promise.all([
			db
				.select({
					id: pixKeysTable.id,
					idInstructor: pixKeysTable.idInstructor,
					type: pixKeysTable.type,
					key: pixKeysTable.key,
					description: pixKeysTable.description,
					createdAt: pixKeysTable.createdAt,
					updatedAt: pixKeysTable.updatedAt,
				})
				.from(pixKeysTable)
				.where(
					filters?.idInstructor
						? eq(pixKeysTable.idInstructor, filters.idInstructor)
						: undefined,
				)
				.limit(limit)
				.offset(offset),
			db
				.select({ count: count() })
				.from(pixKeysTable)
				.where(
					filters?.idInstructor
						? eq(pixKeysTable.idInstructor, filters.idInstructor)
						: undefined,
				),
		]);

		return { items: pixKeys, count: Number(total) };
	}

	async getPixKeyById(id: number) {
		const pixKey = await db
			.select({
				id: pixKeysTable.id,
				idInstructor: pixKeysTable.idInstructor,
				type: pixKeysTable.type,
				key: pixKeysTable.key,
				description: pixKeysTable.description,
				createdAt: pixKeysTable.createdAt,
				updatedAt: pixKeysTable.updatedAt,
			})
			.from(pixKeysTable)
			.where(eq(pixKeysTable.id, id));

		if (pixKey.length === 0) {
			throw new NotFoundError("Chave pix não encontrada");
		}

		return pixKey[0];
	}

	async createPixKey(data: CreatePixKeyInput) {
		// Verificar se o usuário existe como praticante
		const instructors = await db
			.select()
			.from(instructorsTable)
			.where(eq(instructorsTable.idPractitioner, data.idInstructor));

		if (instructors.length === 0) {
			throw new NotFoundError("Instrutor não identificado");
		}

		const existingPixKey = await db
			.select()
			.from(pixKeysTable)
			.where(eq(pixKeysTable.key, data.key));

		if (existingPixKey.length > 0) {
			throw new ConflictError("Chave pix já registrada");
		}

		await db.insert(pixKeysTable).values(data);
		return { message: "Chave pix criada com sucesso" };
	}

	async updatePixKey(id: number, data: UpdatePixKeyInput) {
		// Verificar se o usuário existe como praticante
		const instructors = await db
			.select()
			.from(instructorsTable)
			.where(eq(instructorsTable.idPractitioner, data.idInstructor));

		if (instructors.length === 0) {
			throw new NotFoundError("Instrutor não identificado");
		}

		const existingPixKey = await db
			.select()
			.from(pixKeysTable)
			.where(eq(pixKeysTable.id, id));

		if (existingPixKey.length === 0) {
			throw new NotFoundError("Chave pix não encontrada");
		}

		await db.update(pixKeysTable).set(data).where(eq(pixKeysTable.id, id));

		return { message: "Chave pix atualizada com sucesso" };
	}

	async deletePixKey(id: number) {
		const existingPixKey = await db
			.select()
			.from(pixKeysTable)
			.where(eq(pixKeysTable.id, id));

		if (existingPixKey.length === 0) {
			throw new NotFoundError("Chave pix não encontrada");
		}

		await db.delete(pixKeysTable).where(eq(pixKeysTable.id, id));

		return { message: "Chave pix excluída com sucesso" };
	}
}
