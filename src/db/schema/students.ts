import { sql, relations } from "drizzle-orm";
import {
	bigint,
	date,
	mysqlTable,
	serial,
	varchar,
	datetime
} from "drizzle-orm/mysql-core";
import { practitionersTable } from "./practitioners.ts";
import { matriculationsTable } from "./matriculations.ts";

export const studentsTable = mysqlTable("students", {
	id: serial("id").primaryKey(),
	practitionerId: bigint("practitioner_id", { mode: "number", unsigned: true }).references(
		() => practitionersTable.id,
	),
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
