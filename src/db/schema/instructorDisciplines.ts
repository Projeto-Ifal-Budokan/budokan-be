import { relations, sql } from "drizzle-orm";
import {
	bigint,
	datetime,
	mysqlEnum,
	mysqlTable,
} from "drizzle-orm/mysql-core";
import { usersTable } from "../unifiedSchema.ts";
import { disciplinesTable } from "./disciplines.ts";
import { instructorsTable } from "./instructors.ts";

export const instructorDisciplinesTable = mysqlTable("instructor_disciplines", {
	id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
	instructorId: bigint("instructor_id", {
		mode: "number",
		unsigned: true,
	}).references(() => instructorsTable.id),
	disciplineId: bigint("discipline_id", {
		mode: "number",
		unsigned: true,
	}).references(() => disciplinesTable.id),
	status: mysqlEnum("status", ["active", "inactive", "suspended"])
		.notNull()
		.default("active"),
	activatedBy: bigint("activated_by", { mode: "number", unsigned: true })
		.references(() => usersTable.id)
		.default(sql`null`),
	inactivatedBy: bigint("inactivated_by", { mode: "number", unsigned: true })
		.references(() => usersTable.id)
		.default(sql`null`),
	createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
	updatedAt: datetime("updated_at").$onUpdate(() => new Date()),
});

export const instructorDisciplinesRelations = relations(
	instructorDisciplinesTable,
	({ one }) => ({
		instructor: one(instructorsTable, {
			fields: [instructorDisciplinesTable.instructorId],
			references: [instructorsTable.id],
		}),
		discipline: one(disciplinesTable, {
			fields: [instructorDisciplinesTable.disciplineId],
			references: [disciplinesTable.id],
		}),
		activatedByUser: one(usersTable, {
			fields: [instructorDisciplinesTable.activatedBy],
			references: [usersTable.id],
		}),
		inactivatedByUser: one(usersTable, {
			fields: [instructorDisciplinesTable.inactivatedBy],
			references: [usersTable.id],
		}),
	}),
);
