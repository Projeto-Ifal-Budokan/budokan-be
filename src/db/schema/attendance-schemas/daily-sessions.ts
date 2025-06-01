import { relations } from "drizzle-orm";
import { bigint, date, mysqlTable, timestamp } from "drizzle-orm/mysql-core";
import { attendancesTable } from "./attendances.ts";
import { foreignKey } from "drizzle-orm/mysql-core";
import { instructorDisciplinesTable } from "../practitioner-schemas/instructor-disciplines.ts";
import { sessionsTable } from "./sessions.ts";

export const dailySessionsTable = mysqlTable("tb_daily_sessions", {
    id: bigint("id", { mode: "number", unsigned: true }).autoincrement().primaryKey(),
    idInstructorDiscipline: bigint("id_instructor_discipline", { mode: "number", unsigned: true })
        .notNull(),
    date: date("date").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
}, (table) => [
    foreignKey({
        columns: [table.idInstructorDiscipline],
        foreignColumns: [instructorDisciplinesTable.id],
        name: "fk_tb_daily_sessions_id_intructor_discipline"
    }),
]);

export const dailySessionsRelations = relations(
    dailySessionsTable,
    ({ one, many }) => ({
        instructorDiscipline: one(instructorDisciplinesTable, {
            fields: [dailySessionsTable.idInstructorDiscipline],
            references: [instructorDisciplinesTable.id],
        }),
        attendances: many(attendancesTable),
        sessions: many(sessionsTable),
    }),
);
