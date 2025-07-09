import { count, eq, and } from "drizzle-orm";
import { db } from "../db";
import { achievmentsTable } from "../db/schema/discipline-schemas/achievments";
import { matriculationsTable } from "../db/schema/practitioner-schemas/matriculations";
import { disciplinesTable } from "../db/schema/discipline-schemas/disciplines";
import { practitionersTable } from "../db/schema/practitioner-schemas/practitioners";
import { usersTable } from "../db/schema/user-schemas/users";
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
            filters.idDiscipline ? eq(achievmentsTable.idDiscipline, filters.idDiscipline) : undefined,
        ];

        const [achievments, [{ count: total }]] = await Promise.all([
            db
                .select({
                    id: achievmentsTable.id,
                    idPractitioner: achievmentsTable.idPractitioner,
                    practitionerFirstName: usersTable.firstName,
                    practitionerSurname: usersTable.surname,
                    idDiscipline: achievmentsTable.idDiscipline,
                    disciplineName: disciplinesTable.name,
                    title: achievmentsTable.title,
                    description: achievmentsTable.description,
                    achievementDate: achievmentsTable.achievementDate,
                    createdAt: achievmentsTable.createdAt,
                    updatedAt: achievmentsTable.updatedAt,
                })
                .from(achievmentsTable)
                .leftJoin(practitionersTable, eq(achievmentsTable.idPractitioner, practitionersTable.idUser))
                .leftJoin(usersTable, eq(practitionersTable.idUser, usersTable.id))
                .leftJoin(disciplinesTable, eq(achievmentsTable.idDiscipline, disciplinesTable.id))
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
                practitionerFirstName: usersTable.firstName,
                practitionerSurname: usersTable.surname,
                idDiscipline: achievmentsTable.idDiscipline,
                disciplineName: disciplinesTable.name,
                title: achievmentsTable.title,
                description: achievmentsTable.description,
                achievementDate: achievmentsTable.achievementDate,
                createdAt: achievmentsTable.createdAt,
                updatedAt: achievmentsTable.updatedAt,
            })
            .from(achievmentsTable)
            .leftJoin(practitionersTable, eq(achievmentsTable.idPractitioner, practitionersTable.idUser))
            .leftJoin(usersTable, eq(practitionersTable.idUser, usersTable.id))
            .leftJoin(disciplinesTable, eq(achievmentsTable.idDiscipline, disciplinesTable.id))
            .where(eq(achievmentsTable.id, id));

        if (achievment.length === 0) {
            throw new NotFoundError("Conquista não encontrada");
        }

        return achievment[0];
    }

    async createAchievment(data: CreateAchievmentInput) {
        // Verifica se o praticante possui matrícula ativa na disciplina
        const matricula = await db
            .select()
            .from(matriculationsTable)
            .where(
                and(
                    eq(matriculationsTable.idStudent, data.idPractitioner),
                    eq(matriculationsTable.idDiscipline, data.idDiscipline),
                    eq(matriculationsTable.status, "active")
                )
            );
        if (matricula.length === 0) {
            throw new ConflictError("O praticante não possui matrícula ativa nesta disciplina");
        }
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

        // Se for informado idPractitioner ou idDiscipline, faz a verificação
        const idPractitioner = data.idPractitioner ?? existing[0].idPractitioner;
        const idDiscipline = data.idDiscipline ?? existing[0].idDiscipline;
        if (idPractitioner && idDiscipline) {
            const matricula = await db
                .select()
                .from(matriculationsTable)
                .where(
                    and(
                        eq(matriculationsTable.idStudent, idPractitioner),
                        eq(matriculationsTable.idDiscipline, idDiscipline),
                        eq(matriculationsTable.status, "active")
                    )
                );
            if (matricula.length === 0) {
                throw new ConflictError("O praticante não possui matrícula ativa nesta disciplina");
            }
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