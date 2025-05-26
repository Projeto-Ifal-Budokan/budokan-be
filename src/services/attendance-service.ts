import { and, eq, gt, gte, lt, lte, or } from "drizzle-orm";
import { db } from "../db";
import { attendancesTable } from "../db/schema/attendance-schemas/attendances";
import { sessionsTable } from "../db/schema/attendance-schemas/sessions";
import { matriculationsTable } from "../db/schema/practitioner-schemas/matriculations";
import { disciplinesTable } from "../db/schema/discipline-schemas/disciplines";
import { ranksTable } from "../db/schema/discipline-schemas/ranks";
import { instructorDisciplinesTable } from "../db/schema/practitioner-schemas/instructor-disciplines";
import { instructorsTable } from "../db/schema/practitioner-schemas/instructors";
import type {
    CreateAttendanceInput,
    UpdateAttendanceInput,
} from "../schemas/attendance.schemas";

export class AttendanceService {
    async listAttendances() {
        const attendances = await db
            .select({
                id: attendancesTable.id,
                idInstructorDiscipline: attendancesTable.idInstructorDiscipline,
                idDiscipline: attendancesTable.idDiscipline,
                date: attendancesTable.date,
                startingTime: attendancesTable.startingTime,
                endingTime: attendancesTable.endingTime,
                createdAt: attendancesTable.createdAt,
                updatedAt: attendancesTable.updatedAt,
            })
            .from(attendancesTable);

        return attendances;
    }

    async getAttendanceById(id: number) {
        const attendance = await db
            .select({
                id: attendancesTable.id,
                idInstructorDiscipline: attendancesTable.idInstructorDiscipline,
                idDiscipline: attendancesTable.idDiscipline,
                date: attendancesTable.date,
                startingTime: attendancesTable.startingTime,
                endingTime: attendancesTable.endingTime,
                createdAt: attendancesTable.createdAt,
                updatedAt: attendancesTable.updatedAt,
            })
            .from(attendancesTable)
            .where(eq(attendancesTable.id, id));

        if (attendance.length === 0) {
            throw new Error("Aula não encontrada");
        }

        return attendance[0];
    }

    async getAttendancesByInstructorDiscipline(idInstructorDiscipline: number) {
        const attendances = await db
            .select({
                id: attendancesTable.id,
                idInstructorDiscipline: attendancesTable.idInstructorDiscipline,
                idDiscipline: attendancesTable.idDiscipline,
                date: attendancesTable.date,
                startingTime: attendancesTable.startingTime,
                endingTime: attendancesTable.endingTime,
                createdAt: attendancesTable.createdAt,
                updatedAt: attendancesTable.updatedAt,
            })
            .from(attendancesTable)
            .where(eq(attendancesTable.idInstructorDiscipline, idInstructorDiscipline));

        return attendances;
    }

    async createAttendance(data: CreateAttendanceInput) {
        const session = await db
            .select()
            .from(sessionsTable)
            .where(eq(sessionsTable.id, data.idSession));
        if (session.length === 0) {
            throw new Error("Aula não encontrada");
        };

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
            throw new Error("Nenhum aluno matriculado encontrado");
        };

        const attendanceData = matriculations.map((matriculation) => ({
            idMatriculation: matriculation.id,
            idSession: data.idSession,
        }));


        await db.insert(attendancesTable).values(attendanceData);

        return { message: "Frequência lançada" };
    }

    async updateAttendance(id: number, data: UpdateAttendanceInput) {
        const existingAttendance = await db
            .select()
            .from(attendancesTable)
            .where(eq(attendancesTable.id, id));

        if (existingAttendance.length === 0) {
            throw new Error("Matrícula não encontrada");
        }

        // Verificar se a graduação existe e pertence à disciplina da matrícula
        if (data.idRank) {
            const attendanceDiscipline = existingAttendance[0].idDiscipline;

            const rank = await db
                .select()
                .from(ranksTable)
                .where(
                    and(
                        eq(ranksTable.id, data.idRank),
                        eq(ranksTable.idDiscipline, attendanceDiscipline),
                    ),
                );

            if (rank.length === 0) {
                throw new Error(
                    "Graduação não encontrada ou não pertence à disciplina da matrícula",
                );
            }
        }

        await db.update(attendancesTable).set(data).where(eq(attendancesTable.id, id));

        return { message: "Matrícula atualizada com sucesso" };
    }

    async deleteAttendance(id: number) {
        const existingAttendance = await db
            .select()
            .from(attendancesTable)
            .where(eq(attendancesTable.id, id));

        if (existingAttendance.length === 0) {
            throw new Error("Matrícula não encontrada");
        }

        await db.delete(attendancesTable).where(eq(attendancesTable.id, id));

        return { message: "Matrícula excluída com sucesso" };
    }
}
