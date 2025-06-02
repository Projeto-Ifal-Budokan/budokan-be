import { SQL, and, desc, eq, gt, gte, inArray, lt, lte, or } from "drizzle-orm";
import { db } from "../db";
import { attendancesTable } from "../db/schema";
import { dailyAttendancesTable } from "../db/schema/attendance-schemas/daily-attendances";
import { dailySessionsTable } from "../db/schema/attendance-schemas/daily-sessions";
import { sessionsTable } from "../db/schema/attendance-schemas/sessions";
import { disciplinesTable } from "../db/schema/discipline-schemas/disciplines";
import { instructorDisciplinesTable } from "../db/schema/practitioner-schemas/instructor-disciplines";
import { instructorsTable } from "../db/schema/practitioner-schemas/instructors";
import { ConflictError, NotFoundError } from "../errors/app-errors";
import type {
	CreateSessionInput,
	ListSessionInput,
	UpdateSessionInput,
	ViewMatriculationSessionsInput,
} from "../schemas/session.schemas";
import { AttendanceService } from "./attendance-service";

// Define tipos para o schema do banco de dados
type SessionInsertType = {
	idDiscipline: number;
	date: Date;
	idInstructorDiscipline: number;
	idDailySession: number;
	startingTime: string;
	endingTime: string;
};

type SessionUpdateType = {
	idDiscipline?: number;
	date?: Date;
	idInstructorDiscipline?: number;
	idDailySession?: number;
	startingTime?: string;
	endingTime?: string;
};

