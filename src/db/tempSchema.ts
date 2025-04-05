import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { date } from "drizzle-orm/mysql-core";
import { datetime } from "drizzle-orm/mysql-core";
import {
	bigint,
	mysqlTable,
	serial,
	text,
	varchar,
} from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable("users_table", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 100 }).notNull(),
	email: varchar("email", { length: 150 }).notNull().unique(),
	passwordHash: varchar("password_hash", { length: 255 }).notNull(),
	role: varchar("role", { length: 20 }).notNull(), // 'student', 'instructor', 'admin'
	status: varchar("status", { length: 20 }).default("inactive"), // 'active' or 'inactive'
	createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
	updatedAt: datetime("updated_at"),
});

export const instructorsTable = mysqlTable("instructors", {
	id: serial("id").primaryKey(),
	userId: bigint("user_id", { mode: "number", unsigned: true })
		.notNull()
		.references(() => usersTable.id),
	bio: text("bio"), // breve descrição do sensei
	rank: varchar("rank", { length: 50 }), // graduação, como faixa preta 2º dan
});

export const instructorsRelations = relations(instructorsTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [instructorsTable.userId],
		references: [usersTable.id],
	}),
}));

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
