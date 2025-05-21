import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { disciplinesTable } from "../db/schema/discipline-schemas/disciplines";
import { ranksTable } from "../db/schema/discipline-schemas/ranks";
import { instructorDisciplinesTable } from "../db/schema/practitioner-schemas/instructor-disciplines";
import { instructorsTable } from "../db/schema/practitioner-schemas/instructors";
import type {
	CreateInstructorDisciplineInput,
	UpdateInstructorDisciplineInput,
} from "../schemas/instructor-discipline.schemas";

export class InstructorDisciplineService {
	async listInstructorDisciplines() {
		const instructorDisciplines = await db
			.select({
				id: instructorDisciplinesTable.id,
				idInstructor: instructorDisciplinesTable.idInstructor,
				idDiscipline: instructorDisciplinesTable.idDiscipline,
				idRank: instructorDisciplinesTable.idRank,
				status: instructorDisciplinesTable.status,
				activatedBy: instructorDisciplinesTable.activatedBy,
				inactivatedBy: instructorDisciplinesTable.inactivatedBy,
				createdAt: instructorDisciplinesTable.createdAt,
				updatedAt: instructorDisciplinesTable.updatedAt,
			})
			.from(instructorDisciplinesTable);

		return instructorDisciplines;
	}

	async getInstructorDisciplineById(id: number) {
		const instructorDiscipline = await db
			.select({
				id: instructorDisciplinesTable.id,
				idInstructor: instructorDisciplinesTable.idInstructor,
				idDiscipline: instructorDisciplinesTable.idDiscipline,
				idRank: instructorDisciplinesTable.idRank,
				status: instructorDisciplinesTable.status,
				activatedBy: instructorDisciplinesTable.activatedBy,
				inactivatedBy: instructorDisciplinesTable.inactivatedBy,
				createdAt: instructorDisciplinesTable.createdAt,
				updatedAt: instructorDisciplinesTable.updatedAt,
			})
			.from(instructorDisciplinesTable)
			.where(eq(instructorDisciplinesTable.id, id));

		if (instructorDiscipline.length === 0) {
			throw new Error("Vínculo de instrutor-disciplina não encontrado");
		}

		return instructorDiscipline[0];
	}

	async getInstructorDisciplinesByInstructor(idInstructor: number) {
		const instructorDisciplines = await db
			.select({
				id: instructorDisciplinesTable.id,
				idInstructor: instructorDisciplinesTable.idInstructor,
				idDiscipline: instructorDisciplinesTable.idDiscipline,
				idRank: instructorDisciplinesTable.idRank,
				status: instructorDisciplinesTable.status,
				activatedBy: instructorDisciplinesTable.activatedBy,
				inactivatedBy: instructorDisciplinesTable.inactivatedBy,
				createdAt: instructorDisciplinesTable.createdAt,
				updatedAt: instructorDisciplinesTable.updatedAt,
			})
			.from(instructorDisciplinesTable)
			.where(eq(instructorDisciplinesTable.idInstructor, idInstructor));

		return instructorDisciplines;
	}

	async createInstructorDiscipline(data: CreateInstructorDisciplineInput) {
		// Verificar se o instrutor existe
		const instructor = await db
			.select()
			.from(instructorsTable)
			.where(eq(instructorsTable.idPractitioner, data.idInstructor));

		if (instructor.length === 0) {
			throw new Error("Instrutor não encontrado");
		}

		// Verificar se a disciplina existe
		const discipline = await db
			.select()
			.from(disciplinesTable)
			.where(eq(disciplinesTable.id, data.idDiscipline));

		if (discipline.length === 0) {
			throw new Error("Disciplina não encontrada");
		}

		// Verificar se a graduação existe (se fornecida)
		if (data.idRank) {
			const rank = await db
				.select()
				.from(ranksTable)
				.where(eq(ranksTable.id, data.idRank));

			if (rank.length === 0) {
				throw new Error("Graduação não encontrada");
			}
		}

		// Verificar se já existe um vínculo ativo para este instrutor nesta disciplina
		const existingInstructorDiscipline = await db
			.select()
			.from(instructorDisciplinesTable)
			.where(
				and(
					eq(instructorDisciplinesTable.idInstructor, data.idInstructor),
					eq(instructorDisciplinesTable.idDiscipline, data.idDiscipline),
					eq(instructorDisciplinesTable.status, "active"),
				),
			);

		if (existingInstructorDiscipline.length > 0) {
			throw new Error(
				"Este instrutor já possui um vínculo ativo com esta disciplina",
			);
		}

		await db.insert(instructorDisciplinesTable).values(data);
		return { message: "Vínculo instrutor-disciplina criado com sucesso" };
	}

	async updateInstructorDiscipline(
		id: number,
		data: UpdateInstructorDisciplineInput,
	) {
		const existingInstructorDiscipline = await db
			.select()
			.from(instructorDisciplinesTable)
			.where(eq(instructorDisciplinesTable.id, id));

		if (existingInstructorDiscipline.length === 0) {
			throw new Error("Vínculo instrutor-disciplina não encontrado");
		}

		// Verificar se a graduação existe (se fornecida)
		if (data.idRank) {
			const rank = await db
				.select()
				.from(ranksTable)
				.where(eq(ranksTable.id, data.idRank));

			if (rank.length === 0) {
				throw new Error("Graduação não encontrada");
			}
		}

		await db
			.update(instructorDisciplinesTable)
			.set(data)
			.where(eq(instructorDisciplinesTable.id, id));

		return { message: "Vínculo instrutor-disciplina atualizado com sucesso" };
	}

	async deleteInstructorDiscipline(id: number) {
		const existingInstructorDiscipline = await db
			.select()
			.from(instructorDisciplinesTable)
			.where(eq(instructorDisciplinesTable.id, id));

		if (existingInstructorDiscipline.length === 0) {
			throw new Error("Vínculo instrutor-disciplina não encontrado");
		}

		await db
			.delete(instructorDisciplinesTable)
			.where(eq(instructorDisciplinesTable.id, id));

		return { message: "Vínculo instrutor-disciplina excluído com sucesso" };
	}
}
