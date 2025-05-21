import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { disciplinesTable } from "../db/schema/discipline-schemas/disciplines";
import { ranksTable } from "../db/schema/discipline-schemas/ranks";
import { matriculationsTable } from "../db/schema/practitioner-schemas/matriculations";
import { studentsTable } from "../db/schema/practitioner-schemas/students";
import type {
	CreateMatriculationInput,
	UpdateMatriculationInput,
} from "../schemas/matriculation.schemas";

export class MatriculationService {
	async listMatriculations() {
		const matriculations = await db
			.select({
				id: matriculationsTable.id,
				idStudent: matriculationsTable.idStudent,
				idDiscipline: matriculationsTable.idDiscipline,
				idRank: matriculationsTable.idRank,
				status: matriculationsTable.status,
				isPaymentExempt: matriculationsTable.isPaymentExempt,
				activatedBy: matriculationsTable.activatedBy,
				inactivatedBy: matriculationsTable.inactivatedBy,
				createdAt: matriculationsTable.createdAt,
				updatedAt: matriculationsTable.updatedAt,
			})
			.from(matriculationsTable);

		return matriculations;
	}

	async getMatriculationById(id: number) {
		const matriculation = await db
			.select({
				id: matriculationsTable.id,
				idStudent: matriculationsTable.idStudent,
				idDiscipline: matriculationsTable.idDiscipline,
				idRank: matriculationsTable.idRank,
				status: matriculationsTable.status,
				isPaymentExempt: matriculationsTable.isPaymentExempt,
				activatedBy: matriculationsTable.activatedBy,
				inactivatedBy: matriculationsTable.inactivatedBy,
				createdAt: matriculationsTable.createdAt,
				updatedAt: matriculationsTable.updatedAt,
			})
			.from(matriculationsTable)
			.where(eq(matriculationsTable.id, id));

		if (matriculation.length === 0) {
			throw new Error("Matrícula não encontrada");
		}

		return matriculation[0];
	}

	async getMatriculationsByStudent(idStudent: number) {
		const matriculations = await db
			.select({
				id: matriculationsTable.id,
				idStudent: matriculationsTable.idStudent,
				idDiscipline: matriculationsTable.idDiscipline,
				idRank: matriculationsTable.idRank,
				status: matriculationsTable.status,
				isPaymentExempt: matriculationsTable.isPaymentExempt,
				activatedBy: matriculationsTable.activatedBy,
				inactivatedBy: matriculationsTable.inactivatedBy,
				createdAt: matriculationsTable.createdAt,
				updatedAt: matriculationsTable.updatedAt,
			})
			.from(matriculationsTable)
			.where(eq(matriculationsTable.idStudent, idStudent));

		return matriculations;
	}

	async createMatriculation(data: CreateMatriculationInput) {
		// Verificar se o estudante existe
		const student = await db
			.select()
			.from(studentsTable)
			.where(eq(studentsTable.idPractitioner, data.idStudent));

		if (student.length === 0) {
			throw new Error("Estudante não encontrado");
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

		// Verificar se já existe uma matrícula ativa para este estudante nesta disciplina
		const existingMatriculation = await db
			.select()
			.from(matriculationsTable)
			.where(
				and(
					eq(matriculationsTable.idStudent, data.idStudent),
					eq(matriculationsTable.idDiscipline, data.idDiscipline),
					eq(matriculationsTable.status, "active"),
				),
			);

		if (existingMatriculation.length > 0) {
			throw new Error(
				"Este estudante já possui uma matrícula ativa nesta disciplina",
			);
		}

		await db.insert(matriculationsTable).values(data);
		return { message: "Matrícula criada com sucesso" };
	}

	async updateMatriculation(id: number, data: UpdateMatriculationInput) {
		const existingMatriculation = await db
			.select()
			.from(matriculationsTable)
			.where(eq(matriculationsTable.id, id));

		if (existingMatriculation.length === 0) {
			throw new Error("Matrícula não encontrada");
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
			.update(matriculationsTable)
			.set(data)
			.where(eq(matriculationsTable.id, id));

		return { message: "Matrícula atualizada com sucesso" };
	}

	async deleteMatriculation(id: number) {
		const existingMatriculation = await db
			.select()
			.from(matriculationsTable)
			.where(eq(matriculationsTable.id, id));

		if (existingMatriculation.length === 0) {
			throw new Error("Matrícula não encontrada");
		}

		await db.delete(matriculationsTable).where(eq(matriculationsTable.id, id));

		return { message: "Matrícula excluída com sucesso" };
	}
}
