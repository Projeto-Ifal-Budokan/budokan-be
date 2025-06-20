import { and, count, eq } from "drizzle-orm";
import { db } from "../db";
import { disciplinesTable } from "../db/schema/discipline-schemas/disciplines";
import { ranksTable } from "../db/schema/discipline-schemas/ranks";
import { ConflictError, NotFoundError } from "../errors/app-errors";
import type { CreateRankInput, UpdateRankInput } from "../schemas/rank.schemas";

export class RankService {
	async listRanks(
		disciplineId?: number,
		pagination?: { limit: number; offset: number },
	) {
		const { limit, offset } = pagination || { limit: 10, offset: 0 };

		const where = disciplineId
			? eq(ranksTable.idDiscipline, disciplineId)
			: undefined;

		const [ranks, [{ count: total }]] = await Promise.all([
			db
				.select({
					id: ranksTable.id,
					idDiscipline: ranksTable.idDiscipline,
					name: ranksTable.name,
					description: ranksTable.description,
					createdAt: ranksTable.createdAt,
					updatedAt: ranksTable.updatedAt,
					disciplineName: disciplinesTable.name,
				})
				.from(ranksTable)
				.leftJoin(
					disciplinesTable,
					eq(ranksTable.idDiscipline, disciplinesTable.id),
				)
				.where(where)
				.limit(limit)
				.offset(offset),
			db.select({ count: count() }).from(ranksTable).where(where),
		]);

		return { items: ranks, count: Number(total) };
	}

	async getRankById(id: number) {
		const rank = await db
			.select({
				id: ranksTable.id,
				idDiscipline: ranksTable.idDiscipline,
				name: ranksTable.name,
				description: ranksTable.description,
				createdAt: ranksTable.createdAt,
				updatedAt: ranksTable.updatedAt,
				disciplineName: disciplinesTable.name,
			})
			.from(ranksTable)
			.leftJoin(
				disciplinesTable,
				eq(ranksTable.idDiscipline, disciplinesTable.id),
			)
			.where(eq(ranksTable.id, id));

		if (rank.length === 0) {
			throw new NotFoundError("Ranque não encontrado");
		}

		return rank[0];
	}

	async createRank(data: CreateRankInput) {
		// Check if discipline exists
		const discipline = await db
			.select()
			.from(disciplinesTable)
			.where(eq(disciplinesTable.id, data.idDiscipline));

		if (discipline.length === 0) {
			throw new NotFoundError("Disciplina não encontrada");
		}

		// Check if rank with same name already exists in the discipline
		const existingRank = await db
			.select()
			.from(ranksTable)
			.where(
				and(
					eq(ranksTable.name, data.name),
					eq(ranksTable.idDiscipline, data.idDiscipline),
				),
			);

		if (existingRank.length > 0) {
			throw new ConflictError(
				"Já existe um ranque com este nome nesta disciplina",
			);
		}

		await db.insert(ranksTable).values(data);
		return { message: "Ranque criado com sucesso" };
	}

	async updateRank(id: number, data: UpdateRankInput) {
		const existingRank = await db
			.select()
			.from(ranksTable)
			.where(eq(ranksTable.id, id));

		if (existingRank.length === 0) {
			throw new NotFoundError("Ranque não encontrado");
		}

		if (data.idDiscipline) {
			// Check if discipline exists
			const discipline = await db
				.select()
				.from(disciplinesTable)
				.where(eq(disciplinesTable.id, data.idDiscipline));

			if (discipline.length === 0) {
				throw new NotFoundError("Disciplina não encontrada");
			}
		}

		if (data.name) {
			const disciplineId = data.idDiscipline || existingRank[0].idDiscipline;
			const rankWithSameName = await db
				.select()
				.from(ranksTable)
				.where(
					and(
						eq(ranksTable.name, data.name),
						eq(ranksTable.idDiscipline, disciplineId),
					),
				);

			if (rankWithSameName.length > 0 && rankWithSameName[0].id !== id) {
				throw new ConflictError(
					"Já existe um ranque com este nome nesta disciplina",
				);
			}
		}

		await db.update(ranksTable).set(data).where(eq(ranksTable.id, id));

		return { message: "Ranque atualizado com sucesso" };
	}

	async deleteRank(id: number) {
		const existingRank = await db
			.select()
			.from(ranksTable)
			.where(eq(ranksTable.id, id));

		if (existingRank.length === 0) {
			throw new NotFoundError("Ranque não encontrado");
		}

		await db.delete(ranksTable).where(eq(ranksTable.id, id));

		return { message: "Ranque excluído com sucesso" };
	}
}
