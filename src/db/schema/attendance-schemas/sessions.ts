import { relations } from "drizzle-orm";
import {
	bigint,
	boolean,
	date,
	mysqlTable,
	time,
	timestamp,
} from "drizzle-orm/mysql-core";
import { foreignKey } from "drizzle-orm/mysql-core";
import { disciplinesTable } from "../discipline-schemas/disciplines.ts";
import { instructorDisciplinesTable } from "../practitioner-schemas/instructor-disciplines.ts";
import { attendancesTable } from "./attendances.ts";

export const sessionsTable = mysqlTable(
	"tb_sessions",
	{
		id: bigint("id", { mode: "number", unsigned: true })
			.autoincrement()
			.primaryKey(),
		idInstructorDiscipline: bigint("id_instructor_discipline", {
			mode: "number",
			unsigned: true,
		}).notNull(),
		idDiscipline: bigint("id_discipline", { mode: "number", unsigned: true })
			.notNull()
			.references(() => disciplinesTable.id),
		date: date("date").notNull(),
		startingTime: time("starting_time").notNull(),
		endingTime: time("ending_time").notNull(),
		isLastSessionOfDay: boolean("is_last_session_of_day")
			.notNull()
			.default(false),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
	},
	(table) => [
		foreignKey({
			columns: [table.idInstructorDiscipline],
			foreignColumns: [instructorDisciplinesTable.id],
			name: "fk_tb_sessions_id_intructor_discipline",
		}),
	],
);

export const sessionsRelations = relations(sessionsTable, ({ one, many }) => ({
	instructorDiscipline: one(instructorDisciplinesTable, {
		fields: [sessionsTable.idInstructorDiscipline],
		references: [instructorDisciplinesTable.id],
	}),
	discipline: one(disciplinesTable, {
		fields: [sessionsTable.idDiscipline],
		references: [disciplinesTable.id],
	}),
	attendances: many(attendancesTable),
}));
