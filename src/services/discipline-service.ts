import { count, eq, and } from "drizzle-orm";
import { db } from "../db";
import { disciplinesTable } from "../db/schema/discipline-schemas/disciplines";
import { ConflictError, NotFoundError } from "../errors/app-errors";
import type {
	CreateDisciplineInput,
	UpdateDisciplineInput,
	ListDisciplineInput,
} from "../schemas/discipline.schemas";

export class DisciplineService {
	async listDisciplines(
		filters: ListDisciplineInput,
		pagination?: { limit: number; offset: number }
	) {
		const { limit, offset } = pagination || { limit: 10, offset: 0 };

		const conditions = [
			filters.status ? eq(disciplinesTable.status, filters.status) : undefined,
		];

		const [disciplines, [{ count: total }]] = await Promise.all([
			db
				.select({
					id: disciplinesTable.id,
					name: disciplinesTable.name,
					description: disciplinesTable.description,
					status: disciplinesTable.status,
					createdAt: disciplinesTable.createdAt,
					updatedAt: disciplinesTable.updatedAt,
				})
				.from(disciplinesTable)
				.where(and(...conditions))
				.limit(limit)
				.offset(offset),
			db.select({ count: count() }).from(disciplinesTable).where(and(...conditions)),
		]);

		return { items: disciplines, count: Number(total) };
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
			throw new NotFoundError("Disciplina não encontrada");
		}

		return discipline[0];
	}

	async createDiscipline(data: CreateDisciplineInput) {
		const existingDiscipline = await db
			.select()
			.from(disciplinesTable)
			.where(eq(disciplinesTable.name, data.name));

		if (existingDiscipline.length > 0) {
			throw new ConflictError("Já existe uma disciplina com este nome");
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
			throw new NotFoundError("Disciplina não encontrada");
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
				throw new ConflictError("Já existe uma discipina com este nome");
			}
		}

		await db
			.update(disciplinesTable)
			.set(data)
			.where(eq(disciplinesTable.id, id));

		return { message: "Disciplina atualizada com sucesso" };
	}

	async deleteDiscipline(id: number) {
		const existingDiscipline = await db
			.select()
			.from(disciplinesTable)
			.where(eq(disciplinesTable.id, id));

		if (existingDiscipline.length === 0) {
			throw new NotFoundError("Disciplina não encontrada");
		}

		await db.delete(disciplinesTable).where(eq(disciplinesTable.id, id));

		return { message: "Disciplina excluída com sucesso" };
	}
}
