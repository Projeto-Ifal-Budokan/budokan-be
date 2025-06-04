import { and, eq } from "drizzle-orm";
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

export class AttendanceService {
	async listAttendances() {
		const attendances = await db.query.attendancesTable.findMany();
		if (attendances.length === 0) {
			throw new NotFoundError("Nenhum registro de frequência encontrado");
		}
		return attendances;
	}

	async getAttendanceByMatriculation(id: number) {
		const attendances = await db.query.attendancesTable.findMany({
			where: eq(attendancesTable.idMatriculation, id),
			with: {
				session: {
					with: {
						instructorDiscipline: {
							with: {
								discipline: {},
							},
						},
					},
				},
				matriculation: {
					with: {
						user: true,
					},
				},
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

		return { message: "Frequência atualizada com sucesso" };
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
}
