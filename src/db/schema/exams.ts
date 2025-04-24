import { relations } from "drizzle-orm";
import { bigint, date, mysqlEnum, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { disciplinesTable } from "./disciplines.ts";
import { instructorsTable } from "./instructors.ts";
import { studentsTable } from "./students.ts";
import { ranksTable } from "./ranks.ts";

export const examsTable = mysqlTable("tb_exams", {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
    idInstructor: bigint("id_instructor", {
        mode: "number",
        unsigned: true,
    })
        .notNull()
        .references(() => instructorsTable.idPractitioner),
    idStudent: bigint("id_student", {
        mode: "number",
        unsigned: true,
    })
        .notNull()
        .references(() => studentsTable.idPractitioner),
    idPreviousRank: bigint("id_previous_rank", { mode: "number", unsigned: true })
        .references(() => ranksTable.id),
    idNextRank: bigint("id_next_rank", { mode: "number", unsigned: true })
        .references(() => ranksTable.id),
    idDiscipline: bigint("id_discipline", {
        mode: "number",
        unsigned: true,
    })
        .notNull()
        .references(() => disciplinesTable.id),
    date: date("date").notNull(),
    examObservation: varchar("exam_observation", { length: 255 }),
    status: mysqlEnum("status", ["scheduled", "approved", "failed"]).notNull().default("scheduled"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const examsRelations = relations(
    examsTable,
    ({ one }) => ({
        instructor: one(instructorsTable, {
            fields: [examsTable.idInstructor],
            references: [instructorsTable.idPractitioner],
        }),
        student: one(studentsTable, {
            fields: [examsTable.idStudent],
            references: [studentsTable.idPractitioner],
        }),
        previousRank: one(ranksTable, {
            fields: [examsTable.idPreviousRank],
            references: [ranksTable.id]
        }),
        nextRank: one(ranksTable, {
            fields: [examsTable.idNextRank],
            references: [ranksTable.id]
        }),
        discipline: one(disciplinesTable, {
            fields: [examsTable.idDiscipline],
            references: [disciplinesTable.id],
        }),
    }),
);
