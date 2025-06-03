import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { attendancesTable } from "../db/schema/attendance-schemas/attendances";
import { dailyAttendancesTable } from "../db/schema/attendance-schemas/daily-attendances";
import { dailySessionsTable } from "../db/schema/attendance-schemas/daily-sessions";
import { sessionsTable } from "../db/schema/attendance-schemas/sessions";
import { instructorDisciplinesTable } from "../db/schema/practitioner-schemas/instructor-disciplines";
import { matriculationsTable } from "../db/schema/practitioner-schemas/matriculations";
import { ConflictError, NotFoundError } from "../errors/app-errors";
import type {
	CreateAttendanceDailyInput,
	CreateAttendanceInput,
	JustificationAttendanceInput,
	UpdateAttendanceInput,
} from "../schemas/attendance.schemas";

export class AttendanceService {
	async listAttendances() {
		const attendances = await db.query.attendancesTable.findMany();
		if (attendances.length === 0) {
			throw new NotFoundError("Nenhum registro de frequência encontrado");
		}
		return attendances;
	}

	async listDailyAttendances() {
		const attendances = await db.query.dailyAttendancesTable.findMany({
			with: {
				// dailyAttendancesRelations
				matriculation: {
					with: {
						// matriculationsRelations
						user: {
							columns: {
								id: true,
								firstName: true,
								surname: true,
								phone: true,
								email: true,
							},
						},
					},
				},
				dailySession: {
					with: {
						// dailySessionsRelations
						instructorDiscipline: {
							with: {
								// instructorDisciplineRelations
								discipline: {},
							},
						},
					},
				},
			},
		});
		if (attendances.length === 0) {
			throw new NotFoundError(
				"Nenhum registro de frequência diária encontrado",
			);
		}
		return attendances;
	}

	async getAttendanceByMatriculation(id: number) {
		const attendances = await db.query.dailyAttendancesTable.findMany({
			where: eq(dailyAttendancesTable.idMatriculation, id),
			with: {
				// dailyAttendancesRelations
				dailySession: {
					with: {
						// dailySessionsRelations
						instructorDiscipline: {
							with: {
								// instructorDisciplineRelations
								discipline: {},
							},
						},
					},
				},
				session: {},
			},
		});

		if (attendances.length === 0) {
			throw new NotFoundError("Nenhum registro de frequência encontrado");
		}

		return attendances;
	}

	async createAttendance(data: CreateAttendanceInput) {
		const session = await db
			.select()
			.from(sessionsTable)
			.where(eq(sessionsTable.id, data.idSession));
		if (session.length === 0) {
			throw new NotFoundError("Aula não encontrada");
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
			throw new NotFoundError("Nenhum aluno ativo e matriculado encontrado");
		}

		const activeAttendancesOfThisSession = await db
			.select()
			.from(attendancesTable)
			.where(eq(attendancesTable.idSession, data.idSession));

		if (activeAttendancesOfThisSession.length > 0) {
			return {
				message: "Frequência já lançada para esta aula",
				idDailySession: session[0].idDailySession,
			};
		}

		const attendanceData = matriculations.map((matriculation) => ({
			idMatriculation: matriculation.id,
			idSession: data.idSession,
			idDailySession: session[0].idDailySession,
		}));

		await db.insert(attendancesTable).values(attendanceData);

		return {
			message: "Frequência lançada",
			idDailySession: session[0].idDailySession,
		};
	}

	async createAttendanceDaily(data: CreateAttendanceDailyInput) {
		const dailySession = await db
			.select({
				id: dailySessionsTable.id,
				idInstructorDiscipline: dailySessionsTable.idInstructorDiscipline,
				date: dailySessionsTable.date,
				idDiscipline: instructorDisciplinesTable.idDiscipline,
			})
			.from(dailySessionsTable)
			.innerJoin(
				instructorDisciplinesTable,
				eq(
					dailySessionsTable.idInstructorDiscipline,
					instructorDisciplinesTable.id,
				),
			)
			.where(eq(dailySessionsTable.id, data.idDailySession));

		if (dailySession.length === 0) {
			throw new NotFoundError("Sessão diária não encontrada");
		}

		const matriculations = await db
			.select()
			.from(matriculationsTable)
			.where(
				and(
					eq(matriculationsTable.idDiscipline, dailySession[0].idDiscipline),
					eq(matriculationsTable.status, "active"),
				),
			);
		if (matriculations.length === 0) {
			throw new NotFoundError("Nenhum aluno ativo e matriculado encontrado");
		}

		const activeAttendancesOfThisSession = await db
			.select()
			.from(dailyAttendancesTable)
			.where(eq(dailyAttendancesTable.idDailySession, data.idDailySession));

		if (activeAttendancesOfThisSession.length > 0) {
			return { message: "Frequência diária já lançada para esta aula" };
		}

		const dailyAttendanceData = matriculations.map((matriculation) => ({
			idMatriculation: matriculation.id,
			idDailySession: data.idDailySession,
		}));

		await db.insert(dailyAttendancesTable).values(dailyAttendanceData);

		return { message: "Frequência lançada" };
	}

