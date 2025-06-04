import { and, count, eq, inArray, sql } from "drizzle-orm";
import { DateTime } from "luxon";
import { db } from "../db";
import {
	attendancesTable,
	dailyAbsencesTable,
	sessionsTable,
} from "../db/schema";
import { ConflictError, NotFoundError } from "../errors/app-errors";
import type {
	CreateDailyAbsenceInput,
	UpdateDailyAbsenceInput,
} from "../schemas/attendance.schemas";

export class DailyAbsenceService {
	async listDailyAbsences(idMatriculation: number) {
		const absences = await db.query.dailyAbsencesTable.findMany({
			where: eq(dailyAbsencesTable.idMatriculation, idMatriculation),
			orderBy: (dailyAbsences) => [dailyAbsences.date],
		});

		if (absences.length === 0) {
			throw new NotFoundError(
				"Nenhuma ausência diária encontrada para esta matrícula",
			);
		}

		return absences;
	}

	async getDailyAbsence(id: number) {
		const absence = await db.query.dailyAbsencesTable.findFirst({
			where: eq(dailyAbsencesTable.id, id),
		});

		if (!absence) {
			throw new NotFoundError("Ausência diária não encontrada");
		}

		return absence;
	}

	async createDailyAbsence(data: CreateDailyAbsenceInput) {
		// Verificar se já existe uma ausência registrada para este dia e matrícula
		const existingAbsence = await db.query.dailyAbsencesTable.findFirst({
			where: and(
				eq(dailyAbsencesTable.idMatriculation, data.idMatriculation),
				eq(dailyAbsencesTable.date, DateTime.fromISO(data.date).toJSDate()),
			),
		});

		if (existingAbsence) {
			throw new ConflictError(
				"Já existe uma ausência registrada para este dia",
			);
		}

		// Verificar se o aluno realmente não teve presença neste dia
		const dateObj = DateTime.fromISO(data.date).toJSDate();

		const attendances = await db
			.select()
			.from(attendancesTable)
			.innerJoin(
				sessionsTable,
				eq(attendancesTable.idSession, sessionsTable.id),
			)
			.where(
				and(
					eq(attendancesTable.idMatriculation, data.idMatriculation),
					eq(sessionsTable.date, dateObj),
					eq(attendancesTable.status, "present"),
				),
			);

		if (attendances.length > 0) {
			throw new ConflictError(
				"O aluno tem presenças registradas neste dia, não é possível registrar ausência diária",
			);
		}

		// Criar o registro de ausência diária
		const result = await db.insert(dailyAbsencesTable).values({
			idMatriculation: data.idMatriculation,
			date: dateObj,
			justification: data.justification,
			justificationDescription: data.justificationDescription,
		});

		return {
			message: "Ausência diária registrada com sucesso",
			id: result[0].insertId,
		};
	}

	async updateDailyAbsence(id: number, data: UpdateDailyAbsenceInput) {
		const existingAbsence = await this.getDailyAbsence(id);

		await db
			.update(dailyAbsencesTable)
			.set({
				justification: data.justification,
				justificationDescription: data.justificationDescription,
			})
			.where(eq(dailyAbsencesTable.id, id));

		return {
			message: "Justificativa de ausência diária atualizada com sucesso",
		};
	}

	async deleteDailyAbsence(id: number) {
		const existingAbsence = await this.getDailyAbsence(id);

		await db.delete(dailyAbsencesTable).where(eq(dailyAbsencesTable.id, id));

		return { message: "Ausência diária excluída com sucesso" };
	}

