import { relations } from "drizzle-orm";
import {
	bigint,
	date,
	mysqlTable,
	serial,
	varchar,
} from "drizzle-orm/mysql-core";
import { usersTable } from "./users-table";

export const studentsTable = mysqlTable("students", {
	id: serial("id").primaryKey(),
	userId: bigint("user_id", { mode: "number", unsigned: true }).references(
		() => usersTable.id,
	),
	birthDate: date("birth_date").notNull(),
	belt: varchar("belt", { length: 20 }).default("white"), // faixa atual do aluno
	emergencyContact: varchar("emergency_contact", { length: 100 }),
});

export const studentsRelations = relations(studentsTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [studentsTable.userId],
		references: [usersTable.id],
	}),
}));
