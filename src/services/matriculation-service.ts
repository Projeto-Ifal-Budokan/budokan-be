import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { disciplinesTable } from "../db/schema/discipline-schemas/disciplines";
import { ranksTable } from "../db/schema/discipline-schemas/ranks";
import { matriculationsTable } from "../db/schema/practitioner-schemas/matriculations";
import { practitionersTable } from "../db/schema/practitioner-schemas/practitioners";
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
		// Verificar se o usuário existe como praticante
		const practitioner = await db
			.select()
			.from(practitionersTable)
			.where(eq(practitionersTable.idUser, data.idStudent));

		if (practitioner.length === 0) {
			throw new Error("Usuário não encontrado como praticante");
		}

		// Verificar se o praticante já está registrado como estudante, se não, criar
		let student = await db
			.select()
			.from(studentsTable)
			.where(eq(studentsTable.idPractitioner, data.idStudent));

		if (student.length === 0) {
			// Criar automaticamente um registro de estudante
			await db.insert(studentsTable).values({
				idPractitioner: data.idStudent,
			});

			console.log(
				`Registro de estudante criado automaticamente para o praticante ${data.idStudent}`,
			);

			student = await db
				.select()
				.from(studentsTable)
				.where(eq(studentsTable.idPractitioner, data.idStudent));

			if (student.length === 0) {
				throw new Error("Falha ao criar registro de estudante");
			}
		}

		// Verificar se a disciplina existe
		const discipline = await db
			.select()
			.from(disciplinesTable)
			.where(eq(disciplinesTable.id, data.idDiscipline));

		if (discipline.length === 0) {
			throw new Error("Disciplina não encontrada");
		}

		// Verificar se a graduação existe e pertence à disciplina selecionada
		const rank = await db
			.select()
			.from(ranksTable)
			.where(
				and(
					eq(ranksTable.id, data.idRank),
					eq(ranksTable.idDiscipline, data.idDiscipline),
				),
			);

		if (rank.length === 0) {
			throw new Error(
				"Graduação não encontrada ou não pertence à disciplina selecionada",
			);
		}

		// Verificar se já existe uma matrícula ativa para este estudante nesta disciplina
		const existingMatriculation = await db
			.select()
			.from(matriculationsTable)
			.where(
				and(
					eq(matriculationsTable.idStudent, data.idStudent),
					eq(matriculationsTable.idDiscipline, data.idDiscipline),
				),
			);

		if (existingMatriculation.length > 0) {
			throw new Error(
				"Este estudante já possui uma matrícula nesta disciplina",
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

		// Verificar se a graduação existe e pertence à disciplina da matrícula
		if (data.idRank) {
			const matriculationDiscipline = existingMatriculation[0].idDiscipline;

			const rank = await db
				.select()
				.from(ranksTable)
				.where(
					and(
						eq(ranksTable.id, data.idRank),
						eq(ranksTable.idDiscipline, matriculationDiscipline),
					),
				);

			if (rank.length === 0) {
				throw new Error(
					"Graduação não encontrada ou não pertence à disciplina da matrícula",
				);
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
