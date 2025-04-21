import { relations } from "drizzle-orm";
import { bigint, mysqlTable, timestamp } from "drizzle-orm/mysql-core";
import { matriculationsTable } from "./matriculations.ts";
import { practitionersTable } from "./practitioners.ts";

export const studentsTable = mysqlTable("tb_students", {
	id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
	idPractitioner: bigint("id_practitioner", { mode: "number", unsigned: true })
		.notNull()
		.references(() => practitionersTable.id),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const studentsRelations = relations(studentsTable, ({ one, many }) => ({
	user: one(practitionersTable, {
		fields: [studentsTable.idPractitioner],
		references: [practitionersTable.id],
	}),
	matriculation: many(matriculationsTable),
}));
