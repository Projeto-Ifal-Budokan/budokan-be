import { relations } from "drizzle-orm";
import { bigint, date, mysqlTable, time, timestamp } from "drizzle-orm/mysql-core";
import { attendancesTable } from "./attendances.ts";
import { disciplinesTable } from "./disciplines.ts";
import { instructorDisciplinesTable } from "./instructorDisciplines.ts";

export const sessionsTable = mysqlTable("tb_sessions", {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
    idInstructorDiscipline: bigint("id_instructor_discipline", { mode: "number", unsigned: true })
        .notNull()
        .references(() => instructorDisciplinesTable.id),
    idDiscipline: bigint("id_discipline", { mode: "number", unsigned: true })
    .notNull()
    .references(() => disciplinesTable.id),
    date: date("date").notNull(), 
    startingTime: time("starting_time").notNull(),
    endingTime: time("ending_time").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const sessionsRelations = relations(
    sessionsTable,
    ({ one, many }) => ({
        instructor: one(instructorDisciplinesTable, {
            fields: [sessionsTable.idInstructorDiscipline],
            references: [instructorDisciplinesTable.id],
        }),
        discipline: one(disciplinesTable, {
            fields: [sessionsTable.idDiscipline],
            references: [disciplinesTable.id],
        }),
        attendances: many(attendancesTable),
    }),
);