	async countAbsenceDays(idMatriculation: number) {
		// Contar dias registrados na tabela de ausências diárias
		const registeredAbsences = await db
			.select({ count: count() })
			.from(dailyAbsencesTable)
			.where(eq(dailyAbsencesTable.idMatriculation, idMatriculation));

		// Contar dias em que o aluno não teve nenhuma presença
		// Primeiro, encontrar todos os dias que o aluno teve aulas
		const sessionDays = await db
			.select({
				date: sessionsTable.date,
			})
			.from(sessionsTable)
			.innerJoin(
				attendancesTable,
				eq(sessionsTable.id, attendancesTable.idSession),
			)
			.where(eq(attendancesTable.idMatriculation, idMatriculation))
			.groupBy(sessionsTable.date);

		// Para cada dia, verificar se o aluno teve pelo menos uma presença
		let totalAbsenceDays = 0;

		for (const day of sessionDays) {
			const presences = await db
				.select()
				.from(attendancesTable)
				.innerJoin(
					sessionsTable,
					eq(attendancesTable.idSession, sessionsTable.id),
				)
				.where(
					and(
						eq(attendancesTable.idMatriculation, idMatriculation),
						eq(sessionsTable.date, day.date),
						eq(attendancesTable.status, "present"),
					),
				);

			if (presences.length === 0) {
				totalAbsenceDays++;
			}
		}

		return {
			registeredAbsences: registeredAbsences[0]?.count || 0,
			totalAbsenceDays,
		};
	}

	async processAbsencesForDate(date: string | Date) {
		// Converter para objeto Date se for string
		const targetDate =
			typeof date === "string" ? DateTime.fromISO(date).toJSDate() : date;

		// Buscar todas as sessões do dia
		const sessions = await db
			.select()
			.from(sessionsTable)
			.where(eq(sessionsTable.date, targetDate));

		if (sessions.length === 0) {
			return {
				message: "Nenhuma aula encontrada para a data informada",
				processed: 0,
			};
		}

		// Buscar todas as matrículas que tiveram aulas neste dia
		const sessionIds = sessions.map((session) => session.id);

		const matriculationsWithSessions = await db
			.select({
				idMatriculation: attendancesTable.idMatriculation,
			})
			.from(attendancesTable)
			.where(inArray(attendancesTable.idSession, sessionIds))
			.groupBy(attendancesTable.idMatriculation);

		// Para cada matrícula, verificar se teve pelo menos uma presença no dia
		let absencesCreated = 0;

		for (const { idMatriculation } of matriculationsWithSessions) {
			// Verificar se já existe um registro de ausência para este aluno neste dia
			const existingAbsence = await db.query.dailyAbsencesTable.findFirst({
				where: and(
					eq(dailyAbsencesTable.idMatriculation, idMatriculation),
					eq(dailyAbsencesTable.date, targetDate),
				),
			});

			if (existingAbsence) {
				continue; // Já existe um registro, pular para o próximo
			}

			// Verificar se o aluno teve alguma presença neste dia
			const presences = await db
				.select()
				.from(attendancesTable)
				.where(
					and(
						eq(attendancesTable.idMatriculation, idMatriculation),
						inArray(attendancesTable.idSession, sessionIds),
						eq(attendancesTable.status, "present"),
					),
				);

			// Se não teve nenhuma presença, criar um registro de ausência diária
			if (presences.length === 0) {
				await db.insert(dailyAbsencesTable).values({
					idMatriculation,
					date: targetDate,
					// Sem justificativa inicialmente
				});

				absencesCreated++;
			}
		}

		return {
			message: `Processamento concluído. ${absencesCreated} ausências diárias registradas.`,
			processed: absencesCreated,
		};
	}

	async processAbsencesForDateRange(startDate: string, endDate: string) {
		const start = DateTime.fromISO(startDate);
		const end = DateTime.fromISO(endDate);

		if (!start.isValid || !end.isValid) {
			throw new Error("Datas inválidas");
		}

		if (end < start) {
			throw new Error("A data final deve ser posterior à data inicial");
		}

		let current = start;
		let totalProcessed = 0;

		// Processar cada dia no intervalo
		while (current <= end) {
			const result = await this.processAbsencesForDate(current.toJSDate());
			totalProcessed += result.processed;
			current = current.plus({ days: 1 });
		}

		return {
			message: `Processamento concluído. ${totalProcessed} ausências diárias registradas no período.`,
			processed: totalProcessed,
		};
	}
}
