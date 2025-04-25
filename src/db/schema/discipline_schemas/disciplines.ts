import { relations, sql } from "drizzle-orm";
import { bigint, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { examsTable } from "./exams";
import { instructorDisciplinesTable } from "../practitioner_schemas/instructorDisciplines";
import { matriculationsTable } from "../practitioner_schemas/matriculations";
import { ranksTable } from "./ranks";
import { sessionsTable } from "../attendance_schemas/sessions";
import { trainingSchedulesTable } from "./trainingSchedules";

export const disciplinesTable = mysqlTable("tb_disciplines", {
	id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
	name: varchar("name", { length: 100 }).notNull(),
	description: varchar("description", { length: 100 }).notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const disciplinesRelations = relations(disciplinesTable, ({ many }) => ({
	exams: many(examsTable),
	instructors: many(instructorDisciplinesTable),
	matriculations: many(matriculationsTable),
	ranks: many(ranksTable),
	sessions: many(sessionsTable),
	trainingSchedules: many(trainingSchedulesTable),
}));
