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
	// TODO: belt será por consulta em exams e emergencyContacts tem tabela de relacionamento com users
	// belt: varchar("belt", { length: 20 }).default("white"), // faixa atual do aluno
	// emergencyContact: varchar("emergency_contact", { length: 100 }),
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
