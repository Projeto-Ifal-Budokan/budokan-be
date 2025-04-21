import { relations, sql } from "drizzle-orm";
import {
	bigint,
	datetime,
	mysqlTable,
	serial,
	varchar,
} from "drizzle-orm/mysql-core";
import { instructorDisciplinesTable } from "./instructorDisciplines";
import { matriculationsTable } from "./matriculations";

export const disciplinesTable = mysqlTable("disciplines", {
	id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
	name: varchar("name", { length: 100 }).notNull(),
	description: varchar("description", { length: 100 }).notNull(),
	createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
	updatedAt: datetime("updated_at").$onUpdate(() => new Date()),
});

export const usersRelations = relations(disciplinesTable, ({ many }) => ({
	instructors: many(instructorDisciplinesTable),
	matriculations: many(matriculationsTable),
}));