export class SessionService {
	async listSessions(filters: ListSessionInput) {
		// busca os IDs de das disciplinas que o usuario é instrutor, se informada uma disciplina busca apenas o id dessa disciplina.
		const instructorDisciplineID = await db
			.select({
				id: instructorDisciplinesTable.id,
			})
			.from(instructorDisciplinesTable)
			.where(
				and(
					filters.idInstructor
						? eq(instructorDisciplinesTable.idInstructor, filters.idInstructor)
						: undefined,
					filters.idDiscipline
						? eq(instructorDisciplinesTable.idDiscipline, filters.idDiscipline)
						: undefined,
				),
			);

		// Buscar sessões ministradas por um instrutor específico
		const sessions = await db.query.sessionsTable.findMany({
			where: (session) => {
				const conditions = [
					filters.idDiscipline
						? eq(session.idDiscipline, filters.idDiscipline)
						: undefined,
					instructorDisciplineID.length > 0
						? inArray(
								session.idInstructorDiscipline,
								instructorDisciplineID.map((id) => id.id),
							)
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
									},
								},
							},
						},
					},
				},
			},
			orderBy: desc(sessionsTable.date),
			limit: filters.limit || 100, // Limite padrão de 100 sessões
		});

		if (sessions.length === 0) {
			throw new NotFoundError(
				"Nenhuma aula encontrada com os filtros informados",
			);
		}

		return sessions;
	}

	async viewMatriculationSessions(
		idMatriculation: number,
		data: ViewMatriculationSessionsInput,
	) {
		const baseQuery = db
			.select()
			.from(dailyAttendancesTable)
			.innerJoin(
				dailySessionsTable,
				eq(dailyAttendancesTable.idDailySession, dailySessionsTable.id),
			)
			.innerJoin(
				instructorDisciplinesTable,
				eq(
					dailySessionsTable.idInstructorDiscipline,
					instructorDisciplinesTable.id,
				),
			)
			.where(
				and(
					eq(dailyAttendancesTable.idMatriculation, idMatriculation),
					eq(instructorDisciplinesTable.idDiscipline, data.idDiscipline),
					// Adicionar filtros de data se fornecidos
					data.initialDate
						? gte(dailySessionsTable.date, new Date(data.initialDate))
						: undefined,
					data.finalDate
						? lte(dailySessionsTable.date, new Date(data.finalDate))
						: undefined,
				),
			);

		const attendance = await baseQuery;

		if (attendance.length === 0) {
			throw new NotFoundError("Nenhum registro de frequência encontrado");
		}
		return attendance;
	}

	async createSession(data: CreateSessionInput) {
		const validatedData = await this.validateSession(data);

		// Garantindo que idInstructorDiscipline não seja undefined
		if (!validatedData.idInstructorDiscipline) {
			throw new Error("ID do instrutor da disciplina não encontrado");
		}

		// Garantindo que os campos obrigatórios existam
		if (!validatedData.idDiscipline) {
			throw new Error("ID da disciplina é obrigatório");
		}

		if (!validatedData.startingTime || !validatedData.endingTime) {
			throw new Error("Horários de início e término são obrigatórios");
		}

		// Convertendo string para Date para compatibilidade com o banco
		const dateObj = validatedData.date
			? new Date(validatedData.date)
			: new Date();

		const idDailySession = await this.createDailySession(
			validatedData.idInstructorDiscipline,
			dateObj,
		);

		// Preparar dados para inserção conforme o schema da tabela
		const sessionData: SessionInsertType = {
			idDiscipline: validatedData.idDiscipline,
			idInstructorDiscipline: validatedData.idInstructorDiscipline,
			idDailySession,
			date: dateObj,
			startingTime: validatedData.startingTime,
			endingTime: validatedData.endingTime,
		};

		const result = await db.insert(sessionsTable).values(sessionData);

		// lancamento de presença para a nova aula
		const insertId =
			Array.isArray(result) && result[0]?.insertId
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

		const validatedData = await this.validateSession(data);

		// Preparar dados para atualização conforme o schema da tabela
		const sessionData: SessionUpdateType = {};

		// Copiar apenas os campos definidos para evitar undefined
		if (validatedData.idInstructorDiscipline)
			sessionData.idInstructorDiscipline = validatedData.idInstructorDiscipline;
		if (validatedData.idDiscipline)
			sessionData.idDiscipline = validatedData.idDiscipline;
		if (validatedData.startingTime)
			sessionData.startingTime = validatedData.startingTime;
		if (validatedData.endingTime)
			sessionData.endingTime = validatedData.endingTime;

		if (data.date) {
			// Converter string para Date
			const dateObj = new Date(data.date);
			sessionData.date = dateObj;

			if (existingSession[0].idInstructorDiscipline) {
				// Verificar se já existe uma sessão diária para esta data
				const idDailySession = await this.createDailySession(
					existingSession[0].idInstructorDiscipline,
					dateObj,
				);

				// Atualizar o idDailySession se for diferente
				if (idDailySession !== existingSession[0].idDailySession) {
					sessionData.idDailySession = idDailySession;
				}
			}
		}

		// Só realizar o update se houver campos para atualizar
		if (Object.keys(sessionData).length > 0) {
			await db
				.update(sessionsTable)
				.set(sessionData)
				.where(eq(sessionsTable.id, id));
		}

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
					eq(
						sessionsTable.idInstructorDiscipline,
						existingSession[0].idInstructorDiscipline,
					),
				),
			);

		if (stillHaveSessionsOfThisDay.length === 0) {
			await db
				.delete(dailyAttendancesTable)
				.where(
					eq(
						dailyAttendancesTable.idDailySession,
						existingSession[0].idDailySession,
					),
				);
			await db
				.delete(dailySessionsTable)
				.where(eq(dailySessionsTable.id, existingSession[0].idDailySession));
		}

		return { message: "Aula excluída com sucesso" };
	}

	async createDailySession(
		idInstructorDiscipline: number,
		date: Date,
	): Promise<number> {
		const existsDailySession = await db
			.select()
			.from(dailySessionsTable)
			.where(
				and(
					eq(dailySessionsTable.idInstructorDiscipline, idInstructorDiscipline),
					eq(dailySessionsTable.date, date),
				),
			);

		// Se já existe uma sessão diária para o instrutor e disciplina no dia informado, retorna o ID dessa sessão
		if (existsDailySession.length > 0) {
			return existsDailySession[0].id;
		}

		// Se não existe, cria uma nova sessão diária
		const insertDailySession = {
			idInstructorDiscipline,
			date,
		};

		const dailySessionResult = await db
			.insert(dailySessionsTable)
			.values(insertDailySession);

		const insertId =
			Array.isArray(dailySessionResult) && dailySessionResult[0]?.insertId
				? dailySessionResult[0].insertId
				: 0; // Default to 0 if no ID returned, will likely fail validation later

		// Se a inserção foi bem-sucedida, cria a frequência diária
		const attendanceService = new AttendanceService();
		if (insertId) {
			await attendanceService.createAttendanceDaily({
				idDailySession: insertId,
			});
		}

		return insertId;
	}

	async validateSession(data: CreateSessionInput | UpdateSessionInput) {
		// Objeto para armazenar os dados validados
		const validatedData: {
			idInstructorDiscipline?: number;
			idDiscipline?: number;
			startingTime?: string;
			endingTime?: string;
			date?: string;
		} = {};

		// Verificar se a disciplina existe
		if (data.idDiscipline) {
			const discipline = await db
				.select()
				.from(disciplinesTable)
				.where(eq(disciplinesTable.id, data.idDiscipline));

			if (discipline.length === 0) {
				throw new NotFoundError("Disciplina não encontrada");
			}

			validatedData.idDiscipline = data.idDiscipline;
		}

		// Verificar se o instrutor existe
		if (data.idInstructor) {
			const instructor = await db
				.select()
				.from(instructorsTable)
				.where(eq(instructorsTable.idPractitioner, data.idInstructor));

			if (instructor.length === 0) {
				throw new NotFoundError("Instrutor não encontrado");
			}
		}

		// Verificar se o instrutor é responsável pela disciplina informada
		if (data.idInstructor && data.idDiscipline) {
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
				throw new NotFoundError(
					"O instrutor informado não é responsável pela disciplina",
				);
			}

			validatedData.idInstructorDiscipline = instructorDisciplines[0].id;
		}

		// Copiar os dados de horário e data
		if (data.startingTime) validatedData.startingTime = data.startingTime;
		if (data.endingTime) validatedData.endingTime = data.endingTime;
		if (data.date) validatedData.date = data.date;

		// Verificar se já existe uma aula ativa para este dia e horario
		if (
			validatedData.idInstructorDiscipline &&
			validatedData.date &&
			validatedData.startingTime &&
			validatedData.endingTime
		) {
			const dateObj = new Date(validatedData.date);

			const conflictingSessions = await db
				.select()
				.from(sessionsTable)
				.where(
					and(
						// Mesma disciplina, mesmo instrutor e mesmo dia
						eq(
							sessionsTable.idInstructorDiscipline,
							validatedData.idInstructorDiscipline,
						),
						validatedData.idDiscipline
							? eq(sessionsTable.idDiscipline, validatedData.idDiscipline)
							: undefined,
						eq(sessionsTable.date, dateObj),

						// Verifica sobreposição de horários:
						or(
							// 1. Novo horário começa DENTRO de uma aula existente
							and(
								lt(sessionsTable.startingTime, validatedData.startingTime),
								gt(sessionsTable.endingTime, validatedData.startingTime),
							),
							// 2. Novo horário termina DENTRO de uma aula existente
							and(
								lt(sessionsTable.startingTime, validatedData.endingTime),
								gt(sessionsTable.endingTime, validatedData.endingTime),
							),
							// 3. Novo horário ENGLOBA completamente uma aula existente
							and(
								gte(sessionsTable.startingTime, validatedData.startingTime),
								lte(sessionsTable.endingTime, validatedData.endingTime),
							),
							// 4. Aula existente ENGLOBA completamente o novo horário
							and(
								lte(sessionsTable.startingTime, validatedData.startingTime),
								gte(sessionsTable.endingTime, validatedData.endingTime),
							),
						),
					),
				)
				.limit(1);

			if (conflictingSessions.length > 0) {
				throw new ConflictError(
					"Conflito de horário: já existe uma aula agendada neste intervalo",
				);
			}
		}

		return validatedData;
	}
}
