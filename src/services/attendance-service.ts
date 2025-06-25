import { and, count, eq, inArray } from "drizzle-orm";
import { DateTime } from "luxon";
import { db } from "../db";
import { attendancesTable } from "../db/schema/attendance-schemas/attendances";
import { sessionsTable } from "../db/schema/attendance-schemas/sessions";
import { instructorDisciplinesTable } from "../db/schema/practitioner-schemas/instructor-disciplines";
import { matriculationsTable } from "../db/schema/practitioner-schemas/matriculations";
import { ConflictError, NotFoundError } from "../errors/app-errors";
import type {
	CreateAttendanceInput,
	UpdateAttendanceInput,
} from "../schemas/attendance.schemas";
import { DailyAbsenceService } from "./daily-absence-service";

export interface AttendanceFilters {
	idSession?: number;
	idDiscipline?: number;
	idMatriculation?: number;
	date?: string;
	status?: "present" | "absent";
}

export class AttendanceService {
	async listAttendances(
		filters?: AttendanceFilters,
		pagination?: { limit: number; offset: number },
	) {
		const { limit, offset } = pagination || { limit: 10, offset: 0 };

		// Construir a consulta base
		const baseQuery = db
			.select({
				id: attendancesTable.id,
				idMatriculation: attendancesTable.idMatriculation,
				idSession: attendancesTable.idSession,
				status: attendancesTable.status,
				createdAt: attendancesTable.createdAt,
				updatedAt: attendancesTable.updatedAt,
				sessionId: sessionsTable.id,
				sessionDate: sessionsTable.date,
				sessionStartingTime: sessionsTable.startingTime,
				sessionEndingTime: sessionsTable.endingTime,
				sessionIdDiscipline: sessionsTable.idDiscipline,
			})
			.from(attendancesTable)
			.leftJoin(
				sessionsTable,
				eq(attendancesTable.idSession, sessionsTable.id),
			);

		// Construir as condições de filtro
		const conditions = [];

		if (filters?.idSession) {
			conditions.push(eq(attendancesTable.idSession, filters.idSession));
		}

		if (filters?.idMatriculation) {
			conditions.push(
				eq(attendancesTable.idMatriculation, filters.idMatriculation),
			);
		}

		if (filters?.status) {
			conditions.push(eq(attendancesTable.status, filters.status));
		}

		if (filters?.idDiscipline) {
			conditions.push(eq(sessionsTable.idDiscipline, filters.idDiscipline));
		}

		if (filters?.date) {
			const dateObj = DateTime.fromISO(filters.date).toJSDate();
			conditions.push(eq(sessionsTable.date, dateObj));
		}

		const where = conditions.length > 0 ? and(...conditions) : undefined;

		// Executar as consultas de contagem e de dados em paralelo
		const [result, [{ count: total }]] = await Promise.all([
			baseQuery.where(where).limit(limit).offset(offset),
			db
				.select({ count: count() })
				.from(attendancesTable)
				.leftJoin(
					sessionsTable,
					eq(attendancesTable.idSession, sessionsTable.id),
				)
				.where(where),
		]);

		// Transformar o resultado para o formato esperado
		const formattedAttendances = result.map((item) => ({
			id: item.id,
			idMatriculation: item.idMatriculation,
			idSession: item.idSession,
			status: item.status,
			createdAt: item.createdAt,
			updatedAt: item.updatedAt,
			session: {
				id: item.sessionId,
				date: item.sessionDate,
				startingTime: item.sessionStartingTime,
				endingTime: item.sessionEndingTime,
				idDiscipline: item.sessionIdDiscipline,
			},
		}));

		return { items: formattedAttendances, count: Number(total) };
	}

	async createAttendance(data: CreateAttendanceInput) {
		const session = await db
			.select()
			.from(sessionsTable)
			.where(eq(sessionsTable.id, data.idSession));
		if (session.length === 0) {
			throw new NotFoundError("Aula não encontrada");
		}

		const existingAttendances = await db
			.select()
			.from(attendancesTable)
			.where(eq(attendancesTable.idSession, data.idSession));

		if (existingAttendances.length > 0) {
			throw new ConflictError("Frequência já lançada para esta aula");
		}

		const matriculations = await db
			.select()
			.from(matriculationsTable)
			.where(
				and(
					eq(matriculationsTable.idDiscipline, session[0].idDiscipline),
					eq(matriculationsTable.status, "active"),
				),
			);
		if (matriculations.length === 0) {
			throw new NotFoundError(
				"Nenhum aluno ativo e matriculado encontrado para esta disciplina",
			);
		}

		const attendanceData = matriculations.map((matriculation) => ({
			idMatriculation: matriculation.id,
			idSession: data.idSession,
		}));

		await db.insert(attendancesTable).values(attendanceData);

		return {
			message: "Frequência lançada com sucesso",
			count: attendanceData.length,
		};
	}

	async updateAttendance(id: number, data: UpdateAttendanceInput) {
		const existingSession = await db
			.select()
			.from(sessionsTable)
			.where(eq(sessionsTable.id, id));

		if (existingSession.length === 0) {
			throw new NotFoundError("Aula não encontrada");
		}

		// Atualizar cada registro de frequência
		for (const attendanceUpdate of data) {
			await db
				.update(attendancesTable)
				.set(attendanceUpdate)
				.where(
					and(
						eq(attendancesTable.idSession, id),
						eq(
							attendancesTable.idMatriculation,
							attendanceUpdate.idMatriculation,
						),
					),
				);
		}

		// Após atualizar as frequências, processar ausências diárias para a data da aula
		// apenas se for a última aula do dia
		if (existingSession[0].isLastSessionOfDay) {
			try {
				const dailyAbsenceService = new DailyAbsenceService();
				await dailyAbsenceService.processAbsencesForDate(
					existingSession[0].date,
				);
			} catch (error) {
				console.error("Erro ao processar ausências diárias:", error);
				// Não interromper o fluxo principal se houver erro no processamento de ausências
			}
		}

		return { message: "Frequência atualizada com sucesso" };
	}

	async deleteAttendance(idSession: number) {
		// Verificar se a aula existe
		const existingSession = await db
			.select()
			.from(sessionsTable)
			.where(eq(sessionsTable.id, idSession));

		if (existingSession.length === 0) {
			throw new NotFoundError("Aula não encontrada");
		}

		// Verificar se existem frequências para esta aula
		const existingAttendances = await db
			.select()
			.from(attendancesTable)
			.where(eq(attendancesTable.idSession, idSession));

		if (existingAttendances.length === 0) {
			throw new NotFoundError("Nenhuma frequência encontrada para esta aula");
		}

		// Deletar todas as frequências da aula
		await db
			.delete(attendancesTable)
			.where(eq(attendancesTable.idSession, idSession));

		return {
			message: "Frequências da aula excluídas com sucesso",
			deletedCount: existingAttendances.length,
		};
	}
}
