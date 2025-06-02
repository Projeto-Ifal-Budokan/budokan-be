import { and, desc, eq, gt, gte, lt, lte, or, inArray } from "drizzle-orm";
import { db } from "../db";
import { AttendanceService } from "./attendance-service";
import { sessionsTable } from "../db/schema/attendance-schemas/sessions";
import { disciplinesTable } from "../db/schema/discipline-schemas/disciplines";
import { instructorDisciplinesTable } from "../db/schema/practitioner-schemas/instructor-disciplines";
import { instructorsTable } from "../db/schema/practitioner-schemas/instructors";
import { attendancesTable } from "../db/schema";
import { dailySessionsTable } from "../db/schema/attendance-schemas/daily-sessions";
import { dailyAttendancesTable } from "../db/schema/attendance-schemas/daily-attendances";
import { ConflictError, NotFoundError } from "../errors/app-errors";
import type {
	CreateSessionInput,
	UpdateSessionInput,
	ListSessionInput,
	ViewMatriculationSessionsInput,
} from "../schemas/session.schemas";

export class SessionService {
	async listSessions(filters: ListSessionInput) {
		// busca os IDs de das disciplinas que o usuario é instrutor, se informada uma disciplina busca apenas o id dessa disciplina.
		const instructorDisciplineID = await db.
			select({
				id: instructorDisciplinesTable.id,
			})
			.from(instructorDisciplinesTable)
			.where(
				and(
					filters.idInstructor ? eq(instructorDisciplinesTable.idInstructor, filters.idInstructor) : undefined,
					filters.idDiscipline ? eq(instructorDisciplinesTable.idDiscipline, filters.idDiscipline) : undefined,
				)
			);

		// Buscar sessões ministradas por um instrutor específico
		const sessions = await db.query.sessionsTable.findMany({
			where: (session) => {
				const conditions = [
					filters.idDiscipline
						? eq(session.idDiscipline, filters.idDiscipline)
						: undefined,
					instructorDisciplineID
						? inArray(session.idInstructorDiscipline, instructorDisciplineID.map(id => id.id))
						: undefined,
					filters.initialDate
						? gte(sessionsTable.date, new Date(filters.initialDate))
						: undefined,
					filters.finalDate
						? lte(sessionsTable.date, new Date(filters.finalDate))
						: undefined,
				].filter(Boolean);
				return and(...conditions);
			},
			with: {
				instructorDiscipline: {
					columns: {
						id: true,
						idInstructor: true,
						idDiscipline: true,
					},
				},
				attendances: {
					columns: {
						id: true,
						idMatriculation: true,
						idSession: true,
						status: true,
					},
					with: {
						matriculation: {
							columns: {
								id: true,
								idStudent: true,
								idDiscipline: true,
								idRank: true,
								status: true,
							},
							with: {
								user: {
									columns: {
										id: true,
										firstName: true,
										surname: true,
										phone: true,
										email: true,
									}
								},
							},
						},
					}
				}
			},
			orderBy: desc(sessionsTable.date),
			limit: filters.limit || 100, // Limite padrão de 100 sessões
		});

		if (sessions.length === 0) {
			throw new NotFoundError("Nenhuma aula encontrada com os filtros informados");
		}

		return sessions;
	}

	async viewMatriculationSessions(idMatriculation: number, data: ViewMatriculationSessionsInput) {
		const attendance = await db
			.select()
			.from(dailyAttendancesTable)
			.innerJoin(
				dailySessionsTable,
				eq(dailyAttendancesTable.idDailySession, dailySessionsTable.id),
			)
			.innerJoin(
				instructorDisciplinesTable,
				eq(dailySessionsTable.idInstructorDiscipline, instructorDisciplinesTable.id),
			)
			.where(
				and(
					eq(dailyAttendancesTable.idMatriculation, idMatriculation),
					eq(instructorDisciplinesTable.idDiscipline, data.idDiscipline),
				)
			);
		if (attendance.length === 0) {
			throw new NotFoundError("Nenhum registro de frequência encontrado");
		}
		return attendance
	}

