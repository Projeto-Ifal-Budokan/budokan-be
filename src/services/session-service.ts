import {
	and,
	count,
	desc,
	eq,
	gt,
	gte,
	inArray,
	lt,
	lte,
	or,
} from "drizzle-orm";
import { DateTime } from "luxon";
import { db } from "../db";
import { attendancesTable } from "../db/schema";
import { sessionsTable } from "../db/schema/attendance-schemas/sessions";
import { disciplinesTable } from "../db/schema/discipline-schemas/disciplines";
import { instructorDisciplinesTable } from "../db/schema/practitioner-schemas/instructor-disciplines";
import { instructorsTable } from "../db/schema/practitioner-schemas/instructors";
import { matriculationsTable } from "../db/schema/practitioner-schemas/matriculations";
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
	startingTime: string;
	endingTime: string;
	isLastSessionOfDay: boolean;
};

type SessionUpdateType = {
	idDiscipline?: number;
	date?: Date;
	idInstructorDiscipline?: number;
	startingTime?: string;
	endingTime?: string;
	isLastSessionOfDay?: boolean;
};

export class SessionService {
	async listSessions(
		filters: ListSessionInput,
		pagination?: { limit: number; offset: number },
	) {
		const { limit, offset } = pagination || { limit: 10, offset: 0 };

		// busca os IDs de das disciplinas que o usuario é instrutor
		let instructorDisciplineIDs: { id: number }[] = [];
		if (filters.idInstructor) {
			instructorDisciplineIDs = await db
				.select({
					id: instructorDisciplinesTable.id,
				})
				.from(instructorDisciplinesTable)
				.where(
					and(
						eq(instructorDisciplinesTable.idInstructor, filters.idInstructor),
						filters.idDiscipline
							? eq(
									instructorDisciplinesTable.idDiscipline,
									filters.idDiscipline,
								)
							: undefined,
					),
				);
		}

		const conditions = [
			filters.idDiscipline
				? eq(sessionsTable.idDiscipline, filters.idDiscipline)
				: undefined,
			filters.idInstructor
				? instructorDisciplineIDs.length > 0
					? inArray(
							sessionsTable.idInstructorDiscipline,
							instructorDisciplineIDs.map((id) => id.id),
						)
					: eq(sessionsTable.id, -1) // força retornar vazio quando não encontra instructor_disciplines
				: undefined,
			filters.initialDate
				? gte(
						sessionsTable.date,
						DateTime.fromISO(filters.initialDate).toJSDate(),
					)
				: undefined,
			filters.finalDate
				? lte(
						sessionsTable.date,
						DateTime.fromISO(filters.finalDate).toJSDate(),
					)
				: undefined,
		].filter(Boolean);

		const [sessions, [{ count: total }]] = await Promise.all([
			db.query.sessionsTable.findMany({
				where:
					conditions.length > 0 ? (session) => and(...conditions) : undefined,
				columns: {
					id: true,
					idDiscipline: true,
					idInstructorDiscipline: true,
					date: true,
					startingTime: true,
					endingTime: true,
				},
				with: {
					attendances: {
						columns: {
							id: true,
							idMatriculation: true,
							idSession: true,
							status: true,
						},
					},
				},
				orderBy: desc(sessionsTable.date),
				limit,
				offset,
			}),
			db
				.select({ count: count() })
				.from(sessionsTable)
				.where(conditions.length > 0 ? and(...conditions) : undefined),
		]);

		return { items: sessions, count: Number(total) };
	}

