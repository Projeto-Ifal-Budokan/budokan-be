import { eq } from "drizzle-orm";
import { db } from "../db";
import { disciplinesTable } from "../db/schema/discipline-schemas/disciplines";
import type {
    CreateDisciplineInput,
    UpdateDisciplineInput,
} from "../schemas/discipline.schemas";

export class DisciplineService {
    async listDisciplines() {
        const disciplines = await db
            .select({
                id: disciplinesTable.id,
                name: disciplinesTable.name,
                description: disciplinesTable.description,
                status: disciplinesTable.status,
                createdAt: disciplinesTable.createdAt,
                updatedAt: disciplinesTable.updatedAt,
            })
            .from(disciplinesTable);

        return disciplines;
    }

    async getDisciplineById(id: number) {
        const discipline = await db
            .select({
                id: disciplinesTable.id,
                name: disciplinesTable.name,
                description: disciplinesTable.description,
                status: disciplinesTable.status,
                createdAt: disciplinesTable.createdAt,
                updatedAt: disciplinesTable.updatedAt,
            })
            .from(disciplinesTable)
            .where(eq(disciplinesTable.id, id));

        if (discipline.length === 0) {
            throw new Error("Disciplina não encontrada");
        }

        return discipline[0];
    }

    async createDiscipline(data: CreateDisciplineInput) {
        const existingDiscipline = await db
            .select()
            .from(disciplinesTable)
            .where(eq(disciplinesTable.name, data.name));

        if (existingDiscipline.length > 0) {
            throw new Error("Já existe uma disciplina com este nome");
        }

        await db.insert(disciplinesTable).values(data);
        return { message: "Disciplina criada com sucesso" };
    }

    async updateDiscipline(id: number, data: UpdateDisciplineInput) {
        const existingDiscipline = await db
            .select()
            .from(disciplinesTable)
            .where(eq(disciplinesTable.id, id));

        if (existingDiscipline.length === 0) {
            throw new Error("Disciplina não encontrada");
        }

        if (data.name) {
            const disciplineWithSameName = await db
                .select()
                .from(disciplinesTable)
                .where(eq(disciplinesTable.name, data.name));

            if (
                disciplineWithSameName.length > 0 &&
                disciplineWithSameName[0].id !== id
            ) {
                throw new Error("Já existe uma discipina com este nome");
            }
        }

        await db
            .update(disciplinesTable)
            .set(data)
            .where(eq(disciplinesTable.id, id));

        return { message: "Disciplina atualizada com sucesso" };
    }

}
