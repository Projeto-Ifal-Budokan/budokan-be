import { relations } from "drizzle-orm";
import {
	bigint,
	date,
	mysqlEnum,
	mysqlTable,
	timestamp,
	varchar,
} from "drizzle-orm/mysql-core";
import { matriculationsTable } from "../practitioner-schemas/matriculations";

export const dailyAbsencesTable = mysqlTable("tb_daily_absences", {
	id: bigint("id", { mode: "number", unsigned: true })
		.autoincrement()
		.primaryKey(),
	idMatriculation: bigint("id_matriculation", {
		mode: "number",
		unsigned: true,
	})
		.notNull()
		.references(() => matriculationsTable.id),
	date: date("date").notNull(),
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

export const dailyAbsencesRelations = relations(
	dailyAbsencesTable,
	({ one }) => ({
		matriculation: one(matriculationsTable, {
			fields: [dailyAbsencesTable.idMatriculation],
			references: [matriculationsTable.id],
		}),
	}),
);
