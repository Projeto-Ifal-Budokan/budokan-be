import { count, eq, and } from "drizzle-orm";
import { db } from "../db";
import { achievmentsTable } from "../db/schema/discipline-schemas/achievments";
import { ConflictError, NotFoundError } from "../errors/app-errors";
import type {
    CreateAchievmentInput,
    UpdateAchievmentInput,
    ListAchievmentInput,
} from "../schemas/achievments.schemas";

export class AchievmentsService {
    async listAchievments(
        filters: ListAchievmentInput,
        pagination?: { limit: number; offset: number }
    ) {
        const { limit, offset } = pagination || { limit: 10, offset: 0 };

        const conditions = [
            filters.idPractitioner ? eq(achievmentsTable.idPractitioner, filters.idPractitioner) : undefined,
        ];

        const [achievments, [{ count: total }]] = await Promise.all([
            db
                .select({
                    id: achievmentsTable.id,
                    idPractitioner: achievmentsTable.idPractitioner,
                    title: achievmentsTable.title,
                    description: achievmentsTable.description,
                    achievementDate: achievmentsTable.achievementDate,
                    createdAt: achievmentsTable.createdAt,
                    updatedAt: achievmentsTable.updatedAt,
                })
                .from(achievmentsTable)
                .where(and(...conditions))
                .limit(limit)
                .offset(offset),
            db.select({ count: count() }).from(achievmentsTable).where(and(...conditions)),
        ]);

        return { items: achievments, count: Number(total) };
    }

    async getAchievmentById(id: number) {
        const achievment = await db
            .select({
                id: achievmentsTable.id,
                idPractitioner: achievmentsTable.idPractitioner,
                title: achievmentsTable.title,
                description: achievmentsTable.description,
                achievementDate: achievmentsTable.achievementDate,
                createdAt: achievmentsTable.createdAt,
                updatedAt: achievmentsTable.updatedAt,
            })
            .from(achievmentsTable)
            .where(eq(achievmentsTable.id, id));

        if (achievment.length === 0) {
            throw new NotFoundError("Conquista não encontrada");
        }

        return achievment[0];
    }

    async createAchievment(data: CreateAchievmentInput) {
        // Não faz sentido checar duplicidade por título, pois pode haver conquistas iguais para praticantes diferentes
        await db.insert(achievmentsTable).values({
            ...data,
            achievementDate: new Date(data.achievementDate),
        });
        return { message: "Conquista criada com sucesso" };
    }

    async updateAchievment(id: number, data: UpdateAchievmentInput) {
        const existing = await db
            .select()
            .from(achievmentsTable)
            .where(eq(achievmentsTable.id, id));

        if (existing.length === 0) {
            throw new NotFoundError("Conquista não encontrada");
        }

        await db
            .update(achievmentsTable)
            .set({
                ...data,
                achievementDate: data.achievementDate ? new Date(data.achievementDate) : undefined,
            })
            .where(eq(achievmentsTable.id, id));

        return { message: "Conquista atualizada com sucesso" };
    }

    async deleteAchievment(id: number) {
        const existing = await db
            .select()
            .from(achievmentsTable)
            .where(eq(achievmentsTable.id, id));

        if (existing.length === 0) {
            throw new NotFoundError("Conquista não encontrada");
        }

        await db.delete(achievmentsTable).where(eq(achievmentsTable.id, id));

        return { message: "Conquista excluída com sucesso" };
    }
} 