import { relations } from "drizzle-orm";
import {
	bigint,
	mysqlEnum,
	mysqlTable,
	timestamp,
	varchar,
} from "drizzle-orm/mysql-core";
import { matriculationsTable } from "../practitioner-schemas/matriculations";
import { sessionsTable } from "./sessions";

export const attendancesTable = mysqlTable("tb_attendances", {
	id: bigint("id", { mode: "number", unsigned: true })
		.autoincrement()
		.primaryKey(),
	idMatriculation: bigint("id_matriculation", {
		mode: "number",
		unsigned: true,
	})
		.notNull()
		.references(() => matriculationsTable.id),
	idSession: bigint("id_session", { mode: "number", unsigned: true })
		.notNull()
		.references(() => sessionsTable.id),
	status: mysqlEnum("status", ["present", "absent"])
		.notNull()
		.default("absent"),
	justification: mysqlEnum("justification", [
		"medical",
		"personal",
		"professional",
		"weather",
		"transport",
		"family",
		"academic",
		"technical",
		"emergency",
		"other",
	]),
	justificationDescription: varchar("justification_description", {
		length: 255,
	}),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const attendancesRelations = relations(attendancesTable, ({ one }) => ({
	matriculation: one(matriculationsTable, {
		fields: [attendancesTable.idMatriculation],
		references: [matriculationsTable.id],
	}),
	session: one(sessionsTable, {
		fields: [attendancesTable.idSession],
		references: [sessionsTable.id],
	}),
}));
