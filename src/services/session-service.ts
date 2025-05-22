import { and, eq, or, lt, lte, gt, gte } from "drizzle-orm";
import { db } from "../db";
import { sessionsTable } from "../db/schema/attendance-schemas/sessions";
import { disciplinesTable } from "../db/schema/discipline-schemas/disciplines";
import { ranksTable } from "../db/schema/discipline-schemas/ranks";
import { instructorDisciplinesTable } from "../db/schema/practitioner-schemas/instructor-disciplines";
import { instructorsTable } from "../db/schema/practitioner-schemas/instructors";
import type {
	CreateSessionInput,
	UpdateSessionInput,
} from "../schemas/session.schemas";

export class SessionService {
	async listSessions() {
		const sessions = await db
			.select({
				id: sessionsTable.id,
				idInstructorDiscipline: sessionsTable.idInstructorDiscipline,
				idDiscipline: sessionsTable.idDiscipline,
				date: sessionsTable.date,
				startingTime: sessionsTable.startingTime,
				endingTime: sessionsTable.endingTime,
				createdAt: sessionsTable.createdAt,
				updatedAt: sessionsTable.updatedAt,
			})
			.from(sessionsTable);

		return sessions;
	}

	async getSessionById(id: number) {
		const session = await db
			.select({
				id: sessionsTable.id,
				idInstructorDiscipline: sessionsTable.idInstructorDiscipline,
				idDiscipline: sessionsTable.idDiscipline,
				date: sessionsTable.date,
				startingTime: sessionsTable.startingTime,
				endingTime: sessionsTable.endingTime,
				createdAt: sessionsTable.createdAt,
				updatedAt: sessionsTable.updatedAt,
			})
			.from(sessionsTable)
			.where(eq(sessionsTable.id, id));

		if (session.length === 0) {
			throw new Error("Aula não encontrada");
		}

		return session[0];
	}

	async getSessionsByInstructorDiscipline(idInstructorDiscipline: number) {
		const sessions = await db
			.select({
				id: sessionsTable.id,
				idInstructorDiscipline: sessionsTable.idInstructorDiscipline,
				idDiscipline: sessionsTable.idDiscipline,
				date: sessionsTable.date,
				startingTime: sessionsTable.startingTime,
				endingTime: sessionsTable.endingTime,
				createdAt: sessionsTable.createdAt,
				updatedAt: sessionsTable.updatedAt,
			})
			.from(sessionsTable)
			.where(eq(sessionsTable.idInstructorDiscipline, idInstructorDiscipline));

		return sessions;
	}

	async createSession(data: CreateSessionInput) {
		// Verificar se a disciplina existe
		const discipline = await db
			.select()
			.from(disciplinesTable)
			.where(eq(disciplinesTable.id, data.idDiscipline));

		if (discipline.length === 0) {
			throw new Error("Disciplina não encontrada");
		}

		// Verificar se o instrutor existe
		const instructor = await db
			.select()
			.from(instructorsTable)
			.where(eq(instructorsTable.idPractitioner, data.idInstructor));

		if (instructor.length === 0) {
			throw new Error("Instrutor não encontrado");
		}
		// Verificar se o instrutor é responsável pela disciplina informada
		const instructorDisciplines = await db
			.select()
			.from(instructorDisciplinesTable)
			.where(
				and(
					eq(instructorDisciplinesTable.idInstructor, data.idInstructor),
					eq(instructorDisciplinesTable.idDiscipline, data.idDiscipline),
				),
			);

		if (instructorDisciplines.length === 0) {
			throw new Error(
				"O instrutor informado não é responsável pela disciplina",
			);
		}

		// Verificar se já existe uma aula ativa para este dia e horario

		const conflictingSessions = await db
			.select()
			.from(sessionsTable)
			.where(
				and(
					// Mesma disciplina e mesmo dia
					eq(sessionsTable.idDiscipline, data.idDiscipline),
					eq(sessionsTable.date, data.date),

					// Verifica sobreposição de horários:
					or(
						// 1. Novo horário começa DENTRO de uma aula existente
						and(
							gt(data.startTime, sessionsTable.startingTime),
							lt(data.startTime, sessionsTable.endingTime),
						),
						// 2. Novo horário termina DENTRO de uma aula existente
						and(
							gt(data.endTime, sessionsTable.startingTime),
							lt(data.endTime, sessionsTable.endingTime),
						),
						// 3. Novo horário ENGLOBA completamente uma aula existente
						and(
							lte(data.startTime, sessionsTable.startingTime),
							gte(data.endTime, sessionsTable.endingTime),
						),
						// 4. Aula existente ENGLOBA completamente o novo horário
						and(
							lte(sessionsTable.startingTime, data.startTime),
							gte(sessionsTable.endingTime, data.endTime),
						),
					),
				),
			);

		if (conflictingSessions.length > 0) {
			throw new Error(
				"Conflito de horário: já existe uma aula agendada neste intervalo",
			);
		}

		await db.insert(sessionsTable).values(data);
		return { message: "Aula criada com sucesso" };
	}

	async updateSession(id: number, data: UpdateSessionInput) {
		const existingSession = await db
			.select()
			.from(sessionsTable)
			.where(eq(sessionsTable.id, id));

		if (existingSession.length === 0) {
			throw new Error("Matrícula não encontrada");
		}

		// Verificar se a graduação existe e pertence à disciplina da matrícula
		if (data.idRank) {
			const sessionDiscipline = existingSession[0].idDiscipline;

			const rank = await db
				.select()
				.from(ranksTable)
				.where(
					and(
						eq(ranksTable.id, data.idRank),
						eq(ranksTable.idDiscipline, sessionDiscipline),
					),
				);

			if (rank.length === 0) {
				throw new Error(
					"Graduação não encontrada ou não pertence à disciplina da matrícula",
				);
			}
		}

		await db.update(sessionsTable).set(data).where(eq(sessionsTable.id, id));

		return { message: "Matrícula atualizada com sucesso" };
	}

	async deleteSession(id: number) {
		const existingSession = await db
			.select()
			.from(sessionsTable)
			.where(eq(sessionsTable.id, id));

		if (existingSession.length === 0) {
			throw new Error("Matrícula não encontrada");
		}

		await db.delete(sessionsTable).where(eq(sessionsTable.id, id));

		return { message: "Matrícula excluída com sucesso" };
	}
}