	async updateAttendance(id: number, data: UpdateAttendanceInput) {
		const existingSession = await db
			.select()
			.from(sessionsTable)
			.where(eq(sessionsTable.id, id));

		if (existingSession.length === 0) {
			throw new NotFoundError("Aula não encontrada");
		}

		for (const attendanceUpdate of data.attendances) {
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

		const session = await db
			.select()
			.from(sessionsTable)
			.where(eq(sessionsTable.id, id));
		const dailySession = await db
			.select()
			.from(dailySessionsTable)
			.where(eq(dailySessionsTable.id, session[0].idDailySession));

		if (dailySession.length === 0) {
			throw new NotFoundError("Sessão diária não encontrada");
		}

		const dailyAttendances = await db
			.select()
			.from(dailyAttendancesTable)
			.where(eq(dailyAttendancesTable.idDailySession, dailySession[0].id));

		for (const dailyAttendanceUpdate of data.attendances) {
			// Verifica se existe frequência diária com idSession null e status "absent"
			const existingAbsent = dailyAttendances.find(
				(a) =>
					a.idMatriculation === dailyAttendanceUpdate.idMatriculation &&
					a.idDailySession === dailySession[0].id &&
					a.idSession === null &&
					a.status === "absent",
			);

			// Verifica se já existe registro com idSession e status "present"
			const existingPresent = dailyAttendances.find(
				(a) =>
					a.idMatriculation === dailyAttendanceUpdate.idMatriculation &&
					a.idDailySession === dailySession[0].id &&
					a.idSession !== null &&
					a.status === "present",
			);

			if (existingAbsent) {
				// Atualiza o registro existente para o novo status/idSession
				await db
					.update(dailyAttendancesTable)
					.set({
						status: dailyAttendanceUpdate.status,
						idSession: id,
					})
					.where(
						and(
							eq(dailyAttendancesTable.idDailySession, dailySession[0].id),
							eq(
								dailyAttendancesTable.idMatriculation,
								dailyAttendanceUpdate.idMatriculation,
							),
						),
					);
			} else if (
				existingPresent &&
				dailyAttendanceUpdate.status === "present" &&
				existingPresent.idSession !== id
			) {
				// Insere novo registro se existir uma "presença" neste dia
				await db.insert(dailyAttendancesTable).values({
					idDailySession: dailySession[0].id,
					idMatriculation: dailyAttendanceUpdate.idMatriculation,
					idSession: id,
					status: "present",
				});
			}
		}

		return { message: "Frequência atualizada com sucesso" };
	}

	async justifyAttendance(id: number, data: JustificationAttendanceInput) {
		const existingAttendance = await db
			.select()
			.from(dailyAttendancesTable)
			.where(eq(dailyAttendancesTable.id, id));
		if (existingAttendance.length === 0) {
			throw new NotFoundError("Registro não encontrado");
		}
		if (existingAttendance[0].status !== "absent") {
			throw new ConflictError(
				"O registro não está ausente, não é possível justificar",
			);
		}

		await db
			.update(dailyAttendancesTable)
			.set({
				justification: data.justification,
				justificationDescription: data.justificationDescription,
			})
			.where(eq(dailyAttendancesTable.id, id));

		return { message: "Justificativa registrada com sucesso" };
	}

	async deleteAttendance(id: number) {
		const existingAttendance = await db
			.select()
			.from(attendancesTable)
			.where(eq(attendancesTable.id, id));

		if (existingAttendance.length === 0) {
			throw new NotFoundError("Registro não encontrado");
		}

		await db.delete(attendancesTable).where(eq(attendancesTable.id, id));

		return { message: "Registro excluído com sucesso" };
	}

	async deleteDailyAttendance(id: number) {
		const existingAttendance = await db
			.select()
			.from(dailyAttendancesTable)
			.where(eq(dailyAttendancesTable.id, id));

		if (existingAttendance.length === 0) {
			throw new NotFoundError("Registro não encontrado");
		}

		await db
			.delete(dailyAttendancesTable)
			.where(eq(dailyAttendancesTable.id, id));

		return { message: "Registro excluído com sucesso" };
	}
}
