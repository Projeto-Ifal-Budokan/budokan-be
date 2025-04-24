import { relations, sql } from "drizzle-orm";
import {
	bigint,
	mysqlEnum,
	mysqlTable,
	timestamp,
} from "drizzle-orm/mysql-core";
import { usersTable } from "./users.ts";
import { disciplinesTable } from "./disciplines.ts";
import { instructorsTable } from "./instructors.ts";
import { ranksTable } from "./ranks.ts";
import { sessionsTable } from "./sessions.ts";
import { foreignKey } from "drizzle-orm/mysql-core";

export const instructorDisciplinesTable = mysqlTable(
	"tb_instructor_disciplines",
	{
		id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
		idInstructor: bigint("id_instructor", {
			mode: "number",
			unsigned: true,
		})
			.notNull(),
		idDiscipline: bigint("id_discipline", {
			mode: "number",
			unsigned: true,
		})
			.notNull(),
		idRank: bigint("id_rank", {
				mode: "number",
				unsigned: true,
		}),
		status: mysqlEnum("status", ["active", "inactive", "suspended"])
			.notNull()
			.default("active"),
		activatedBy: bigint("activated_by", { mode: "number", unsigned: true })
			.references(() => usersTable.id)
			.default(sql`null`),
		inactivatedBy: bigint("inactivated_by", { mode: "number", unsigned: true })
			.references(() => usersTable.id)
			.default(sql`null`),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
	}, (table) => [
		foreignKey({
			columns: [table.idInstructor],
			foreignColumns: [instructorsTable.idPractitioner],
			name: "fk_tb_instructor_disciplines_id_practitioner"
		}),
		foreignKey({
			columns: [table.idDiscipline],
			foreignColumns: [disciplinesTable.id],
			name: "fk_tb_instructor_disciplines_id_discipline"
		}),
		foreignKey({
			columns: [table.idRank],
			foreignColumns: [ranksTable.id],
			name: "fk_tb_instructor_disciplines_id_rank"
		}),
	]
);


export const instructorDisciplinesRelations = relations(
	instructorDisciplinesTable,
	({ one, many }) => ({
		instructor: one(instructorsTable, {
			fields: [instructorDisciplinesTable.idInstructor],
			references: [instructorsTable.idPractitioner],
		}),
		discipline: one(disciplinesTable, {
			fields: [instructorDisciplinesTable.idDiscipline],
			references: [disciplinesTable.id],
		}),
		rank: one(ranksTable, {
				fields: [instructorDisciplinesTable.idRank],
				references: [ranksTable.id],
		}),
		activatedByUser: one(usersTable, {
			fields: [instructorDisciplinesTable.activatedBy],
			references: [usersTable.id],
		}),
		inactivatedByUser: one(usersTable, {
			fields: [instructorDisciplinesTable.inactivatedBy],
			references: [usersTable.id],
		}),
		sessions: many(sessionsTable),
	}),
);