	async createSession(data: CreateSessionInput) {
		const validatedData = await this.validateSession(data);
		
		const idDailySession = await this.createDailySession(validatedData.idInstructorDiscipline, validatedData.date); // no createSession sempre vai existir idInstructorDiscipline
		
		const sessionData = {
			...validatedData,
			...idDailySession, // idDailySession é retornado pela função createDailySession
		};

		const result = await db.insert(sessionsTable).values(sessionData);
		
		// lancamento de presença para a nova aula
		const insertId = Array.isArray(result) && result[0]?.insertId
		? result[0].insertId
		: undefined;
		
		const attendanceService = new AttendanceService();
		if (insertId) {
			await attendanceService.createAttendance({
				idSession: insertId,
			});
		}

		return { message: "Aula criada com sucesso" };
	}

	async updateSession(id: number, data: UpdateSessionInput) {
		const existingSession = await db
			.select()
			.from(sessionsTable)
			.where(eq(sessionsTable.id, id));

		if (existingSession.length === 0) {
			throw new NotFoundError("Aula não encontrada");
		}

		if( data.date ) { // se informado uma data, cria uma nova sessão diária. A função createDailySession já possui regra de negócio para não criar duplicidade.
			const idDailySession = await this.createDailySession(existingSession[0].idInstructorDiscipline, new Date(data.date).toISOString().split("T")[0]);
		}

		const sessionData = await this.validateSession(data);

		await db.update(sessionsTable).set(sessionData).where(eq(sessionsTable.id, id));

		return { message: "Aula atualizada com sucesso" };
	}

	async deleteSession(id: number) {
		const existingSession = await db
			.select()
			.from(sessionsTable)
			.where(eq(sessionsTable.id, id));

		if (existingSession.length === 0) {
			throw new NotFoundError("Aula não encontrada");
		}

		await db.delete(attendancesTable).where(eq(attendancesTable.idSession, id));
		await db.delete(sessionsTable).where(eq(sessionsTable.id, id));

		const stillHaveSessionsOfThisDay = await db
			.select()
			.from(sessionsTable)
			.where(
				and(
					eq(sessionsTable.idDailySession, existingSession[0].idDailySession),
					eq(sessionsTable.idInstructorDiscipline, existingSession[0].idInstructorDiscipline),
				)
			);
		
		if (stillHaveSessionsOfThisDay.length === 0) {
			await db.delete(dailyAttendancesTable).where(eq(dailyAttendancesTable.idDailySession, existingSession[0].idDailySession));
			await db.delete(dailySessionsTable).where(eq(dailySessionsTable.id, existingSession[0].idDailySession));
		}

		return { message: "Aula excluída com sucesso" };
	}

	async createDailySession(idInstructorDiscipline: number, date: string) {
		const existsDailySession = await db.select().from(dailySessionsTable)
			.where(
				and(
					eq(dailySessionsTable.idInstructorDiscipline, idInstructorDiscipline),
					eq(dailySessionsTable.date, date),
				)
			);
		
		// Se já existe uma sessão diária para o instrutor e disciplina no dia informado, retorna o ID dessa sessão
		if (existsDailySession.length > 0) {
			return { idDailySession: existsDailySession[0].id };
		}
		// Se não existe, cria uma nova sessão diária
		else {
			const insertDailySession = {
				idInstructorDiscipline: idInstructorDiscipline,
				date: date,
			};

			const dailySessionResult = await db.insert(dailySessionsTable).values(insertDailySession);

			const insertId = Array.isArray(dailySessionResult) && dailySessionResult[0]?.insertId
				? dailySessionResult[0].insertId
				: undefined;

			// Se a inserção foi bem-sucedida, cria a frequência diária
			const attendanceService = new AttendanceService();
			if (insertId) {
				await attendanceService.createAttendanceDaily({
					idDailySession: insertId,
				});
			}
			return { idDailySession: insertId };
		}
	}


