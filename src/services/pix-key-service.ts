import { eq } from "drizzle-orm";
import { db } from "../db";
import { pixKeysTable } from "../db/schema/practitioner-schemas/pix-keys";
import { practitionersTable } from "../db/schema/practitioner-schemas/practitioners";
import { instructorsTable } from "../db/schema/practitioner-schemas/instructors";
import { ConflictError, NotFoundError } from "../errors/app-errors";
import type {
    CreatePixKeyInput,
    UpdatePixKeyInput,
} from "../schemas/pix-key.schemas";

export class PixKeyService {
    async listPixKeys() {
        const pixKeys = await db
            .select({
                id: pixKeysTable.id,
                idInstructor: pixKeysTable.idInstructor,
                type: pixKeysTable.type,
                key: pixKeysTable.key,
                description: pixKeysTable.description,
                createdAt: pixKeysTable.createdAt,
                updatedAt: pixKeysTable.updatedAt,
            })
            .from(pixKeysTable);

        return pixKeys;
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

    async getPixKeyByIdInstructor(id: number) {
        const pixKeys = await db
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
            .where(eq(pixKeysTable.idInstructor, id));

        if (pixKeys.length === 0) {
            throw new NotFoundError("Nenhuma chave pix encontrada deste instrutor");
        }

        return pixKeys;
    }

    async createPixKey(data: CreatePixKeyInput) {
        // Verificar se o usuário existe como praticante
        const instructors = await db
            .select()
            .from(instructorsTable)
            .where(eq(practitionersTable.idUser, data.idInstructor));

        if (instructors.length === 0) {
            throw new NotFoundError("Usuário não encontrado como instrutor");
        }

        const existingPixKey = await db
        .select()
        .from(pixKeysTable)
        .where(eq(pixKeysTable.key, data.key));

        if (existingPixKey.length > 0) {
            throw new ConflictError("Chave pix já registrada")
        }

        await db.insert(pixKeysTable).values(data);
        return { message: "Chave pix criada com sucesso" };
    }

    async updatePixKey(id: number, data: UpdatePixKeyInput) {
        const existingPixKey = await db
            .select()
            .from(pixKeysTable)
            .where(eq(pixKeysTable.id, id));

        if (existingPixKey.length === 0) {
            throw new NotFoundError("Chave pix não encontrada");
        }

        await db
            .update(pixKeysTable)
            .set(data)
            .where(eq(pixKeysTable.id, id));

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
