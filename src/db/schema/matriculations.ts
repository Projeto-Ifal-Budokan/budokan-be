import { relations, sql } from "drizzle-orm";
import {
	bigint,
	mysqlEnum,
	mysqlTable,
	timestamp,
	varchar,
} from "drizzle-orm/mysql-core";
import { usersTable } from "../unifiedSchema.ts";
import { disciplinesTable } from "./disciplines.ts";
import { studentsTable } from "./students.ts";

export const matriculationsTable = mysqlTable("tb_matriculations", {
	id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
	idStudent: bigint("id_student", {
		mode: "number",
		unsigned: true,
	})
		.notNull()
		.references(() => studentsTable.id),
	idDiscipline: bigint("id_discipline", {
		mode: "number",
		unsigned: true,
	})
		.notNull()
		.references(() => disciplinesTable.id),
	status: mysqlEnum("status", ["active", "inactive", "suspended"])
		.notNull()
		.default("active"),
	activatedBy: bigint("activated_by", {
		mode: "number",
		unsigned: true,
	}).references(() => usersTable.id), // Esse campo pode ser nulo, serve apenas de log
	inactivatedBy: bigint("inactivated_by", {
		mode: "number",
		unsigned: true,
	}).references(() => usersTable.id), // Esse campo pode ser nulo, serve apenas de log
	isPaymentExempt: mysqlEnum("is_payment_exempt", ["Y", "N"])
		.notNull()
		.default("N"), // Y = yes, N = no
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const matriculationsRelations = relations(
	matriculationsTable,
	({ one }) => ({
		student: one(studentsTable, {
			fields: [matriculationsTable.idStudent],
			references: [studentsTable.id],
		}),
		discipline: one(disciplinesTable, {
			fields: [matriculationsTable.idDiscipline],
			references: [disciplinesTable.id],
		}),
		activatedByUser: one(usersTable, {
			fields: [matriculationsTable.activatedBy],
			references: [usersTable.id],
		}),
		inactivatedByUser: one(usersTable, {
			fields: [matriculationsTable.inactivatedBy],
			references: [usersTable.id],
		}),
	}),
);
