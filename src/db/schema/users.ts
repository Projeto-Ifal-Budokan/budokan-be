import { sql } from "drizzle-orm";
import { bigint } from "drizzle-orm/mysql-core";
import { datetime, mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable("users", {
	id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
	firstName: varchar("first_name", { length: 100 }).notNull(),
	surname: varchar("surname", { length: 100 }).notNull(),
	phone: varchar("phone", { length: 20 }),
	birthDate: datetime("birth_date"),
	email: varchar("email", { length: 150 }).notNull().unique(),
	passwordHash: varchar("password_hash", { length: 255 }).notNull(),
	role: varchar("role", { length: 20 }).notNull(), // 'student', 'instructor', 'admin'
	status: varchar("status", { length: 20 }).default("inactive"), // 'active' or 'inactive'
	createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
	updatedAt: datetime("updated_at").$onUpdate(() => new Date()),
});