	async viewMatriculationSessions(
		idMatriculation: number,
		data: ViewMatriculationSessionsInput,
		pagination?: { limit: number; offset: number },
	) {
		const { limit, offset } = pagination || { limit: 10, offset: 0 };

		const conditions = [
			eq(attendancesTable.idMatriculation, idMatriculation),
			data.idDiscipline
				? eq(sessionsTable.idDiscipline, data.idDiscipline)
				: undefined,
			data.initialDate
				? gte(sessionsTable.date, DateTime.fromISO(data.initialDate).toJSDate())
				: undefined,
			data.finalDate
				? lte(sessionsTable.date, DateTime.fromISO(data.finalDate).toJSDate())
				: undefined,
		].filter(Boolean);

		const [sessions, [{ count: total }]] = await Promise.all([
			db
				.select({
					idSession: attendancesTable.idSession,
					idAttendance: attendancesTable.id,
					status: attendancesTable.status,
					date: sessionsTable.date,
					startingTime: sessionsTable.startingTime,
					endingTime: sessionsTable.endingTime,
					idDiscipline: sessionsTable.idDiscipline,
					idInstructorDiscipline: sessionsTable.idInstructorDiscipline,
				})
				.from(attendancesTable)
				.innerJoin(
					sessionsTable,
					eq(attendancesTable.idSession, sessionsTable.id),
				)
				.where(and(...conditions))
				.orderBy(desc(sessionsTable.date))
				.limit(limit)
				.offset(offset),
			db
				.select({ count: count() })
				.from(attendancesTable)
				.innerJoin(
					sessionsTable,
					eq(attendancesTable.idSession, sessionsTable.id),
				)
				.where(and(...conditions)),
		]);

		return { items: sessions, count: Number(total) };
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

		// Verifica se existem matrículas ativas para esta disciplina
		const activeMatriculations = await db
			.select()
			.from(matriculationsTable)
			.where(
				and(
					eq(matriculationsTable.idDiscipline, validatedData.idDiscipline),
					eq(matriculationsTable.status, "active"),
				),
			);

		if (activeMatriculations.length === 0) {
			throw new NotFoundError(
				"Não é possível criar uma aula para uma disciplina sem alunos matriculados ativos",
			);
		}

		// Convertendo string para Date para compatibilidade com o banco
		// Usando Luxon para garantir que a data seja tratada corretamente
		const dateObj = validatedData.date
			? DateTime.fromISO(validatedData.date).toJSDate()
			: new Date();

		// Preparar dados para inserção conforme o schema da tabela
		const sessionData: SessionInsertType = {
			idDiscipline: validatedData.idDiscipline,
			idInstructorDiscipline: validatedData.idInstructorDiscipline,
			date: dateObj,
			startingTime: validatedData.startingTime,
			endingTime: validatedData.endingTime,
			isLastSessionOfDay: data.isLastSessionOfDay || false,
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
		let disciplineChanged = false;

		// Se a disciplina está sendo alterada, verificar se existem matrículas ativas
		if (
			validatedData.idDiscipline &&
			validatedData.idDiscipline !== existingSession[0].idDiscipline
		) {
			disciplineChanged = true;
			const activeMatriculations = await db
				.select()
				.from(matriculationsTable)
				.where(
					and(
						eq(matriculationsTable.idDiscipline, validatedData.idDiscipline),
						eq(matriculationsTable.status, "active"),
					),
				);

			if (activeMatriculations.length === 0) {
				throw new NotFoundError(
					"Não é possível transferir a aula para uma disciplina sem alunos matriculados ativos",
				);
			}
		}

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
		if (data.isLastSessionOfDay !== undefined)
			sessionData.isLastSessionOfDay = data.isLastSessionOfDay;

		if (data.date) {
			// Converter string para Date usando Luxon para garantir o fuso horário correto
			const dateObj = DateTime.fromISO(data.date).toJSDate();
			sessionData.date = dateObj;
		}

		// Só realizar o update se houver campos para atualizar
		if (Object.keys(sessionData).length > 0) {
			await db
				.update(sessionsTable)
				.set(sessionData)
				.where(eq(sessionsTable.id, id));
		}

		// Se a disciplina foi alterada, recriar as frequências para a nova disciplina
		if (disciplineChanged && validatedData.idDiscipline) {
			// Primeiro, excluir todas as frequências existentes para esta aula
			await db
				.delete(attendancesTable)
				.where(eq(attendancesTable.idSession, id));

			// Buscar todas as matrículas ativas da nova disciplina
			const newMatriculations = await db
				.select()
				.from(matriculationsTable)
				.where(
					and(
						eq(matriculationsTable.idDiscipline, validatedData.idDiscipline),
						eq(matriculationsTable.status, "active"),
					),
				);

			// Criar novos registros de frequência para cada matrícula
			const attendanceData = newMatriculations.map((matriculation) => ({
				idMatriculation: matriculation.id,
				idSession: id,
			}));

			if (attendanceData.length > 0) {
				await db.insert(attendancesTable).values(attendanceData);
			}
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

		// Primeiro exclui as frequências associadas à aula
		await db.delete(attendancesTable).where(eq(attendancesTable.idSession, id));

		// Depois exclui a aula
		await db.delete(sessionsTable).where(eq(sessionsTable.id, id));

		return { message: "Aula excluída com sucesso" };
	}

	async validateSession(data: CreateSessionInput | UpdateSessionInput) {
		// Objeto para armazenar os dados validados
		const validatedData: {
			idInstructorDiscipline?: number;
			idDiscipline?: number;
			startingTime?: string;
			endingTime?: string;
			date?: string;
			isLastSessionOfDay?: boolean;
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
		if ("isLastSessionOfDay" in data)
			validatedData.isLastSessionOfDay = data.isLastSessionOfDay;

		// Verificar se já existe uma aula ativa para este dia e horario
		if (
			validatedData.idInstructorDiscipline &&
			validatedData.date &&
			validatedData.startingTime &&
			validatedData.endingTime
		) {
			// Usando Luxon para garantir o fuso horário correto
			const dateObj = DateTime.fromISO(validatedData.date).toJSDate();

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
