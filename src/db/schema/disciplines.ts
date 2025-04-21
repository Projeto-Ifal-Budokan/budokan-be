import { relations, sql } from "drizzle-orm";
import { bigint, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { instructorDisciplinesTable } from "./instructorDisciplines";
import { matriculationsTable } from "./matriculations";

export const disciplinesTable = mysqlTable("tb_disciplines", {
	id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
	name: varchar("name", { length: 100 }).notNull(),
	description: varchar("description", { length: 100 }).notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const usersRelations = relations(disciplinesTable, ({ many }) => ({
	instructors: many(instructorDisciplinesTable),
	matriculations: many(matriculationsTable),
}));
