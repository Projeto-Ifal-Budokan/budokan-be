import { relations, sql } from "drizzle-orm";
import { bigint, mysqlEnum, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { examsTable } from "./exams";
import { instructorDisciplinesTable } from "../practitioner-schemas/instructor-disciplines";
import { matriculationsTable } from "../practitioner-schemas/matriculations";
import { ranksTable } from "./ranks";
import { sessionsTable } from "../attendance-schemas/sessions";
import { trainingSchedulesTable } from "./training-schedules";

export const disciplinesTable = mysqlTable("tb_disciplines", {
	id: bigint("id", { mode: "number", unsigned: true }).autoincrement().primaryKey(),
	name: varchar("name", { length: 100 }).notNull(),
	description: varchar("description", { length: 100 }).notNull(),
	status: mysqlEnum("status", ["active", "inactive", "suspended"])
		.notNull()
		.default("active"),
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