	async validateSession(data: CreateSessionInput | UpdateSessionInput) {
		const discipline = await db
			.select()
			.from(disciplinesTable)
			.where(data.idDiscipline ? eq(disciplinesTable.id, data.idDiscipline) : undefined);

		if (discipline.length === 0 && data.idDiscipline) {
			throw new NotFoundError("Disciplina não encontrada");
		}

		// Verificar se o instrutor existe
		const instructor = await db
			.select()
			.from(instructorsTable)
			.where(data.idInstructor ? eq(instructorsTable.idPractitioner, data.idInstructor) : undefined);

		if (instructor.length === 0 && data.idInstructor) {
			throw new NotFoundError("Instrutor não encontrado");
		}

		// Verificar se o instrutor é responsável pela disciplina informada
		const instructorDisciplines = await db
			.select()
			.from(instructorDisciplinesTable)
			.where(
				and(
					data.idInstructor ? eq(instructorDisciplinesTable.idInstructor, data.idInstructor) : undefined,
					data.idDiscipline ? eq(instructorDisciplinesTable.idDiscipline, data.idDiscipline) : undefined,
				),
			);

		if (instructorDisciplines.length === 0 && data.idInstructor && data.idDiscipline) {
			throw new NotFoundError("O instrutor informado não é responsável pela disciplina");
		}

		// Adicionar o idInstructorDiscipline ao objeto de dados pois na tabela sessions a FK é idInstructorDiscipline e não idInstructor
		// Também formata a data para o formato YYYY-MM-DD
		const sessionData = {
			...data,
			idInstructorDiscipline: instructorDisciplines ? instructorDisciplines[0].id : undefined,
			date: data.date ? new Date(data.date).toISOString().split("T")[0] : undefined, // Formato YYYY-MM-DD
		};

		// Verificar se já existe uma aula ativa para este dia e horario
		const conflictingSessions = await db
			.select()
			.from(sessionsTable)
			.where(
				and(
					// Mesma disciplina, mesmo instrutor e mesmo dia
					sessionData.idInstructorDiscipline ? eq(
						sessionsTable.idInstructorDiscipline,
						sessionData.idInstructorDiscipline,
					) : undefined,
					sessionData.idDiscipline ? eq(sessionsTable.idDiscipline, sessionData.idDiscipline) : undefined,
					sessionData.date ? eq(sessionsTable.date, sessionData.date) : undefined,

					// Verifica sobreposição de horários:
					or(
						// 1. Novo horário começa DENTRO de uma aula existente
						and(
							sessionData.startingTime ? lt(sessionsTable.startingTime, sessionData.startingTime) : undefined,
							sessionData.startingTime ? gt(sessionsTable.endingTime, sessionData.startingTime) : undefined,
						),
						// 2. Novo horário termina DENTRO de uma aula existente
						and(
							sessionData.endingTime ? lt(sessionsTable.startingTime, sessionData.endingTime) : undefined,
							sessionData.endingTime ? gt(sessionsTable.endingTime, sessionData.endingTime) : undefined,
						),
						// 3. Novo horário ENGLOBA completamente uma aula existente
						and(
							sessionData.startingTime ? gte(sessionsTable.startingTime, sessionData.startingTime) : undefined,
							sessionData.endingTime ? lte(sessionsTable.endingTime, sessionData.endingTime) : undefined,
						),
						// 4. Aula existente ENGLOBA completamente o novo horário
						and(
							sessionData.startingTime ? lte(sessionsTable.startingTime, sessionData.startingTime) : undefined,
							sessionData.endingTime ? gte(sessionsTable.endingTime, sessionData.endingTime) : undefined,
						),
					),
				),
			)
			.limit(1);

		if (conflictingSessions.length > 0) {
			throw new ConflictError("Conflito de horário: já existe uma aula agendada neste intervalo");
		}
		return sessionData;
	}
}
