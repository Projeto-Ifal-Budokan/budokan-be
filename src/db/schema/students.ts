import { relations, sql } from "drizzle-orm";
import {
	bigint,
	date,
	datetime,
	mysqlTable,
	serial,
	varchar,
} from "drizzle-orm/mysql-core";
import { matriculationsTable } from "./matriculations.ts";
import { practitionersTable } from "./practitioners.ts";

export const studentsTable = mysqlTable("students", {
	id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
	practitionerId: bigint("practitioner_id", {
		mode: "number",
		unsigned: true,
	}).references(() => practitionersTable.id),
	createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
	updatedAt: datetime("updated_at").$onUpdate(() => new Date()),
});

export const studentsRelations = relations(studentsTable, ({ one, many }) => ({
	user: one(practitionersTable, {
		fields: [studentsTable.practitionerId],
		references: [practitionersTable.id],
	}),
	matriculation: many(matriculationsTable),
}));
